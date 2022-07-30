const { User, Pelamar } = require('../models');
const Validator = require('fastest-validator');
const bcrypt = require('bcrypt');
const v = new Validator();
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
const secretKey = "ini_key_rahasia";

module.exports = {
    register: async (req, res) => {
        try{
            const { email,password,no_hp, nama } = req.body;
            const schema = {
                email: 'email|required',
                password: 'string|required|min:8',
                no_hp: 'string|required'
            }
            const validate = v.validate(req.body, schema);
            if (validate.length) {
                return res.status(400).json({
                    status: false,
                    message: "bad request!",
                    data: validate
                });
            }

            const user = await User.findOne({
                where:{
                    email
                }
            });
            if(user){
                return res.status(400).json({
                    status: false,
                    message: "user already exist!",
                    data: null
                });
            }

            const passwordHash = await bcrypt.hash(password, 10);
            
            return res.send(req.body);
            const newUser = await User.create({
                nama: nama,
                email: email,
                no_hp: no_hp,
                password: passwordHash,
                role: 1
            });
        
            return res.status(201).json({
                status: true,
                message: 'user registred',
                data: {
                    id: newUser.id,
                    nama: newUser.nama,
                    email: newUser.email,
                    no_hp: newUser.hp_hp,
                    role: newUser.role,
                    createdAt: newUser.createdAt,
                    updatedAt: newUser.updatedAt
                }
            });
            
        }catch(err){
            res.status(500).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    },
    login: async (req, res) => {
        try{
            const { email, password } = req.body;
            const user = await User.findOne({
                where:{
                    [Op.or]: [{ email: email}, { no_hp: email }]
                }
            });
            if(!user){
                return res.status(400).json({
                    status: false,
                    message: "User Not Found!",
                    data: null
                });
            }
            const checkPassword = bcrypt.compareSync(password, user.password);
            if(!checkPassword){
                return res.status(400).json({
                    status: false,
                    message: "Password Wrong!",
                    data: null
                });
            }
            const dataUser = {
                id: user.id,
                email: user.email,
                no_hp: user.no_hp,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }

            const token = jwt.sign(dataUser, secretKey);
            res.status(200).json({
                status: true,
                message: "Login success",
                data: {
                    token
                }
            })

        }catch(err){
            res.status(500).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    },
    dataDiri: async (req, res) => {
        try{
            const user = req.user;

            const schema = {
                nama_lengkap: 'string',
                tgl_lahir: 'string',
                jk: 'string',
                kota: 'string',
                tempat_tinggal: 'string',
                status: 'string'
            }
            const validate = v.validate(req.body, schema);
            if(validate.length){
                return res.status(400).json({
                    status: false,
                    message: "bad request!",
                    data: validate
                });
            }
            const isAlready = Pelamar.findOne({
                where:{
                    user_id: user.id
                }
            })
            if(isAlready){
                return res.status(400).json({
                    status: false,
                    message: "Data Already Exists",
                    data: null
                })
            }

            const pelamar = await Pelamar.create({
                user_id: user.id,
                nama_lengkap: req.body.nama_lengkap,
                jk: req.body.jk,
                kota: req.body.kota,
                tempat_tinggal: req.body.tempat_tinggal,
                status: req.body.status
            });

            return res.status(200).json({
                status: true,
                message: "Berhasil tambah data diri",
                data: pelamar
            });

        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    }
}