const Cart = require('../model/Cart')
const Product = require('../model/Product')
const ObjectId = require('mongoose').Types.ObjectId
const getToken = require('../util/getToken')
const decodeToken = require('../util/decodeToken')

module.exports = class CartController {
    
    static async addItem(req, res) {

        const id = req.params.id
        const {quantity, size} = req.body

        const token = getToken(req)
        const user = await decodeToken(token)

        const cart = await Cart.findOne({user: user._id})

        const product = await Product.findById(id)

        if (!product) {
            res.status(404).json({message: "Produto não encontrado!", success: false})
            return
        }

        if (cart.products.includes(product._id)) {
            res.status(409).json({message: "Item já está no carrinho", success: false})
            return
        }

        const itemCart = {
            item: product._id,
            quantity,
            size
        }

        cart.products.push(itemCart)

        await Cart.findByIdAndUpdate(cart._id, cart)

        res.status(200).json({message: "Produto adicionado no carrinho", success: true})
    }

    static async removeItem(req, res) {

        const idProduct = req.params.id
        const token = getToken(req)
        const user = await decodeToken(token)

        const cart = await Cart.findOne({user: user._id})

        const product = await Product.findById(idProduct)

        if (!product) {
            res.status(404).json({message: "Produto não encontrado!", success: false})
            return
        }

        if (!cart.products.some(productCart => productCart.item.equals(new  ObjectId(product._id)))) {
            res.status(404).json({message: "Produto não está no carrinho", success: false})
            return
        }

        cart.products = cart.products.filter(product_id => !product_id.item.equals(new ObjectId(idProduct)))

        await Cart.findByIdAndUpdate(cart._id, cart)

        res.status(200).json({cart ,message: "Produto removido com sucesso!", success: true})
    }

    static async getCart(req, res) {
        const token = getToken(req)
        const user = await decodeToken(token)

        const cart = await Cart.findOne({user: user._id}).populate('user').populate('products.item')

        res.status(200).json({cart})
    }


}