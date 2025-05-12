const Product = require('../model/Product')
const ObjectId = require('mongoose').Types.ObjectId
const path = require('path')
const fs = require('fs')

module.exports = class ProductController {
    static async create(req, res) {
        const {name, price, description, available, category, informations} = req.body
        const images = req.files

        if (!name || !price || !description || !available || !category || !informations) {
            res.status(400).json({message: "Toddos os campos devem estar preenchidos", success: false})
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
            res.status(200).json({message: `Erro no sistema: ${err}`, success: false})
        }
    }

    static async getProducts(req, res) {

        const filter = req.query

        const products = await Product.find(filter)

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

        const newProduct = {name,price,description, available, category, informations}

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
}