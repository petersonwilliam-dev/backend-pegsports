const User = require("../model/User");
const Cart = require("../model/Cart");
const bcrypt = require("bcrypt");
const validator = require("validator");
const ObjectId = require('mongoose').Types.ObjectId
const createUserToken = require("../util/generateJwt");
const getToken = require('../util/getToken')
const decodeToken = require('../util/decodeToken')

module.exports = class UserController {
  static async register(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    if (!name || !email || !password || !confirmpassword) {
      res.status(400).json({message: "Todos os campos devem ser preenchidos", success: false,});
      return;
    }

    if (!validator.isEmail(email)) {
      res.status(400).json({ message: "Email inválido", success: false });
      return;
    }

    const verifyEmailExists = await User.findOne({ email });

    if (verifyEmailExists) {
      res.status(409).json({ message: "Email já utilizado, tente outro", success: false });
      return;
    }

    if (password.lenght < 8) {
      res.status(400).json({message: "Senha deve conter mais de 8 caracteres", success: false });
      return;
    }

    if (password !== confirmpassword) {
      res.status(400).json({ message: "As senhas não conferem", success: false });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword,
      addresses: [],
      permission: false,
    };

    try {
      const userResponse = await User.create(user);
      await Cart.create({ user: userResponse._id });
      const token = await createUserToken(userResponse);
      res.status(201).json({user: {
            _id: userResponse._id,
            name: userResponse.name,
            address: userResponse.addresses,
            permission: userResponse.permission,
          },
          token,
          message: { message: "Usuário cadastrado!", success: true },
        });
    } catch (err) {
      res.status(500).json({ message: `Erro ${err}`, success: false });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({
          message: "Todos os campos devem ser preenchidos",
          success: false,
        });
      return;
    }

    if (!validator.isEmail(email)) {
      res.status(400).json({ message: "Email inválido", success: false });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res
        .status(404)
        .json({ message: "Usuário não encontrado", success: false });
      return;
    }

    if (!bcrypt.compareSync(password, user.password)) {
      res.status(401).json({ message: "Senha incorreta", success: false });
      return;
    }

    user.password = null;

    const token = await createUserToken(user);

    res
      .status(200)
      .json({
        user: {
          _id: user._id,
          name: user.name,
          address: user.address,
          permission: user.permission,
        },
        token,
        message: "Autenticado com sucesso!",
        success: true,
      });
  }

  static async addAddress(req, res) {
   
   const {receiver, street, number, cep, neighborhood, city, uf, phone, complement, reference} = req.body

   if (!receiver || !street || !cep || !number || !neighborhood || !city || !uf || !phone || !complement || !reference) {
      res.status(400).json({message: "Todos os dados devem ser preenchidos", success: false})
      return
   }

   const token = getToken(req)

   const user = await decodeToken(token)

   const address = {receiver, street, cep, number, neighborhood, city, uf, phone, complement, reference}

   user.addresses = [...user.addresses, address]

   await User.findByIdAndUpdate(user._id, user)

   res.status(200).json({message: "Endereço adicionado com sucesso", success: true})

  }

  static async getAddresses(req, res) {
   
   const token = getToken(req)
   const userToken = await decodeToken(token)

   const user = await User.findById(userToken._id)

   const addresses = user.addresses

   res.status(200).json({addresses})
  }

  static async editAddress(req, res) {

    const id = req.params.id
    
    const {receiver, street, number, cep, neighborhood, city, uf, phone, complement, reference} = req.body

    if (!receiver || !street || !cep || !number || !neighborhood || !city || !uf || !phone || !complement || !reference) {
      res.status(400).json({message: "Todos os dados devem ser preenchidos", success: false})
      return
    }

    const token = getToken(req)
    const userToken = await decodeToken(token)

    const user = await User.findById(userToken._id)

    const addresses = user.addresses

    const index = addresses.findIndex(address => address._id.equals(new ObjectId(id)))

    if (index == -1) {
      res.status(404).json({message: "Endereço não encontrado nos endereços cadastrados do usuário", success: false})
      return
    }

    addresses[index] = {receiver, street, number, cep, neighborhood, city, uf, phone, complement, reference}

    user.addresses = addresses

    await User.findByIdAndUpdate(user._id, user)

    res.status(200).json({message: "Endereço editado com sucesso", success: true})

  }

  static async removeAddress(req, res) {
    const id = req.params.id

    const token = getToken(req)

    const userToken = await decodeToken(token)

    const user = await User.findById(userToken._id)

    const addresses = user.addresses

    if (!addresses.some(address => address._id.equals(new ObjectId(id)))) {
      res.status(404).json({message: "Endereço não encontrado nos endereços cadastrados do usuário", success: false})
      return
    }

    user.addresses = addresses.filter(address => !address._id.equals(new ObjectId(id)))

    await User.findByIdAndUpdate(user._id, user)

    res.status(200).json({message: "Endereço removido com sucesso", success: true})
  }
};
