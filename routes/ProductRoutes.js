const routes = require('express').Router()
const { imageUpload } = require('../util/imageUpload')
const verifyToken = require('../util/verifyToken')
const checkPermission = require('../util/checkPermission')
const ProductController = require('../controllers/ProductController')

routes.get('/', ProductController.getProducts)
routes.get("/:id", ProductController.getProductById)
routes.post('/', verifyToken, checkPermission, imageUpload.array('images'), ProductController.create)
routes.patch("/:id", verifyToken, checkPermission, imageUpload.array('images'), ProductController.edit)
routes.delete("/:id", verifyToken, checkPermission, ProductController.delete)
routes.post("/rating/:id", verifyToken, ProductController.addRating)
routes.delete("/rating/:id/:idRating", verifyToken, ProductController.removeRating)
routes.get("/img/:filename", ProductController.getImage)

module.exports = routes