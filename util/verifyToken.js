const jwt = require("jsonwebtoken")
const getToken = require('./getToken')
const secret = require('../config/sercretJwt')

const checkToken = (req, res, next) => {
    if (!req.headers.authorization) {
       return res.status(401).json({message: "Acesso negado!"})
    }
    
    const token = getToken(req)
    
    if (!token) return res.status(401).json({message: "Acesso negado!"})
    
    try {
        const verified = jwt.verify(token, secret)
        req.user = verified
        next()
    } catch (err) {
        return res.status(401).json({message: "Token inválido! " + err})
    }
}

module.exports = checkToken