const request = require('supertest')
const api = require('../src/routes')
const knex = require('../src/database')

const orderMatch = {
    'id': expect.any(Number),
    'table_number': expect.any(Number),
    'items': expect.arrayContaining([{
        'pizza': expect.stringMatching(new RegExp(/(\w)*/)),
        'quantity': expect.any(Number)
    }])
}
const ordersArrayMatch = expect.arrayContaining([orderMatch])
const orderSample = [
    {
        'table_number': 4,
        'items': [
            {
                'pizza': 'Romana',
                'quantity': 1
            },
            {
                'pizza': 'Margherita',
                'quantity': 2
            }
        ]
    },
    {
        'table_number': 3,
        'items': [
            {
                'pizza': 'Bufala',
                'quantity': 1
            },
            {
                'pizza': 'Pizza Bianca',
                'quantity': 1
            }
        ]
    }
]
const ingredientMatch = expect.stringMatching(new RegExp(/(\w)*/))
const pizzaMatch = {
    'name': expect.stringMatching(new RegExp(/(\w)*/)),
    'price': expect.any(Number),
    'ingredients': expect.arrayContaining([ingredientMatch])
}
const pizzasArrayMatch = expect.arrayContaining([pizzaMatch])
afterAll(() => {
    knex.destroy()
})

describe('/orders', () => {
    describe('GET', () => {
        test('Responds with an array of Orders', async () => {
            const res = await request(api).get('/api/orders');
            expect(res.body).toMatchObject(ordersArrayMatch)
        })
    })
    describe('POST', () => {
        test('Responds with an array of Orders added', async () => {
            const res = await request(api).post('/api/orders').send(orderSample);
            expect(res.body).toMatchObject(ordersArrayMatch)
            expect(res.body).toMatchObject(orderSample)
        })
        test('Responds with 400 case invalid body', async () => {
            const res = await request(api).post('/api/orders').send([{ "table": 14 }]);
            expect(res.status).toEqual(400)
        })
    })
    describe('PUT', () => {
        test('Responds with an array of Orders updated', async () => {

        })
    })
    describe('DELETE', () => {
        test('Responds with an array of Orders deleted', async () => {

        })
    })
})

describe('/orders/:id', () => {
    describe('GET', () => {
        test('Responds with an order json object', async () => {
            const res = await request(api).get('/api/orders/1')
            expect(res.body).toMatchObject(orderMatch)
        })
        test('Responds with 404 case invalid id', async () => {
            const res = await request(api).get('/api/orders/900')
            expect(res.status).toEqual(404)
        })
    })
    describe('PUT', () => {
        test('Responds with updated Order', async () => {

        })
    })
    describe('DELETE', () => {
        test('Responds with deleted Order', async () => {

        })
    })
})
describe('/pizzas', () => {
    describe('GET', () => {
        test('Responds with a list of pizzas', async () => {
            const res = await request(api).get('/api/pizzas');
            expect(res.body).toMatchObject(pizzasArrayMatch);
        })
    })
    describe('POST', () => {
        test('Responds with an array of added pizzas', async () => {

        })
    })
    describe('PUT', () => {
        test('Responds with an array of updated pizzas', async () => {

        })
    })
    describe('DELETE', () => {
        test('Responds with an array of deleted pizzas', async () => {

        })
    })
})