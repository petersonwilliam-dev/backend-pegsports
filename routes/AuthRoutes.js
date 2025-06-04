const routes = require('express').Router()
const UserController = require('../controllers/UserController')
const verifytoken = require('../util/verifyToken')

routes.post("/register", UserController.register)
routes.post("/login", UserController.login)
routes.post("/address", verifytoken, UserController.addAddress)
routes.get("/address", verifytoken, UserController.getAddresses)
routes.patch("/address/:id", verifytoken, UserController.editAddress)
routes.delete("/address/:id", verifytoken, UserController.removeAddress)

module.exports = routes