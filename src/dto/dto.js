const yup = require('yup');

const itemSchema = yup.object({
    pizza: yup.string().required(),
    quantity: yup.number().required()
});
const orderSchema = yup.object({
    table_number: yup.number().required(),
    items: yup.array().of(itemSchema).required()
});
const ordersArraySchema = new yup.ArraySchema(orderSchema);

const pizzaSchema = yup.object({
    name: yup.string().required(),
    price: yup.number().required(),
    ingredients: yup.array().of(yup.string().required()).required()
})
const pizzaArraySchema = new yup.ArraySchema(pizzaSchema)

const pizzaToUpdateSchema = yup.object({
    name: yup.string().required(),
    price: yup.number().required()
})

module.exports = { orderSchema, ordersArraySchema, pizzaSchema, pizzaArraySchema, pizzaToUpdateSchema }