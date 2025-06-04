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
                item: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    required: true
                },
                size: String
            }
        ]
    }, {timestamps: true})
)

module.exports = Cart