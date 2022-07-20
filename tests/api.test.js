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

var ordersIds;
beforeAll(async () => {
    ordersIds = (await knex('orders').select('id').orderBy('id', 'asc')).map(e => { return e.id });
})

afterAll(() => {
    knex.destroy();
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
            ordersIds.push(res.body[0].id)
            ordersIds.push(res.body[1].id)
        })
        test('Responds with 400 case invalid body', async () => {
            const res = await request(api).post('/api/orders').send([{ "table": 14 }]);
            expect(res.status).toEqual(400)
        })
    })
})

describe('/orders/:id', () => {
    describe('GET', () => {
        test('Responds with an order json object', async () => {
            const res = await request(api).get(`/api/orders/${ordersIds[0]}`)
            expect(res.body).toMatchObject(orderMatch)
        })
        test('Responds with 404 case invalid id', async () => {
            const res = await request(api).get(`/api/orders/0`)
            expect(res.status).toEqual(404)
        })
    })
    describe('DELETE', () => {
        test('Responds with confirmation', async () => {
            const res = await request(api).delete(`/api/orders/${ordersIds[ordersIds.length - 1]}`)
            expect(res.status).toEqual(200)
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
            const pizzas = [{
                'name': 'Salami',
                'price': 35,
                'ingredients': [
                    'mozzarella',
                    'spicy salami'
                ]
            },
            {
                'name': 'Mozarella',
                'price': 25,
                'ingredients': [
                    'mozzarella',
                    'mozzarella di bufala'
                ]
            }]
            const res = await request(api).post('/api/pizzas').send(pizzas);
            expect(res.body).toMatchObject(pizzasArrayMatch)
        })
        test('Responds with 400 case invalid body', async () => {
            const res = await request(api).post('/api/orders').send([{ 'salami': 'pizza' }]);
            expect(res.status).toEqual(400)
        })
        test('Responds with warning in case of already existing item', async () => {
            const pizza = [{
                'name': 'Bufala',
                'price': 6,
                'ingredients': [
                    'tomato',
                    'mozarella di bufala'
                ]
            }]
            const res = await request(api).post('/api/pizzas').send(pizza);
            expect(res.status).toEqual(400)
        })
    })
})
describe('/pizzas/:id', () => {
    describe('PUT', () => {
        test('Responds with an updated pizza', async () => {
            const pizza = {
                'name': 'Romanina',
                'price': 5
            }
            const res = await request(api).put(`/api/pizzas/3`).send(pizza)
            expect(res.body).toMatchObject(pizzaMatch)
        })
    })
    describe('DELETE', () => {
        test('Responds with confirmation', async () => {
            const res = await request(api).delete(`/api/pizzas/3`)
            expect(res.status).toEqual(200)
        })
    })
})