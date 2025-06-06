const SECRET_KEY = require('../config/secretKeyStripe')
const stripe = require('stripe')(SECRET_KEY)
const getToken = require('../util/getToken')
const decodeToken = require('../util/decodeToken')

const Buy = require('../model/Buy')

module.exports = class BuyController {
    static async createPayment(req, res) {

        const { buyProducts, address, method, shippingCost } = req.body

        const token = getToken(req)
        const user = await decodeToken(token)

        let amount = 0

        const methodPayment = method !== 'pix' ? 'card' : method

        try {

            buyProducts.map(product => {
                amount += product.price
            })

            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: 'brl',
                payment_method_types: [methodPayment]
            })

            const payment = {
                status: "pending",
                method,
                transactionId: paymentIntent.id
            }

            const products = buyProducts.map(item => item._id)

            const buy = {
                user: user._id,
                products,
                value: {amount, shippingCost},
                address,
                payment
            }

            const buyResponse = await Buy.create(buy)

            res.status(200).json({clientSecret: paymentIntent.client_secret, buyResponse})
        } catch (err) {
            res.status(500).json({message: "Deu erro " + err})
        }
    }
}