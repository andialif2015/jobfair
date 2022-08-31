const { QueryTypes } = require('sequelize');
const { Pelamar,Daftar_lowongan,Lowongan, sequelize } = require('../models');

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
            const sekarang = date.now();
            
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
            })

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
            LEFT JOIN daftar_lowongans ON daftar_lowongans.id = ${req.body.daftar_lowongan_id}
            WHERE pelamars.user_id = ${req.body.pelamar_id}
            `, {type: QueryTypes.SELECT});

            const pengalaman = await sequelize.query(`
            SELECT * FROM pengalamans
            LEFT JOIN users ON users.id = pengalamans.user_id
            WHERE pengalamans.user_id = ${user.id}
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
    }
}