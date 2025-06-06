const mongoose = require('../db/connection')
const { Schema } = require('mongoose')

const Buy = mongoose.model(
    'Buy',
    new Schema({
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        products: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        value: {
            productValues: {
                type: Number,
                required: true
            },
            shippingCost: {
                type: Number,
                required: true,
                default: 0
            }
        },
        address: Object,
        payment: {
            status:  {
                type: String,
                enum: ['pending', 'paid', 'failed'],
                required: true
            },
            method: {
                type: String,
                enum: ['credit_card', 'boleto', 'paypal', 'pix'],
                required: true
            },
            transactionId: {
                type: String,
                required: true
            }
        },
        status: {
            type: String,
            enum: ['pending', 'shipped', 'delivered', 'canceled'],
            default: 'pending'
        }
    }, {timestamps: true})
)

module.exports = Buy