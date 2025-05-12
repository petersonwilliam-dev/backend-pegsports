const getToken = require('./getToken')
const decodeToken = require('./decodeToken')

const checkPermission = async (req, res, next) => {
    const token = getToken(req)
    const user = await decodeToken(token)

    if (user.permission) {
        next()
    } else {
        res.status(403).json({message: "Acesso não autorizado!", success: false})
        return
    }
}

module.exports = checkPermission