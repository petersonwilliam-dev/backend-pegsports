const routes = require('express').Router()
const AuthController = require('../controllers/AuthController')

routes.post("/register", AuthController.register)
routes.post("/login", AuthController.login)

module.exports = routes