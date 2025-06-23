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
        product: {
            item: {
                type: Object,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        },
        value: {
            productValue: {
                type: Number,
                required: true
            },
            shippingCost: {
                type: Number,
                required: true,
                default: 0
            }
        },
        address: {
            type: Object,
            required: true
        },
        payment: {
            status:  {
                type: String,
                enum: ['pending', 'paid', 'failed'],
                required: true
            },
            method: {
                type: String,
                enum: ['card', 'boleto', 'paypal', 'pix'],
                required: true
            },
            transactionId: {
                type: String
            }
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'completed', 'canceled'],
            default: 'pending'
        }
    }, {timestamps: true})
)

module.exports = Buy