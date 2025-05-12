const routes = require('express').Router()
const CartController = require('../controllers/CartController')
const verifyToken = require('../util/verifyToken')

routes.patch("/:id", verifyToken, CartController.addItem)
routes.delete("/:id", verifyToken, CartController.deleteItem)
routes.get("/", verifyToken, CartController.getCart)

module.exports = routes