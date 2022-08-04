const { User, Pelamar, Umkm, Pengalaman } = require('../models');
const Validator = require('fastest-validator');
const v = new Validator();

module.exports = {
    getProfile: async (req,res) => {
        try{
            

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
    }
}