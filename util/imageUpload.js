const multer = require('multer')
const path = require('path')

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = ""
        if (req.baseUrl.includes("products")) {
            folder = "products"
        }

        cb(null, `public/images/${folder}`)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + String(Math.floor(Math.random() * 10)) + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error("Formato de imagem não suportado!"))
        }
        cb(null, true)
    }
})

module.exports = { imageUpload }