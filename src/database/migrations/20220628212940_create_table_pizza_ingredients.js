/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('pizza_ingredients', (table) => {
        table.integer('pizza_id')
        table.foreign('pizza_id').references('id').inTable('pizzas')
        table.integer('ingredient_id')
        table.foreign('ingredient_id').references('id').inTable('ingredients')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('pizza_ingredients')
};
