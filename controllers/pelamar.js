const { QueryTypes } = require('sequelize');
const { Pelamar,Daftar_lowongan,Lowongan, sequelize } = require('../models');
const dateHelper = require('../helpers/dateHelpers');

module.exports = {
    daftarLowongan: async (req, res) => {
        try{
            const user = req.user;
            const pelamar = await Pelamar.findOne(
                {
                    where: {
                        user_id: user.id
                    }
                }  
            );

            const isExistDaftarLowongan = await Daftar_lowongan.findOne({
                where:{
                    lowongan_id: req.body.lowongan_id,
                    pelamar_id: pelamar.id
                }
            })
            if(isExistDaftarLowongan){
                return res.status(400).json({
                    status: false,
                    message: "Anda sudah daftar lowongan ini",
                    data: null
                });
            }
            
            const lowongan = await Lowongan.findOne(
                {
                    where: {
                        id: req.body.lowongan_id    
                    }
                }
            );

            
            const date = new Date();
            const sekarang = dateHelper.dateFormat(date);
            
            const daftar = await Daftar_lowongan.create({
                umkm_id: lowongan.umkm_id,
                lowongan_id: lowongan.id,
                pelamar_id: pelamar.id,
                waktu_daftar: sekarang,
                status: req.body.status
            });
            return res.status(200).json({
                status: true,
                message: "Berhasil Daftar",
                data: daftar
            });

        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    },
    detailPelamar: async(req, res) => {
        try{
            const user = req.user;

            const pelamar = await sequelize.query(`
            SELECT pelamars.*, pengalamans.posisi, pengalamans.tahun, pengalamans.lokasi, pengalamans.posisi, users.no_hp, daftar_lowongans.id AS daftar_lowongan_id  FROM pelamars 
            LEFT JOIN pengalamans ON pengalamans.user_id = pelamars.user_id
            LEFT JOIN users ON users.id = pelamars.user_id
            LEFT JOIN daftar_lowongans ON daftar_lowongans.id = ${req.query.daftar_lowongan_id}
            WHERE pelamars.id = ${req.query.pelamar_id}
            `, {type: QueryTypes.SELECT});

            const pengalaman = await sequelize.query(`
            SELECT * FROM pengalamans
            WHERE pengalamans.user_id = ${pelamar[0].user_id}
            `, {type: QueryTypes.SELECT});

            return res.status(200).json({
                status: true,
                message: "Berhasil ambil data pelamar",
                data: {
                    pelamar,
                    pengalaman
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
    listLowongan: async (req, res) => {
        try{
            const user = req.user;
            const pelamar = await Pelamar.findOne({
                where: {
                    user_id: user.id
                }
            });

            const listLowonganUser = await sequelize.query(`
            SELECT daftar_lowongans.*, lowongans.posisi, lowongans.gaji, umkms.nama_toko, umkms.alamat, umkms.img_url FROM daftar_lowongans
            LEFT JOIN lowongans ON lowongans.id = daftar_lowongans.lowongan_id
            LEFT JOIN umkms ON umkms.id = daftar_lowongans.umkm_id
            WHERE daftar_lowongans.pelamar_id = ${pelamar.id}
            `, {type: QueryTypes.SELECT});

            return res.status(200).json({
                status: true,
                message: "Berhasil dapatkan list lowongan",
                data: listLowonganUser
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