const express = require("express")
const app = express()

const AuthRoutes = require('./routes/AuthRoutes')

app.use(express.json())

app.use('/', AuthRoutes)

app.listen(5000, () => {
    console.log("Programa rodando")
})