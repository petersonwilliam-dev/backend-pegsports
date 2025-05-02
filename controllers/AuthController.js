const User = require('../model/User')
const Cart = require('../model/Cart')
const bcrypt = require('bcrypt')
const validator = require('validator')
const createUserToken = require('../util/generateJwt')

module.exports = class AuthController {
    static async register(req, res) {
         const {name, email, password, confirmpassword} = req.body
         
         if (!name || !email || !password || !confirmpassword) {
            res.status(400).json({message: "Todos os campos devem ser preenchidos", success: false})
            return
         }

         if (!validator.isEmail(email)) {
            res.status(400).json({message: "Email inválido", success: false})
            return
         }

         const verifyEmailExists = await User.findOne({email})

         if (verifyEmailExists) {
            res.status(409).json({message: "Email já utilizado, tente outro", success: false})
            return
         }

         if (password !== confirmpassword) {
            res.status(400).json({message: "As senhas não conferem", success: false})
            return
         }

         const salt = bcrypt.genSaltSync(10)
         const hashedPassword = bcrypt.hashSync(password, salt)

         const user = {
            name,
            email,
            password: hashedPassword,
            address: []
         }

         try {
            const userResponse = await User.create(user)
            await Cart.create({user: userResponse._id})
            const token = await createUserToken(userResponse)
            res.status(201).json({token, message: "Usuário cadastrado!", success: true})
         } catch (err) {
            res.status(500).json({message: `Erro ${err}`, success: false})
         }
    }

    static async login(req, res) {
        
        const {email, password} = req.body
        
        if (!email || !password) {
            res.status(400).json({message: "Todos os campos devem ser preenchidos", success: false})
            return
        }

        if (!validator.isEmail(email)) {
            res.status(400).json({message: "Email inválido", success: false})
            return
         }

        const user = await User.findOne({email})

        if (!user) {
            res.status(404).json({message: "Usuário não encontrado", success: false})
            return
        }

        if (!bcrypt.compareSync(password, user.password)) {
            res.status(401).json({message: "Senha incorreta", success: false})
            return
        }

        user.password = null

        const token = await createUserToken(user)

        res.status(200).json({token, message: "Autenticado com sucesso!", success: true})
    }
}