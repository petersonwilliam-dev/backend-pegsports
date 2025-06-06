const SECRET_KEY = require('./config/secretKeyStripe')

const express = require("express")
const app = express()
const cors = require('cors')
const fetch = require('node-fetch')
const stripe = require('stripe')(SECRET_KEY)

const AuthRoutes = require('./routes/AuthRoutes')
const ProductRoutes = require('./routes/ProductRoutes')
const CartRoutes = require('./routes/CartRoutes')
const BuyRoutes = require('./routes/BuyRoutes')
const apiBase = "/api/v1"

app.use(express.json())
app.use(express.static('public'))

app.use(cors({origin: "*", methods: 'GET, POST, PATCH, PUT, DELETE, OPTIONS', allowedHeaders: 'Content-Type,Authorization'}))

app.use(apiBase + '/users', AuthRoutes)
app.use(apiBase + '/products', ProductRoutes)
app.use(apiBase + "/cart", CartRoutes)
app.use(apiBase + "/buy", BuyRoutes)

app.get("/api/v1/cep/:cep", async (req, res) => {
    const cep = req.params.cep

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json`)
        const data = await response.json()
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({message: "Falha ao consiltar dados do cep" + err, success: false})
    }
})

app.listen(5000, () => {
    console.log("Programa rodando")
})