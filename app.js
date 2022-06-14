'use strict'
const express = require('express');
const fs = require('fs')
const app = express();
app.use(express.json());

app.route('/api/orders')
    .get((req, res) => {
        fs.readFile('./json/orders.json', (err, data) => {
            if (err) {
                res.status(500).send()
                return console.log(err)
            }
            res.status(200).send(JSON.parse(data))
        })
    })

app.route('/api/orders/:id')
    .get((req, res) => {
        const { id } = req.params;
        fs.readFile('./json/orders.json', (err, data) => {
            if (err) {
                res.status(500).send()
                return console.log(err)
            }
            const order = JSON.parse(data).find(e => e.id === parseInt(id, 10))
            if (order === undefined) return res.status(404).send()
            res.status(200).send(order)
        })
    })

app.route('/api/pizzas')
    .get((req, res) => {
        fs.readFile('./json/pizzas.json', (err, data) => {
            if (err) {
                res.status(500).send()
                return console.log(err)
            }
            res.status(200).send(JSON.parse(data))
        })
    })

module.exports = app