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
            return res.json(pizzas);
        } catch (error) {
            next(error)
        }
    }
}