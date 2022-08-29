const {  Umkm, Lowongan, Deskripsi_kerja, Persyaratan, Pelamar, sequelize, Daftar_lowongan } = require('../models');
const Validator = require('fastest-validator');
const v = new Validator();
const { QueryTypes, Op } = require('sequelize');
const dateHelper = require('../helpers/dateHelpers');

module.exports = {
    getLowonganSaveById: async (req, res) => {
        try{
            const user = req.user;
            
            const pelamar = await Pelamar.findOne(

                {
                    attributes: ['id'],
                    where: {
                        user_id: user.id
                    }
                }
            );
            
            const savedLowongan = await sequelize.query(`
                SELECT * FROM trx_save_lowongans
                LEFT JOIN pelamars ON pelamars.id = trx_save_lowongans.pelamar_id
                LEFT JOIN umkms ON umkms.id = trx_save_lowongans.umkm_id
                WHERE pelamar_id = ${pelamar.id}`,
                {type: QueryTypes.SELECT});
            
            
            return res.status(200).json({
                status: true,
                message: "berhasil",
                data: savedLowongan
            })
                
        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    },
    addLowongan: async (req, res) => {
        try{
            const user = req.user;
            const description = req.body.deskripsi;
            let umur = parseInt(req.body.umur);
            
            const umkm = await Umkm.findOne(
                {
                    attributes: ['id'],
                    where: {
                        user_id: user.id
                    }
                }
            );
            const dataRequest = {
                posisi: req.body.posisi,
                gaji: req.body.gaji,
                deskripsi: req.body.deskripsi,
                jk: req.body.jk,
                umur: umur,
                pendidikan: req.body.pendidikan,
                domisili: req.body.domisili,
                keahlian: req.body.keahlian,
                lainnya: req.body.lainnya,
            }
            
            const schema = {
                posisi: 'string|required',
                gaji: 'string|required',
                deskripsi: {type: "array", items: "string"},
                jk: 'string|required',
                umur: 'number|required',
                pendidikan: 'string|required',
                domisili: 'string|required',
                keahlian: 'string|required',
                lainnya: 'string|required',
            }

            const validate = v.validate(dataRequest, schema);
            if(validate.length){
                return res.status(400).json({
                    status: false,
                    message: "Bad Request!",
                    data: validate
                })
            }

            const lowongan = await Lowongan.create({
                posisi: req.body.posisi,
                gaji: req.body.gaji,
                tgl_mulai: req.body.tgl_mulai,
                tgl_akhir: req.body.tgl_akhir,
                umkm_id: umkm.id
            });
            for(i in description){
                let deskripsiLowongan = await Deskripsi_kerja.create({
                    deskripsi: description[i],
                    lowongan_id: lowongan.id
                });
            }
            const persyaratan = await Persyaratan.create({
                jk: dataRequest.jk,
                umur: dataRequest.umur,
                pendidikan: dataRequest.pendidikan,
                domisili: dataRequest.domisili,
                keahlian: dataRequest.keahlian,
                lainnya: dataRequest.lainnya,
                lowongan_id: lowongan.id
            });
            
            return res.status(200).json({
                status: true,
                message: "Berhasil tambahkan lowongan pekerjaan",
                data: lowongan
            })
        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    },
    getAllLowongan: async (req, res) => {
        try{
            const search = req.query.s;
            
            if(search){
                const searchLowongan = await sequelize.query(`
                SELECT lowongans.*, umkms.alamat, umkms.nama_toko, umkms.img_url 
                FROM lowongans 
                LEFT JOIN umkms ON umkms.id = lowongans.umkm_id
                WHERE (
                    lowongans.posisi like '%${search}%'
                    OR umkms.nama_toko like '%${search}%'
                    OR umkms.alamat like '%${search}%'
                ) 
                `,{type: QueryTypes.SELECT})
                return res.status(200).json({
                    status: true,
                    message: "Berhasil Search Lowongan",
                    data: searchLowongan
                });
            }

            
            const lowongan = await sequelize.query(`
            SELECT lowongans.*, umkms.alamat, umkms.nama_toko, umkms.img_url 
            FROM lowongans 
            LEFT JOIN umkms ON umkms.id = lowongans.umkm_id
            `, {type: QueryTypes.SELECT});

            for(let x in lowongan){
                lowongan[x].tgl_mulai = dateHelper.dateFormat(lowongan[x].tgl_mulai);
                lowongan[x].tgl_akhir = dateHelper.dateFormat(lowongan[x].tgl_akhir);
                lowongan[x].createdAt = dateHelper.dateFormat(lowongan[x].createdAt);
                lowongan[x].updatedAt = dateHelper.dateFormat(lowongan[x].updatedAt);
            }
            
            return res.status(200).json({
                status: true,
                message: "Berhasil dapatkan semua lowongan",
                data: lowongan
            })
        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    },
    detailLowongan: async (req, res) =>{
        try{
            const user = req.user;
            const lowongan_id = req.params.id;
            const lowongan = await sequelize.query(`
            SELECT lowongans.id, lowongans.posisi, lowongans.gaji, lowongans.tgl_mulai, lowongans.tgl_akhir, umkms.alamat, umkms.img_url, umkms.nama_toko
            FROM lowongans 
            LEFT JOIN umkms ON umkms.id = lowongans.umkm_id
            WHERE lowongans.id = ${lowongan_id}
            `, {type: QueryTypes.SELECT});
            
            const persyaratan = await sequelize.query(`
            SELECT persyaratans.domisili, persyaratans.jk, persyaratans.keahlian, persyaratans.lainnya, persyaratans.umur, persyaratans.lainnya 
            FROM persyaratans
            WHERE persyaratans.lowongan_id = ${lowongan_id}
            `, {type: QueryTypes.SELECT});

            const deskripsi = await sequelize.query(`
            SELECT deskripsi_kerjas.deskripsi AS Deskpisi_lowongan
            FROM deskripsi_kerjas 
            WHERE deskripsi_kerjas.lowongan_id = ${lowongan_id}
            `, {type: QueryTypes.SELECT});

            return res.status(200).json({
                status: true,
                message: "Berhasil ambil detail lowongan",
                data: {
                    id_lowongan: lowongan[0].id,
                    posisi: lowongan[0].posisi,
                    gaji: lowongan[0].gaji,
                    tgl_mulai: lowongan[0].tgl_mulai,
                    tgl_akhir: lowongan[0].tgl_akhir,
                    alamat_umkm: lowongan[0].alamat,
                    img_url: lowongan[0].img_url,
                    nama_toko: lowongan[0].nama_toko,
                    persyaratan: persyaratan[0],
                    deskripsi: deskripsi
                    
                }
            })
        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    },
    getPelamar: async (req, res) => {
        try{
            const user = req.user;
            const umkm = await Umkm.findOne(
                {
                    attributes: ['id'],
                    where: {
                        user_id: user.id
                    }
                }
            );
            const daftarPelamar = await sequelize.query(`
            SELECT daftar_lowongans.id AS daftar_lowongan_id, daftar_lowongans.waktu_daftar, daftar_lowongans.lowongan_id, daftar_lowongans.pelamar_id,pelamars.nama_lengkap, pelamars.img_url, users.no_hp, pelamars.alamat  FROM daftar_lowongans 
            LEFT JOIN pelamars ON pelamars.id = daftar_lowongans.pelamar_id
            LEFT JOIN users ON users.id = pelamars.user_id
            WHERE umkm_id = ${umkm.id}
            `, { type: QueryTypes.SELECT});

            return res.status(200).json({
                status: true,
                message: "Berhasil dapat data pelamar",
                data: daftarPelamar
            })

        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    },
    terimaLamaran: async (req, res) => {
        try{
            const user = req.user;
            const terimaPelamar = await Daftar_lowongan.update(
                { 
                    status: 1 
                },
                { 
                    where: {
                        id: req.body.daftar_lowongan_id
                    }
                }
            );
            return res.status(200).json({
                status: true,
                message: "Berhasil Terima Pelamar",
                data: terimaPelamar
            });

        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    },
    riwayatLowongan: async (req, res) => {
        try{
            const user = req.user;

            const umkm = await Umkm.findOne(
                {
                    attributes: ['id'],
                    where: {
                        user_id: user.id
                    }
                }
            );
            
            const riwayat = await sequelize.query(`
            SELECT lowongans.posisi, lowongans.tgl_mulai, lowongans.tgl_akhir, umkms.nama_toko, umkms.alamat, umkms.img_url
            FROM lowongans
            LEFT JOIN umkms ON umkms.id = lowongans.umkm_id
            LEFT JOIN users ON users.id = umkms.user_id
            WHERE lowongans.umkm_id = ${umkm.id}
            `, {type: QueryTypes.SELECT});
            
            return res.status(200).json({
                status: true,
                message: "Berhasil dapat riwayat lowongan",
                data: riwayat
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