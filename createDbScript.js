const fs = require('fs/promises');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
function connectDatabase(file = './data.db') {
    return sqlite.open({ filename: file, driver: sqlite3.Database })
}

(async () => {
    try {
        const db = await connectDatabase();
        db.run('CREATE TABLE pizzas (id INTEGER PRIMARY KEY , name TEXT, price DECIMAL(6,2))');
        db.run('CREATE TABLE ingredients (id INTEGER PRIMARY KEY, ingredient TEXT)');
        db.run('CREATE TABLE pizza_ingredients (pizza_id INTEGER, ingredient_id INTEGER, FOREIGN KEY (pizza_id) REFERENCES pizzas(id), FOREIGN KEY (ingredient_id) REFERENCES ingredients(id))');
        db.run('CREATE TABLE items (id INTEGER PRIMARY KEY, order_id INTEGER, pizza INTEGER, quantity INTEGER, FOREIGN KEY (order_id) REFERENCES orders(id), FOREIGN KEY (pizza) REFERENCES pizzas(id))');
        db.run('CREATE TABLE orders (id INTEGER PRIMARY KEY, order_number INTEGER)');
        const pizzas = JSON.parse(await fs.readFile('./json/pizzas.json', 'utf8'))
        const orders = JSON.parse(await fs.readFile('./json/orders.json', 'utf8'))
        for (const pizza of pizzas) {
            await db.run('INSERT INTO pizzas (name, price) VALUES (?, ?)', [pizza.name, pizza.price])
        }
        let ingred = new Set();
        for (const pizza of pizzas) {
            for (const i of pizza.ingredients) {
                ingred.add(i)
            }
        }
        for (const i of ingred) {
            await db.run('INSERT INTO ingredients (ingredient) VALUES(?)', i)
        }
        let o = 1;
        for (const order of orders) {
            await db.run('INSERT INTO orders (order_number) VALUES (?)', o)
            for (const item of order.items) {
                const oid = await db.get('SELECT id FROM orders WHERE order_number = ?', o);
                const pid = await db.get('SELECT id FROM pizzas WHERE name = ?', item.pizza);
                await db.run('INSERT INTO items (order_id, pizza, quantity) VALUES (?, ?, ?)', [oid.id, pid.id, item.quantity])
            }
            o++;
        }
        for (const pizza of pizzas) {
            const pid = await db.get('SELECT id FROM pizzas WHERE name = ?', pizza.name);
            for (const i of pizza.ingredients) {
                const iid = await db.get('SELECT id FROM ingredients WHERE ingredient = ?', i);
                await db.run('INSERT INTO pizza_ingredients (pizza_id, ingredient_id) VALUES (?, ?)', [pid.id, iid.id])
            }
        }
        await db.close();
    } catch (error) {
        console.error(error)
    }
})()