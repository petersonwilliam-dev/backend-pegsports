const mongoose = require('../db/connection')
const { Schema } = require('mongoose')

const Rating = mongoose.model(
    'Rating',
    new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        grade: {
            type: Number,
            required: true
        },
        comment: {
            type: String
        }
    }, {timestamps: true})
)

module.exports = Rating