const jsonwebtoken = require('jsonwebtoken')
const secret = require('../config/sercretJwt')

const createUserToken = async (user) => {
    const token = jsonwebtoken.sign({
        id: user._id,
        name: user.name,
        addresses: user.addresses,
        permission: user.permission
    }, secret)

    return token
}

module.exports = createUserToken