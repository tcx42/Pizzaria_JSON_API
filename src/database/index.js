const knexfile = require('../../knexfile')
const knex = require('knex').knex(knexfile['development'])
module.exports = knex