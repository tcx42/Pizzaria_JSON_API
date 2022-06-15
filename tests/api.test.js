const request = require('supertest')
const fs = require('fs')
const api = require('../api')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.log(err);
})
beforeAll(() => {
    db.run(`CREATE TABLE pizzas(id, name, price, ingredients)`, (err) => {
        if (err) console.log(err)
        db.run('INSERT INTO pizzas (id, name, price,  ingredients) VALUES (1, "Margherita", 5, "tomato, mozarella")', (err) => {
            if (err) console.log(err)
        })
        db.run('INSERT INTO pizzas (id, name, price,  ingredients) VALUES (2, "Bufala", 6, "tomato, mozarella di bufala")', (err) => {
            if (err) console.log(err)
        })
        db.each('SELECT * FROM pizzas', (err, row) => {
            if (err) return console.log(err)
            console.log(row)
        })
    })
    db.run(`CREATE TABLE orders(id, items)`, (err) => {
        if (err) console.log(err)
        db.run('INSERT INTO orders (id, items) VALUES (1, "Bufala , 1, Diavola , 2")', (err) => {
            if (err) console.log(err)
        })
        db.each('SELECT * FROM orders', (err, row) => {
            if (err) return console.log(err)
            console.log(row)
        })
    })
    db.run('CREATE TABLE items (itemId, orderId, pizza, qtd, PRIMARY KEY (itemId), FOREIGN KEY (orderId) REFERENCES orders())', err => {
        if (err) console.log(err)
    })
})
afterAll(() => {
    db.close(err => {
        if (err) return console.log(err)
    })
})

describe('GET /orders', () => {
    test('should respond with a list of orders', async () => {
        const res = await request(api).get('/api/orders')
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
        const res = await request(api).get('/api/orders/1')
        fs.readFile('./json/orders.json', (err, data) => {
            expect(res.body).toEqual(JSON.parse(data)[0])
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
        fs.readFile('./json/pizzas.json', (err, data) => {
            expect(res.body).toBeDefined
            expect(data).toBeDefined
            expect(res.body).toEqual(JSON.parse(data))
        })
    })
})
// describe('GET /orders', () => {
//     test('should respond with a list of orders', async () => {
//         const res = await request(api).get('/api/orders')
//         expect(res.statusCode).toBe(200)
//         fs.readFile('./json/orders.json', (err, data) => {
//             expect(res.body).toBeDefined
//             expect(data).toBeDefined
//             expect(res.body).toEqual(JSON.parse(data))
//         })
//     })
// })
// describe('GET /orders/:id', () => {
//     test('should respond with details of an order', async () => {
//         const res = await request(api).get('/api/orders/1')
//         fs.readFile('./json/orders.json', (err, data) => {
//             expect(res.body).toEqual(JSON.parse(data)[0])
//         })
//     })
//     test('Should respond with 404 case invalid id', async()=>{
//         const res = await request(api).get('/api/orders/7')
//         expect(res.statusCode).toBe(404)
//     })
// })
// describe('GET /pizzas', () => {
//     test('should respond with a list of pizzas', async () => {
//         const res = await request(api).get('/api/pizzas')
//         expect(res.statusCode).toBe(200)
//         fs.readFile('./json/pizzas.json', (err, data) => {
//             expect(res.body).toBeDefined
//             expect(data).toBeDefined
//             expect(res.body).toEqual(JSON.parse(data))
//         })
//     })
// })