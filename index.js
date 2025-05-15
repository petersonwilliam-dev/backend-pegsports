const express = require("express")
const app = express()
const cors = require('cors')

const AuthRoutes = require('./routes/AuthRoutes')
const ProductRoutes = require('./routes/ProductRoutes')
const CartRoutes = require('./routes/CartRoutes')

app.use(express.json())
app.use(express.static('public'))

app.use(cors({origin: "*", methods: 'GET, POST, PATCH, PUT, DELETE, OPTIONS', allowedHeaders: 'Content-Type,Authorization'}))

app.use('/', AuthRoutes)
app.use('/products', ProductRoutes)
app.use("/cart", CartRoutes)

app.listen(5000, () => {
    console.log("Programa rodando")
})