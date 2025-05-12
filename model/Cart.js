const mongoose = require('../db/connection')
const { Schema } = require('mongoose')

const Cart = mongoose.model(
    'Cart',
    new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        products: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            }
        ]
    }, {timestamps: true})
)

module.exports = Cart