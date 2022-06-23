'use strict'
const express = require('express');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
function connectDatabase(file = './data.db') {
    return sqlite.open({ filename: file, driver: sqlite3.Database })
}
const app = express();
app.use(express.json());

app.route('/api/orders')
    .get(async (req, res) => {
        try {
            const db = await connectDatabase();
            const rows = await db.all(`SELECT orders.id, pizzas.name, items.quantity FROM orders
                                    JOIN items on orders.id = items.order_id
                                    JOIN pizzas on items.pizza = pizzas.id ORDER BY orders.id ASC`)
            let orders = new Array();
            let i = 0;
            let currentOrderIndex = 0;
            while (i < rows.length) {
                orders.push({ 'id': rows[i].id, 'items': [] })
                let currentOrder = rows[i].id;
                while ((i < rows.length) && (currentOrder === rows[i].id)) {
                    orders[currentOrderIndex].items.push({ 'pizza': rows[i].name, 'quantity': rows[i].quantity })
                    i++;
                }
                currentOrderIndex++;
            }
            res.status(200).send(orders)
            await db.close()
        } catch (error) {
            console.error(err);
            res.status(500).send()
        }
    })

app.route('/api/orders/:id')
    .get(async (req, res) => {
        const { id } = req.params;
        try {
            const db = await connectDatabase();
            const rows = await db.all(`SELECT orders.id, pizzas.name, items.quantity FROM orders
                                JOIN items on orders.id = items.order_id
                                JOIN pizzas on items.pizza = pizzas.id WHERE orders.id = ?`, parseInt(id, 10))
            if (rows.length < 1) return res.status(404).send()
            let order = { 'id': rows[0].id, 'items': [] };
            for (let i = 0; i < rows.length; i++) {
                order.items.push({ 'pizza': rows[i].name, 'quantity': rows[i].quantity })
            }
            res.status(200).send(order)
            await db.close();
        } catch (error) {
            console.error(error)
            res.status(500).send()
        }
    })

app.route('/api/pizzas')
    .get(async (req, res) => {
        try {
            const db = await connectDatabase();
            const rows = await db.all(`SELECT pizzas.id, pizzas.name, pizzas.price, ingredients.ingredient FROM pizzas
                                JOIN pizza_ingredients on pizzas.id = pizza_ingredients.pizza_id 
                                JOIN ingredients on pizza_ingredients.ingredient_id = ingredients.id
                                ORDER BY pizzas.id ASC;`);
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
            res.status(200).send(pizzas);
            await db.close();
        } catch (error) {
            console.error(error);
            res.status(500).send()
        }
    })

module.exports = app