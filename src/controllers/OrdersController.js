'use strict'
const knex = require('../database')
module.exports = {
    async allOrders(req, res, next) {
        try {
            const rows = await knex.select('orders.id', 'pizzas.name', 'items.quantity')
                .from('orders')
                .join('items', 'orders.id', '=', 'items.order_id')
                .join('pizzas', 'items.pizza_id', '=', 'pizzas.id')
                .orderBy('orders.id', 'asc');

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

            return res.json(orders)

        } catch (error) {
            next(error)

        }
    },

    async orderById(req, res, next) {
        try {
            const { id } = req.params;
            const rows = await knex.select('orders.id', 'pizzas.name', 'items.quantity')
                .from('orders')
                .join('items', 'orders.id', '=', 'items.order_id')
                .join('pizzas', 'items.pizza_id', '=', 'pizzas.id')
                .where('orders.id', parseInt(id, 10));

            if (rows.length < 1) return res.status(404).send()

            let order = { 'id': rows[0].id, 'items': [] };
            for (let i = 0; i < rows.length; i++) {
                order.items.push({ 'pizza': rows[i].name, 'quantity': rows[i].quantity })
            }

            return res.json(order)

        } catch (error) {
            next(error)
        }
    }
}