const Product = require('../model/Product')
const getToken = require('../util/getToken')
const decodeToken = require('../util/decodeToken')
const ObjectId = require('mongoose').Types.ObjectId
const path = require('path')
const fs = require('fs')

module.exports = class ProductController {
    static async create(req, res) {
        const {name, price, description, available, category, informations} = req.body
        const images = req.files

        if (!name || !price || !description || !available || !category || !informations) {
            res.status(400).json({message: "Todos os campos devem estar preenchidos", success: false})
            return
        }

        if (images.length === 0) {
            res.status(400).json({message: "O produto deve conter imagens", success: false})
            return
        }

        const product = {
            name,
            price,
            description,
            category,
            available: JSON.parse(available),
            informations: JSON.parse(informations),
            sale: {},
            ratings: [],
            images: []
        }

        images.map(image => {
            product.images.push(image.filename)
        })

        try {
            await Product.create(product)
            res.status(201).json({message: "Produto criado!", success: true})
        } catch (err) {
            res.status(500).json({message: `Erro no sistema: ${err}`, success: false})
        }
    }

    static async getProducts(req, res) {

        const {name, category, price, sort, limit, page, hasProduct } = req.query

        const filter = {}
        const sortObj = {}
        let skip = undefined

        if (name) {
            filter.name = {$regex: name, $options: "i"};
        }

        if (category) {
            filter.category = {$regex: category, $options: "i"}
        }

        if (price) {
            filter.price = {$lte: Number(price)}
        }

        if (page) {
            skip = (page - 1) * limit
        }

        sortObj.createdAt = 1

        if (sort === "true") {
            sortObj.createdAt = -1
        }

        const products = await Product.find(filter).sort(sortObj).skip(skip).limit(limit)

        if (hasProduct) {
            if (products.length > 0) {
                res.status(200).json({hasProduct: true})
                return
            } else {
                res.status(200).json({hasProduct: false})
                return
            }
        }

        res.status(200).json({products})
    }

    static async getProductById(req, res) {
        
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.status(400).json({message: "ID inválido!", success: false})
            return
        }

        const product = await Product.findById(id)

        if (!product) {
            res.status(404).json({message: "Produto não encontrado!", success: false})
            return
        }

        res.status(200).json({product})
    }

    static async edit(req, res) {
        
        const id = req.params.id
        
        const {name, price, description, available, category, informations} = req.body

        let informationParsed = JSON.parse(informations)
        let availableParsed = JSON.parse(available)

        if (!name || !price || !description || !available || !category || !informations) {
            res.status(400).json({message: "Toddos os campos devem estar preenchidos", success: false})
            return
        }

        if (!ObjectId.isValid(id)) {
            res.status(400).json({message: "ID Inválido!", success: false})
            return
        }

        const product = await Product.findById(id)

        if (!product) {
            res.status(404).json({message: "Produto não encontrado!", success: false})
            return
        }

        const newProduct = {name, price, description, available: availableParsed, category, informations: informationParsed}

        await Product.findByIdAndUpdate(id, newProduct)

        res.status(200).json({message: "Produto editado com sucesso", success: true})
    }

    static async delete(req, res) {

        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.status(400).json({message: "ID inválido!", success: false})
            return
        }

        const product = await Product.findById(id)

        if (!product) {
            res.status(404).json({message: "Produto não encontrado!", success: false})
            return
        }

        
        product.images.map(image => {
            const filename = path.join(`${__dirname}/../public/images/products/${image}`)
            if (fs.existsSync(filename)) {
                fs.unlinkSync(filename)
            }
        })

        await Product.findByIdAndDelete(id)

        res.status(200).json({message: "Produto excluído com sucesso", success: true})
    }

    static async addRating(req, res) {

        const id = req.params.id
        const token = getToken(req)
        const user = await decodeToken(token)

        const {grade, comment} = req.body

        if (!grade) {
            res.status(400).json({message: "Dê uma nota na sua avaliação", success: false})
            return
        }

        const product = await Product.findById(id)

        if (!product) {
            res.status(404).json({message: "Produto não encontrado", success: false})
            return
        }

        const userRating = {
            _id: user._id,
            name: user.name
        }
        
        const rating = {
            user: userRating,
            grade
        }

        if (comment) {
            rating.comment = comment
        }

        product.ratings.unshift(rating)

        await Product.findByIdAndUpdate(id, product)

        res.status(200).json({message: "Obrigado pela avaliação!", success: true})
    }

    static async removeRating(req, res) {

        const {id, idRating} = req.params
        const token = getToken(req)
        const user = await decodeToken(token)

        const product = await Product.findById(id)

        if (!product) {
            res.status(404).json({message: "Produto não encontrado!", success: false})
            return
        }

        const ratingIndex = product.ratings.findIndex(rating => rating._id.equals(new ObjectId(idRating)))

        if (ratingIndex === -1) {
            res.status(404).json({message: "Avaliação não encontrada", success: false})
            return
        }

        const rating = product.ratings[ratingIndex]

        if (!rating.user._id.equals(new ObjectId(user._id))) {
            res.status(403).json({message: "Não autorizado", success: false})
            return
        }

        product.ratings.splice(ratingIndex, 1)

        await product.save()

        res.status(200).json({message: "Avaliação removida com sucesso", success: true})
    }

    static async getImage(req, res) {

        const filename = req.params.filename

        const filePath = path.join(`${__dirname}/../public/images/products/${filename}`)
           
        if (fs.existsSync(filePath)) {
            const img = fs.readFileSync(filePath)
            const ext = path.extname(filePath).substring(1)
            res.writeHead(200, {
                'Content-Type': 'image/' + ext,
                'Content-Length': img.length
            })
            res.end(img)
            return
        }

        res.status(404).json({message: `Imagem ${filename} não encontrada`, success: false})
    }
}