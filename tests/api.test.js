const request = require('supertest')
const fs = require('fs')
const app = require('../routes')
const exp = require('constants')

describe('GET /orders', () => {
    test('should respond with a list of orders', async () => {
        const res = await request(app).get('/api/orders')
        expect(res.statusCode).toBe(200)
        fs.readFile('./json/orders.json', (err, data) => {
            expect(res.body).toBeDefined
            expect(data).toBeDefined
            expect(res.body).toEqual(JSON.parse(data))
        })
    })
})
describe('GET /orders/:id', () => {
    test('should respond with details of an order', async () => {
        const res = await request(app).get('/api/orders/1')
        fs.readFile('./json/orders.json', (err, data) => {
            expect(res.body).toEqual(JSON.parse(data)[0])
        })
    })
})
describe('GET /pizzas', () => {
    test('should respond with a list of pizzas', async () => {
        const res = await request(app).get('/api/pizzas')
        expect(res.statusCode).toBe(200)
        fs.readFile('./json/pizzas.json', (err, data) => {
            expect(res.body).toBeDefined
            expect(data).toBeDefined
            expect(res.body).toEqual(JSON.parse(data))
        })
    })
})