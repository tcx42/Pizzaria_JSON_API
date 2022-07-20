'use strict'
const express = require('express');
const OrdersController = require('./controllers/OrdersController')
const PizzasController = require('./controllers/PizzasController');
const validateDto = require('./middleware/validateDto')
const dto = require('./dto/dto')
const apiErrorHandler = require('./error/apiErrorHandler');

const app = express();

app.use(express.json());

app.route('/api/orders')
    .get(OrdersController.allOrders)
    .post(validateDto(dto.ordersArraySchema), OrdersController.newOrders)
app.route('/api/orders/:id')
    .get(OrdersController.orderById)
    .delete(OrdersController.deleteOrders)
app.route('/api/pizzas')
    .get(PizzasController.allPizzas)
    .post(validateDto(dto.pizzaArraySchema), PizzasController.newPizzas)
app.route('/api/pizzas/:id')
    .put(validateDto(dto.pizzaToUpdateSchema), PizzasController.updatePizza)
    .delete(PizzasController.deletePizza)

app.use(apiErrorHandler);
module.exports = app