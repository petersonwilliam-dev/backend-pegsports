const mongoose = require('../db/connection')
const { Schema } = require('mongoose')

const User = mongoose.model(
    'User',
    new Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        address: [
            {
                street: {
                    type: String,
                    required: true
                },
                neighborhood: {
                    type: String,
                    required: true
                },
                number: {
                    type: String,
                    required: true
                },
                complement: {
                    type: String,
                    required: true
                },
                cep: {
                    type: Number,
                    required: true
                },
                reference: {
                    type: String,
                    required: true
                }
            }
        ],
        permission: {
            type: Boolean,
            required: true
        }
    }, {timestamps: true})
)

module.exports = User