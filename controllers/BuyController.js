const SECRET_KEY = require('../config/secretKeyStripe')
const stripe = require('stripe')(SECRET_KEY)
const getToken = require('../util/getToken')
const decodeToken = require('../util/decodeToken')
const ObjectId = require('mongoose').Types.ObjectId

const Buy = require('../model/Buy')
const { Promise } = require('mongoose')

module.exports = class BuyController {
    static async createBuy(req, res) {

        const { buyProducts, address, method, shippingCost } = req.body

        if (!buyProducts || buyProducts.length === 0) {
            res.status(400).json({message: "Escolha algum produto para fazer a compra"})
            return
        }

        if (!address) {
            res.status(400).json({message: "Escolha algum endereço para entrega"})
            return
        }

        if (!method) {
            res.status(400).json({message: "Escolha algum método para realizar o pagamento"})
            return
        }

        const token = getToken(req)
        const user = await decodeToken(token)

        let amount = 0

        buyProducts.map(product => {
            amount += product.item.price * product.quantity
        })

        const methodPayment = method !== 'pix' ? 'card' : method

        try {
 
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount * 100,
                currency: 'brl',
                payment_method_types: [methodPayment]
            })

            const payment = {
                status: "pending",
                method,
                transactionId: paymentIntent.id
            }

            const buys= []

            for (const item of buyProducts) {
                
                const product = {
                    item: {
                        _id: item.item._id,
                        name: item.item.name,
                        price: item.item.price,
                        images: item.item.images,
                        size: item.size,
                        category: item.item.category
                    },
                    quantity: item.quantity
                }

                const buy = {
                    user: user._id,
                    product,
                    address,
                    value: {productValue: product.item.price * item.quantity, shippingCost},
                    payment
                }

                const buyResponse = await Buy.create(buy)
                buys.push(buyResponse)
            }

            res.status(200).json({clientSecret: paymentIntent.client_secret, buys})
        } catch (err) {
            res.status(500).json({message: "Deu erro " + err})
        }
    }

    static async confirmPayment(req, res) {
        
        const { buys } = req.body

        if (!buys) {
            res.status(400).json({message: "Nenhuma compra selecionada para confirmar pagamento", success: false})
            return
        }
        
        for (const buy of buys) {
            buy.payment.status = 'paid'
            await Buy.findByIdAndUpdate(buy._id, buy)
        }

        res.status(200).json({message: "Pagamento confirmado!", success: true})
    }

    static async getUserBuys(req, res) {

        const token = getToken(req)

        const user = await decodeToken(token)

        const buys = await Buy.find({user: user._id})

        res.status(200).json({buys, message: "Compras retornadas com sucesso", success: true})
    }

    static async getBuyById(req, res) {

        const id = req.params.id

        const token = getToken(req)

        const user = await decodeToken(token)

        if (!ObjectId.isValid(id)) {
            res.status(400).json({message: "ID inválido!", success: false})
            return
        }

        const buy = await Buy.findById(id)

        if (!buy) {
            res.status(404).json({message: "Compra não localizada", success: false})
            return
        }

        if (!buy.user.equals(user._id) && !user.permission) {
            res.status(403).json({message: "Acesso negado", success: false})
            return
        }

        res.status(200).json({buy, message: "Compra retornada com sucesso!", success: true})
    }
}