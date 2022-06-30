const request = require('supertest')
const api = require('../src/api')
const knexfile = require('../knexfile')
const knex = require('knex')(knexfile['development'])

afterAll(() => {
    knex.destroy();
})

describe('GET /orders', () => {
    test('should respond with a list of orders', async () => {
        try {
            const res = await request(api).get('/api/orders')
            const rows = await knex.select('orders.id', 'pizzas.name', 'items.quantity').from('orders')
                .join('items', 'orders.id', '=', 'items.order_id')
                .join('pizzas', 'items.pizza_id', '=', 'pizzas.id')
                .orderBy('orders.id', 'asc')
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
            expect(res.statusCode).toBe(200)
            expect(res.body).toBeDefined
            expect(orders).toBeDefined
            expect(res.body).toEqual(orders)
        } catch (error) {
            console.error(error)
        }
    })
})
describe('GET /orders/:id', () => {
    test('should respond with details of an order', async () => {
        try {
            const res = await request(api).get('/api/orders/1')
            const rows = await knex.select('orders.id', 'pizzas.name', 'items.quantity').from('orders')
                .join('items', 'orders.id', '=', 'items.order_id')
                .join('pizzas', 'items.pizza_id', '=', 'pizzas.id')
                .where('orders.id', 1)
            let order = { 'id': rows[0].id, 'items': [] };
            for (let i = 0; i < rows.length; i++) {
                order.items.push({ 'pizza': rows[i].name, 'quantity': rows[i].quantity })
            }
            expect(res.body).toEqual(order)
        } catch (error) {
            console.error(error)
        }
    })
    test('Should respond with 404 case invalid id', async () => {
        const res = await request(api).get('/api/orders/7')
        expect(res.statusCode).toBe(404)
    })
})
describe('GET /pizzas', () => {
    test('should respond with a list of pizzas', async () => {
        try {
            const res = await request(api).get('/api/pizzas')
            expect(res.statusCode).toBe(200)
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
                while (currentPizza === rows[i].id) {
                    pizzas[currentPizzaIndex].ingredients.push(rows[i].ingredient);
                    i++;
                    if (i >= rows.length) break;
                }
                currentPizzaIndex++;
            }
            expect(res.body).toBeDefined
            expect(pizzas).toBeDefined
            expect(res.body).toEqual(pizzas)
        } catch (error) {
            console.error(error)
        }
    })
})