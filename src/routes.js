'use strict'
const express = require('express');
const OrdersController = require('./controllers/OrdersController')
const PizzasController = require('./controllers/PizzasController');
const validateDto = require('./middleware/validateDto')
const dto = require('./dto/order')
const apiErrorHandler = require('./error/apiErrorHandler');

const app = express();

app.use(express.json());

app.route('/api/orders')
    .get(OrdersController.allOrders)
    .post(validateDto(dto.ordersArraySchema), OrdersController.newOrders)
app.get('/api/orders/:id', OrdersController.orderById)
app.get('/api/pizzas', PizzasController.allPizzas)

app.use(apiErrorHandler);
module.exports = app