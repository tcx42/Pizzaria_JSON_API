/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('pizzas').del()
  await knex('ingredients').del()
  await knex('pizza_ingredients').del()
  await knex('orders').del()
  await knex('items').del()
  await knex('pizzas').insert([
    { id: 1, name: 'Margherita', price: '5' },
    { id: 2, name: 'Bufala', price: '6' },
    { id: 3, name: 'Romana', price: '5' },
    { id: 4, name: 'Diavola', price: '7.5' },
    { id: 5, name: 'Pizza Bianca', price: '5' }
  ]);
  await knex('ingredients').insert([
    { id: 1, ingredient: 'tomato' },
    { id: 2, ingredient: 'mozzarella' },
    { id: 3, ingredient: 'mozarella di bufala' },
    { id: 4, ingredient: 'anchovies' },
    { id: 5, ingredient: 'oregano' },
    { id: 6, ingredient: 'oil' },
    { id: 7, ingredient: 'spicy salami' }
  ]);
  await knex('pizza_ingredients').insert([
    { pizza_id: 1, ingredient_id: 1 },
    { pizza_id: 1, ingredient_id: 2 },
    { pizza_id: 2, ingredient_id: 1 },
    { pizza_id: 2, ingredient_id: 3 },
    { pizza_id: 3, ingredient_id: 1 },
    { pizza_id: 3, ingredient_id: 2 },
    { pizza_id: 3, ingredient_id: 4 },
    { pizza_id: 3, ingredient_id: 5 },
    { pizza_id: 3, ingredient_id: 6 },
    { pizza_id: 4, ingredient_id: 1 },
    { pizza_id: 4, ingredient_id: 2 },
    { pizza_id: 4, ingredient_id: 7 },
    { pizza_id: 5, ingredient_id: 2 },
    { pizza_id: 5, ingredient_id: 5 }
  ])
  await knex('orders').insert([
    { id: 1, table_number: 1 },
    { id: 2, table_number: 2 }
  ])
  await knex('items').insert([
    { id: 1, order_id: 1, pizza_id: 2, quantity: 1 },
    { id: 2, order_id: 1, pizza_id: 4, quantity: 2 },
    { id: 3, order_id: 2, pizza_id: 5, quantity: 2 },
    { id: 4, order_id: 2, pizza_id: 1, quantity: 1 }
  ])
};
