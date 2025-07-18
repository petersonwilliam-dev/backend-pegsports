const mongoose = require('../db/connection')
const { Schema } = require('mongoose')

const Product = mongoose.model(
    'Product',
    new Schema({
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        available: [{
            size: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }],
        images: {
            type: Array,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        ratings: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            grade: {type: Number, required: true},
            comment: {type: String},
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        sale: {
            type: Object
        },
        informations: [
            {
                title: {
                    type: String,
                    required: true
                },
                value: {
                    type: String,
                    required: true
                }
            }
        ]
    }, {timestamps: true})
)

module.exports = Product