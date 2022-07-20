/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('pizzas', (table) => {
        table.primary('id')
        table.increments('id')
        table.string('name')
        table.unique('name')
        table.decimal('price', null)
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('pizzas')
};
