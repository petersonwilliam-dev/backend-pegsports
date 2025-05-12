const jwt = require("jsonwebtoken")
const User = require("../model/User")
const secret = require('../config/sercretJwt')

const decodeToken = async (token) => {
    const decoded = jwt.verify(token, secret)
    const userId = decoded.id
    const user = await User.findById(userId)
    return user
}

module.exports = decodeToken