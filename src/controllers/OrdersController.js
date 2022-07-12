'use strict'
const knex = require('../database');
const ApiError = require('../error/ApiError');
module.exports = {
    async allOrders(req, res, next) {
        try {
            const rows = await knex.select('orders.id', 'orders.table_number', 'pizzas.name', 'items.quantity')
                .from('orders')
                .join('items', 'orders.id', '=', 'items.order_id')
                .join('pizzas', 'items.pizza_id', '=', 'pizzas.id')
                .orderBy('orders.id', 'asc');

            const orders = dbToJson(rows)

            return res.json(orders)

        } catch (error) {
            next(error)

        }
    },

    async orderById(req, res, next) {
        try {
            const { id } = req.params;
            const rows = await knex.select('orders.id', 'orders.table_number', 'pizzas.name', 'items.quantity')
                .from('orders')
                .join('items', 'orders.id', '=', 'items.order_id')
                .join('pizzas', 'items.pizza_id', '=', 'pizzas.id')
                .where('orders.id', parseInt(id, 10));

            if (rows.length < 1) throw new ApiError(404, `Order id: ${id} not found.`)

            const order = dbToJson(rows)

            return res.json(order[0])

        } catch (error) {
            next(error)
        }
    },

    async newOrders(req, res, next) {
        try {
            const orders = []
            let result;
            await knex.transaction(async trx => {
                const pizzas = [];
                for (const order of req.body) {
                    for (const item of order.items) {
                        pizzas.push(item.pizza)
                    }
                }
                const pizzasIds = await trx('pizzas').select('id', 'name').whereIn('name', pizzas)
                for (const order of req.body) {
                    const orderId = await trx('orders').insert({ 'table_number': order.table_number })
                    orders.push(orderId[0])
                    await trx('items').insert(order.items.map(item => {
                        const pizza = pizzasIds.find(pizza => pizza.name == item.pizza)
                        if (!pizza) throw new ApiError(404, `Pizza name: ${item.pizza} not found`)
                        return {
                            'order_id': orderId,
                            'pizza_id': pizza.id,
                            'quantity': item.quantity
                        }
                    }))
                }
                const rows = await trx.select('orders.id', 'orders.table_number', 'pizzas.name', 'items.quantity')
                    .from('orders')
                    .join('items', 'orders.id', '=', 'items.order_id')
                    .join('pizzas', 'items.pizza_id', '=', 'pizzas.id')
                    .whereIn('orders.id', orders);
                result = dbToJson(rows)
            })
            res.status(201).json(result)
        } catch (error) {
            next(error)
        }
    }
}
function dbToJson(rows) {
    let orders = new Array();
    let i = 0;
    let currentOrderIndex = 0;
    while (i < rows.length) {
        orders.push({ 'id': rows[i].id, 'table_number': rows[i].table_number, 'items': [] })
        let currentOrder = rows[i].id;
        while ((i < rows.length) && (currentOrder === rows[i].id)) {
            orders[currentOrderIndex].items.push({ 'pizza': rows[i].name, 'quantity': rows[i].quantity })
            i++;
        }
        currentOrderIndex++;
    }
    return orders
}