/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('items', (table) => {
        table.primary('id')
        table.increments('id')
        table.integer('order_id')
        table.foreign('order_id').references('id').inTable('orders')
        table.integer('pizza_id')
        table.foreign('pizza_id').references('id').inTable('pizzas')
        table.integer('quantity')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('items')
};
