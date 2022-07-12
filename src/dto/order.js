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
module.exports = { orderSchema, ordersArraySchema }