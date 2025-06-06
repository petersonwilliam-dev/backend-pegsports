const routes = require('express').Router()
const BuyController = require('../controllers/BuyController')

routes.post("/createPayment", BuyController.createPayment)

module.exports = routes