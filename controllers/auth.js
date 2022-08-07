const { User, Pelamar, Umkm } = require('../models');
const Validator = require('fastest-validator');
const bcrypt = require('bcrypt');
const v = new Validator();
const { Op, where } = require("sequelize");
const jwt = require('jsonwebtoken');
const secretKey = "ini_key_rahasia";

module.exports = {
    register: async (req, res) => {
        try{
            
            const { email,password,no_hp, nama, user_type } = req.body;
        
            const schema = {
                email: 'email|required',
                password: 'string|required|min:8',
                no_hp: 'string|required',
                nama: 'string|required'
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
                    [Op.or]: [{email: email}, { no_hp: no_hp } ]
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

            const newUser = await User.create({
                nama: nama,
                email: email,
                no_hp: no_hp,
                password: passwordHash,
                user_type: parseInt(user_type),
                user_valid: 0
            });
        
            return res.status(201).json({
                status: true,
                message: 'user registred',
                data: {
                    id: newUser.id,
                    nama: newUser.nama,
                    email: newUser.email,
                    no_hp: newUser.hp_hp,
                    user_type: newUser.user_type,
                    user_valid: newUser.user_valid,
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
            const { emailHp, password } = req.body;
            const user = await User.findOne({
                where:{
                    [Op.or]: [{ email: emailHp}, { no_hp: emailHp }]
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
                user_type: user.user_type,
                user_valid: user.user_valid,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }

            const token = jwt.sign(dataUser, secretKey);
            res.status(200).json({
                status: true,
                message: "Login success",
                data: {
                    token: token,
                    user_type: dataUser.user_type,
                    user_valid: dataUser.user_valid
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
    dataDiriPelamar: async (req, res) => {
        try{
            const user = req.user;
            let jk = req.body.jk;
            let umur = req.body.umur;
            jk = parseInt(jk);
            umur = parseInt(umur);
            const dataPelamar = {
                nama_lengkap: req.body.nama_lengkap,
                tgl_lahir: req.body.tgl_lahir,
                jk: jk,
                umur: umur,
                alamat: req.body.alamat
            }
                const schema = {
                    nama_lengkap: 'string|requried',
                    tgl_lahir: 'string|requried',
                    jk: 'number|required',
                    umur: 'number|required',
                    alamat: 'string|requried'
                }
                const validate = v.validate(dataPelamar, schema);
                if(validate.length){
                    return res.status(400).json({
                        status: false,
                        message: "bad request!",
                        data: validate
                    });
                }
                
                const isAlready = await Pelamar.findOne({
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
                    nama_lengkap: dataPelamar.nama_lengkap,
                    tgl_lahir: dataPelamar.tgl_lahir,
                    jk: dataPelamar.jk,
                    umur: dataPelamar.umur,
                    alamat: dataPelamar.alamat
                });

                const updateUser = await User.update(
                    {
                        user_valid: 1
                    },
                    {
                        where: {
                            id: user.id
                        }
                    }
                );
                const dataUser = await User.findOne({
                    where:{
                        [Op.or]: [{email: user.email}, { no_hp: user.no_hp } ]
                    }
                });
                const dataUserToken = {
                    id: dataUser.id,
                    email: dataUser.email,
                    no_hp: dataUser.no_hp,
                    user_type: dataUser.user_type,
                    user_valid: dataUser.user_valid,
                    createdAt: dataUser.createdAt,
                    updatedAt: dataUser.updatedAt
                }
    
                const refreshToken = jwt.sign(dataUserToken, secretKey);

                return res.status(201).json({
                    status: true,
                    message: "Berhasil tambah data diri pelamar",
                    data: {
                        pelamar,
                        token: refreshToken
                    }
                });
        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    },
    dataDiriUmkm: async (req,res) => {
        try{
            const user = req.user;

            if(user.user_valid === true){
                return res.status(400).json({
                    status: false,
                    message: "user sudah isi datadiri!",
                    data: null
                });
            }
            
            let tahun_berdiri = req.body.tahun_berdiri;
            tahun_berdiri = parseInt(tahun_berdiri);
            const dataUmkm = {
                nama_toko: req.body.nama_toko,
                jenis_usaha: req.body.jenis_usaha,
                tahun_berdiri: tahun_berdiri,
                alamat: req.body.alamat,
            };
            const schema = {
                nama_toko: 'string|required',
                jenis_usaha: 'string|required',
                tahun_berdiri: 'number|required',
                alamat: 'string|required',
            }
            const validate = v.validate(dataUmkm, schema);
            if(validate.length){
                return res.status(400).json({
                    status: false,
                    message: "bad request!",
                    data: validate
                });
            }

            const isAlready = await Umkm.findOne({
                where:{
                    user_id: user.id
                }
            });

            if(isAlready){
                return res.status(400).json({
                    status: false,
                    message: "Data Already Exists",
                    data: null
                })
            }

            const umkm = await Umkm.create({
                user_id: user.id,
                nama_toko: dataUmkm.nama_toko,
                jenis_usaha: dataUmkm.jenis_usaha,
                tahun_berdiri: dataUmkm.tahun_berdiri,
                alamat: dataUmkm.alamat,
            });
            const updateUser = await User.update(
                {
                    user_valid: 1
                },
                {
                    where: {
                        id: user.id
                    }
                }
            );
            const dataUser = await User.findOne({
                where:{
                    [Op.or]: [{email: user.email}, { no_hp: user.no_hp } ]
                }
            });
            const dataUserToken = {
                id: dataUser.id,
                email: dataUser.email,
                no_hp: dataUser.no_hp,
                user_type: dataUser.user_type,
                user_valid: dataUser.user_valid,
                createdAt: dataUser.createdAt,
                updatedAt: dataUser.updatedAt
            }

            const refreshToken = jwt.sign(dataUserToken, secretKey);
            
            return res.status(201).json({
                status: true,
                message: "Berhasil tambah data usaha",
                data: {
                    umkm,
                    token: refreshToken
                }
            });

        }catch(err){
            return res.status(500).json({
                status:false,
                message: err.message,
                data: null
            })
        }
    }
}