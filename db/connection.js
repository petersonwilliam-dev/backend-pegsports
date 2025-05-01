const mongoose = require('mongoose')
const dbconnection = require('../config/dbconnection')

async function main() {
    await mongoose.connect(dbconnection)
    console.log("Conectado com mongodb")
}

main()
.catch(err => console.log(err))

module.exports = mongoose