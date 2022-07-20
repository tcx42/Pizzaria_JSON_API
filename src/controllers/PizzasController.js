'use strict'
const knex = require('../database')
module.exports = {
    async allPizzas(req, res, next) {
        try {
            const rows = await knex.select('pizzas.id', 'pizzas.name', 'pizzas.price', 'ingredients.ingredient')
                .from('pizzas')
                .join('pizza_ingredients', 'pizzas.id', '=', 'pizza_ingredients.pizza_id')
                .join('ingredients', 'pizza_ingredients.ingredient_id', '=', 'ingredients.id')
                .orderBy('pizzas.id', 'asc')
            return res.json(dbToJson(rows));
        } catch (error) {
            next(error)
        }
    },
    async newPizzas(req, res, next) {
        try {
            const rows = await knex.transaction(async trx => {
                let pizzasIds = [];
                for (const pizza of req.body) {
                    const rows = await trx('pizzas').insert({ 'name': pizza.name, 'price': pizza.price })
                    const pizzaId = rows[0]
                    pizzasIds.push(pizzaId)
                    for (const ingredient of pizza.ingredients) {
                        const ingredientId = await getOrInsertIngredient(trx, ingredient)
                        await trx('pizza_ingredients').insert({ 'pizza_id': pizzaId, 'ingredient_id': ingredientId })
                    }
                }
                return await trx.select('pizzas.id', 'pizzas.name', 'pizzas.price', 'ingredients.ingredient')
                    .from('pizzas')
                    .join('pizza_ingredients', 'pizzas.id', '=', 'pizza_ingredients.pizza_id')
                    .join('ingredients', 'pizza_ingredients.ingredient_id', '=', 'ingredients.id')
                    .whereIn('pizzas.id', pizzasIds)
                    .orderBy('pizzas.id', 'asc')
            })
            return res.json(dbToJson(rows))
        } catch (error) {
            next(error)
        }
        async function getOrInsertIngredient(trx, ingredient) {
            const rows = await trx('ingredients').select('id').whereLike('ingredient', ingredient)
            if (rows.length < 1) {
                const arr = await trx('ingredients').insert({ 'ingredient': ingredient })
                return arr[0]
            }
            return rows[0].id
        }
    },
    async updatePizza(req, res, next) {
        try {
            const { id } = req.params;
            const rows = await knex.transaction(async trx => {
                await trx('pizzas').where('id', id).update({ 'name': req.body.name, 'price': req.body.price })
                return await trx.select('pizzas.id', 'pizzas.name', 'pizzas.price', 'ingredients.ingredient')
                    .from('pizzas')
                    .join('pizza_ingredients', 'pizzas.id', '=', 'pizza_ingredients.pizza_id')
                    .join('ingredients', 'pizza_ingredients.ingredient_id', '=', 'ingredients.id')
                    .where('pizzas.id', id)
                    .orderBy('pizzas.id', 'asc')
            })
            return res.status(200).json(dbToJson(rows)[0])
        } catch (error) {
            next(error)
        }
    },
    async deletePizza(req, res, next) {
        const { id } = req.params;
        await knex.transaction(async trx => {
            await trx('pizzas').where('id', id).del()
            await trx('pizza_ingredients').where('pizza_id', id).del()
        })
        return res.json(`Pizza id: ${id} deleted`)
    }
}
function dbToJson(rows) {
    let pizzas = new Array();
    let i = 0;
    let currentPizzaIndex = 0;
    while (i < rows.length) {
        pizzas.push({ 'name': rows[i].name, 'price': rows[i].price, 'ingredients': [] })
        let currentPizza = rows[i].id;
        while ((i < rows.length) && (currentPizza === rows[i].id)) {
            pizzas[currentPizzaIndex].ingredients.push(rows[i].ingredient);
            i++;
        }
        currentPizzaIndex++;
    }
    return pizzas
}