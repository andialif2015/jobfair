const { User, Pelamar, Umkm, Pengalaman, sequelize, Trx_save_lowongan, Lowongan } = require('../models');
const Validator = require('fastest-validator');
const v = new Validator();
const { QueryTypes, Op } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = {
    getProfileUmkm: async (req,res) => {
        try{
            const user = req.user;
            if(user.user_type == 2){
                return res.status(400).json({
                    status: false,
                    message: "Profil Umkm Not Found!",
                    data: null
                })
            }
            const profil = await sequelize.query(`
            SELECT umkms.*, users.no_hp, users.email FROM umkms
            LEFT JOIN users on users.id = umkms.user_id
            WHERE user_id = ${user.id}
            `,{ type: QueryTypes.SELECT });

            return res.status(200).json({
                status: true,
                message: "Success get profil umkm",
                data: profil[0]
            })

        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }

    },
    getProfilePelamar: async (req,res) => {
        try{
            const user = req.user;
            
            if(user.user_type == 1){
                return res.status(400).json({
                    status: false,
                    message: "Profil Pelamar Not Found!",
                    data: null
                })
            }
            const profil = await sequelize.query(`
                SELECT pelamars.*, users.no_hp, users.email FROM pelamars 
                LEFT JOIN users ON users.id = pelamars.user_id
                WHERE user_id = ${user.id}
            `,{ type: QueryTypes.SELECT });

            return res.status(200).json({
                status: true,
                message: "Success get profil pelamar",
                data: profil[0]
            })

        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }

    },
    updateProfilUmkm: async (req,res) => {
        try{
            const user = req.user;
            const schema = {
                nama_toko: 'string|required',
                jenis_usaha: 'string|required',
                tahun_berdiri: 'number|required',
                alamat: 'string|required',
                email: 'email|required',
                no_hp: 'string|required'
            }
            const isExist = await User.findOne({
                where:{
                    [Op.not]: [{id: user.id}],
                    [Op.or]: [{email: req.body.email}, {no_hp: req.body.no_hp}]
                }
            });
            if(isExist){
                return res.status(400).json({
                    status: false,
                    message: "User sudah ada",
                    data: null
                })
            }

            const validate = v.validate(req.body, schema);
            if(validate.length){
                return res.status(400).json({
                    status: false,
                    message: "Bad Request!",
                    data: validate
                })
            }

            const profil = await Umkm.update(
                { 
                    nama_toko: req.body.nama_toko,
                    jenis_usaha: req.body.jenis_usaha,
                    tahun_berdiri: req.body.tahun_berdiri,
                    alamat: req.body.alamat
                 },
                 {
                    where: {
                        user_id: user.id
                    }
                 }
            );

            const userUpdate = await User.update(
                {
                    email: req.body.email,
                    no_hp: req.body.no_hp
                },
                {
                    where: {
                        id: user.id
                    }
                }
            );

            return res.status(200).json({
                status: true,
                message: "Berhasil update profil",
                data: profil
            });
           
        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    },
    updateProfilPelamar: async (req,res) => {
        try{
            const user = req.user;
            let jk = parseInt(req.body.jk);
            let umur = parseInt(req.body.jk);
            const dataPelamar = {
                nama_lengkap: req.body.nama_lengkap,
                tgl_lahir: req.body.tgl_lahir,
                jk: jk,
                umur: umur,
                alamat: req.body.alamat,
                email: req.body.email,
                no_hp: req.body.no_hp
            }
            const isExist = await User.findOne({
                where:{
                    [Op.not]: [{id: user.id}],
                    [Op.or]: [{email: dataPelamar.email}, {no_hp: dataPelamar.no_hp}]
                }
            });
            if(isExist){
                return res.status(400).json({
                    status: false,
                    message: "User sudah ada",
                    data: null
                })
            }

            const schema = {
                nama_lengkap: 'string|requried',
                tgl_lahir: 'string|requried',
                jk: 'number|required',
                umur: 'number|required',
                alamat: 'string|requried',
                email: 'email|required',
                no_hp: 'string|required'
            }
            const validate = v.validate(dataPelamar, schema)
            if(validate.length){
                return res.status(400).json({
                    status: false,
                    message: "Bad Request!",
                    data: validate
                })
            }

            const profil = await Pelamar.update(
                {
                    nama_lengkap: dataPelamar.nama_lengkap,
                    tgl_lahir: dataPelamar.tgl_lahir,
                    jk: dataPelamar.jk,
                    umur: dataPelamar.umur,
                    alamat: dataPelamar.alamat
                },
                {
                    where:{
                        user_id: user.id
                    }
                }
            );
            const userProfil = await User.update(
                {
                    email: dataPelamar.email,
                    no_hp: dataPelamar.no_hp
                },
                {
                    where:{
                        id: user.id
                    }
                }
            );

            return res.status(200).json({
                status: true,
                message: "Sukses edit profil",
                data: profil
            });
        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    },
    pengalaman: async (req,res) => {
        try{
            const { posisi, nama_perusahaan, jenis_usaha, lokasi } = req.body;
            let tahun = req.body.tahun;
            tahun = parseInt(tahun);
            const user = req.user;

            const schema = {
                posisi: 'string|required',
                nama_perusahaan: 'string|required',
                jenis_usaha: 'string|required',
                tahun: 'number|required',
                lokasi: 'string|required'
            }

            const dataPengalaman = {
                posisi: posisi,
                nama_perusahaan: nama_perusahaan,
                jenis_usaha: jenis_usaha,
                tahun: tahun,
                lokasi: lokasi
            }
            
            const validate = v.validate(dataPengalaman, schema);
            if(validate.length){
                return res.status(400).json({
                    status: false,
                    message: "bad request!",
                    data: validate
                })
            }

            const newPengalaman = await Pengalaman.create({
                user_id: user.id,
                posisi: dataPengalaman.posisi,
                nama_perusahaan: dataPengalaman.nama_perusahaan,
                jenis_usaha: dataPengalaman.jenis_usaha,
                tahun: dataPengalaman.tahun,
                lokasi: dataPengalaman.lokasi
            })

            return res.status(201).json({
                status: false,
                message: 'success tambah pengalaman',
                data: newPengalaman
            });
        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    },
    resetPassword: async (req,res) => {
        try{
            const user = req.user;
            
            const dataUser = await User.findOne({
                where: {
                    id: user.id
                }
            });
            const checkPassword = bcrypt.compareSync(req.body.sandi_lama, dataUser.password);
            if(!checkPassword){
                return res.status(400).json({
                    status: false,
                    message: "password salah!",
                    data: null
                });
            }
            if(req.body.sandi_baru !== req.body.konfirmasi_sandi){
                return res.status(400).json({
                    status: false,
                    message: "password tidak sama!",
                    data: null
                });
            }
            const hashPassword = await bcrypt.hash(req.body.sandi_baru, 10);
            
            const passwordUpdate = await User.update(
                {
                    password: hashPassword
                },
                {
                    where: {
                        id: user.id
                    }
                }
            )
            return res.status(200).json({
                status: true,
                message: "Password Berhasil direset",
                data: null
            });
        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    },
    simpanLowongan: async (req, res) => {
        try{
            const user = req.user;
            
            const pelamar = await Pelamar.findOne(
                {
                    attributes: ['id']
                },    
                {
                    where:{
                        user_id: user.id
                    }
                }
            );
            return res.send(pelamar);
            
            const lowongan = await Lowongan.findOne(
                {
                    attributes: ['id','umkm_id'],
                    where: { id: req.body.lowongan_id }
                }
            );

            const [saveLowongan, created] = await Trx_save_lowongan.findOrCreate({
                where: {
                    pelamar_id: pelamar.id,
                    lowongan_id: lowongan.id
                },
                defaults:{
                    umkm_id: lowongan.umkm_id,
                       saved: req.body.saved
                }
            });
            if(created == false){
                const updateTrx_save_lowongan = await Trx_save_lowongan.update(
                    { 
                        saved: req.body.saved
                    },
                    { 
                        where:{
                            pelamar_id: pelamar.id,
                            lowongan_id: lowongan.id
                        }
                    }
                );
                return res.status(200).json({
                    status: true,
                    message: "Berhasil Update save Lowongan",
                    data: updateTrx_save_lowongan
                })

            }
            // const checkTrxSave = await Trx_save_lowongan.findOne({
            //     where:{
            //         [Op.and]: [{pelamar_id: pelamar.id},{lowongan_id: lowongan.id}]
            //     }
            // });
            // return res.send(!checkTrxSave);
            // if(checkTrxSave){
                
            //    const updateTrx_save_lowongan = await Trx_save_lowongan.update(
            //         { 
            //             saved: req.body.saved
            //         },
            //         { 
            //             where:{
            //                 [Op.and]: [{pelamar_id: pelamar.id},{lowongan_id: lowongan.id}]
            //             }
            //         }
            //     );
            //     return res.status(200).json({
            //         status: true,
            //         message: "Berhasil Update save Lowongan",
            //         data: updateTrx_save_lowongan
            //     })
            // }else{
                
            //     const trx_save_lowongan = await Trx_save_lowongan.create({
            //         pelamar_id: pelamar.id,
            //         umkm_id: lowongan.umkm_id,
            //         lowongan_id: lowongan.id,
            //         saved: req.body.saved
            //     });
            //     return res.status(200).json({
            //         status: true,
            //         message: "Berhasil Simpan saved Lowongan",
            //         data: trx_save_lowongan
            //     })
            // }

            return res.status(200).json({
                status: true,
                message: "Berhasil Simpan saved Lowongan",
                data: null
            })

            

        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    }
}