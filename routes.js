'use strict'
const express = require('express');
const fs = require('fs')
const app = express();
app.use(express.json());

app.route('/api/orders')
    .get((req, res) => {
        fs.readFile('./json/orders.json', (err, data) => {
            if (err) return console.log(err)
            res.status(200).send(JSON.parse(data))
        })
    })

app.route('/api/orders/:id')
    .get((req, res) => {
        const { id } = req.params;
        fs.readFile('./json/orders.json', (err, data) => {
            if (err) return console.log(err)
            JSON.parse(data).forEach(element => {
                if (element.id === parseInt(id)) {
                    return res.status(200).send(element)
                }
            })
        })
    })

app.route('/api/pizzas')
    .get((req, res) => {
        fs.readFile('./json/pizzas.json', (err, data) => {
            if (err) return console.log(err);
            res.status(200).send(JSON.parse(data))
        })
    })

module.exports = app