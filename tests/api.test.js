const request = require('supertest')
const fs = require('fs/promises')
const api = require('../api')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:', sqlite3.OPEN_READWRITE, err => { if (err) return console.error(err) })

beforeAll(async () => {
    try {
        const sql = (await fs.readFile('./tests/testData.sql')).toString()
        db.exec(sql, err => { if (err) return console.error(err) })
    } catch (error) {
        console.error(error)
    }
})
afterAll(() => {
    db.close(err => { if (err) return console.error(err) });
})

describe('GET /orders', () => {
    test('should respond with a list of orders', async () => {
        const res = await request(api).get('/api/orders')
        db.all(`SELECT orders.id, pizzas.name, items.quantity FROM orders
        JOIN items on orders.id = items.order_id
        JOIN pizzas on items.pizza = pizzas.id ORDER BY orders.id ASC`, (err, rows) => {
            if (err) return console.error(err);
            let orders = Array.from(new Set(rows.map((r) => {
                return r.id;
            })));
            for (let i = 0, j = 0; i < rows.length; i++) {
                if (orders[j] == rows[i].id) {
                    orders[j] = ({ 'id': rows[i].id, 'items': [{ 'pizza': rows[i].name, 'quantity': rows[i].quantity }] })
                    j++;
                } else {
                    orders[j - 1].items.push({ 'pizza': rows[i].name, 'quantity': rows[i].quantity })
                }
            }
            expect(res.statusCode).toBe(200)
            expect(res.body).toBeDefined
            expect(orders).toBeDefined
            expect(res.body).toEqual(orders)
        })
    })
})
describe('GET /orders/:id', () => {
    test('should respond with details of an order', async () => {
        const res = await request(api).get('/api/orders/1')
        db.all(`SELECT orders.id, pizzas.name, items.quantity FROM orders
        JOIN items on orders.id = items.order_id
        JOIN pizzas on items.pizza = pizzas.id WHERE orders.id = 1`, (err, rows) => {
            let order = { 'id': rows[0].id, 'items': [] };
            for (let i = 0; i < rows.length; i++) {
                order.items.push({ 'pizza': rows[i].name, 'quantity': rows[i].quantity })
            }
            expect(res.body).toEqual(order)
        })
    })
    test('Should respond with 404 case invalid id', async () => {
        const res = await request(api).get('/api/orders/7')
        expect(res.statusCode).toBe(404)
    })
})
describe('GET /pizzas', () => {
    test('should respond with a list of pizzas', async () => {
        const res = await request(api).get('/api/pizzas')
        expect(res.statusCode).toBe(200)
        db.all(`SELECT pizzas.id, pizzas.name, pizzas.price, ingredients.ingredient FROM pizzas
        JOIN pizza_ingredients on pizzas.id = pizza_ingredients.pizza_id 
        JOIN ingredients on pizza_ingredients.ingredient_id = ingredients.id
        ORDER BY pizzas.id ASC;`, (err, rows) => {
            if (err) return console.error(err);
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
        })
    })
})