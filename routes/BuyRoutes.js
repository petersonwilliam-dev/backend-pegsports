const routes = require('express').Router()
const BuyController = require('../controllers/BuyController')
const verifyToken = require('../util/verifyToken')

routes.get("/", verifyToken, BuyController.getUserBuys)
routes.post("/createbuy", verifyToken, BuyController.createBuy)
routes.patch("/confirmpayment", verifyToken, BuyController.confirmPayment)
routes.get("/:id", verifyToken, BuyController.getBuyById)

module.exports = routes