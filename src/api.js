'use strict'
const express = require('express');
const app = express();

app.use(express.json());

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({ error: error.message })
})

const OrdersController = require('./controllers/OrdersController')
const PizzasController = require('./controllers/PizzasController')

app.get('/api/orders', OrdersController.allOrders)
app.get('/api/orders/:id', OrdersController.orderById)
app.get('/api/pizzas', PizzasController.allPizzas)

module.exports = app