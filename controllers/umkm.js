const {  Umkm, Lowongan, Deskripsi_kerja, Persyaratan, Pelamar, sequelize, Daftar_lowongan, Trx_klik } = require('../models');
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
                SELECT trx_save_lowongans.*, lowongans.posisi, lowongans.gaji, lowongans.tgl_mulai, lowongans.tgl_akhir, umkms.alamat, umkms.nama_toko, umkms.img_url FROM trx_save_lowongans
                LEFT JOIN pelamars ON pelamars.id = trx_save_lowongans.pelamar_id
                LEFT JOIN umkms ON umkms.id = trx_save_lowongans.umkm_id
                LEFT JOIN lowongans ON lowongans.id = trx_save_lowongans.lowongan_id
                WHERE pelamar_id = ${pelamar.id}`,
                {type: QueryTypes.SELECT});

            for(let x in savedLowongan){
                savedLowongan[x].tgl_mulai = dateHelper.dateFormat(savedLowongan[x].tgl_mulai);
                savedLowongan[x].tgl_akhir = dateHelper.dateFormat(savedLowongan[x].tgl_akhir);
            }
            
            return res.status(200).json({
                status: true,
                message: "Berhasil",
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
                `,{type: QueryTypes.SELECT});

                for(let x in searchLowongan){
                    searchLowongan[x].tgl_mulai = dateHelper.dateFormat(searchLowongan[x].tgl_mulai);
                    searchLowongan[x].tgl_akhir = dateHelper.dateFormat(searchLowongan[x].tgl_akhir);
                    searchLowongan[x].createdAt = dateHelper.dateFormat(searchLowongan[x].createdAt);
                    searchLowongan[x].updatedAt = dateHelper.dateFormat(searchLowongan[x].updatedAt);
                }

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
            let status = '';
            const user = req.user;
            const pelamar = await Pelamar.findOne({
                where:{
                    user_id: user.id
                }
            });
            const lowonganId = req.params.id;
            const lowongan = await sequelize.query(`
            SELECT lowongans.id, lowongans.posisi, lowongans.gaji, lowongans.tgl_mulai, lowongans.tgl_akhir, umkms.alamat, umkms.img_url, umkms.nama_toko
            FROM lowongans 
            LEFT JOIN umkms ON umkms.id = lowongans.umkm_id
            WHERE lowongans.id = ${lowonganId}
            `, {type: QueryTypes.SELECT});

            const daftarLowongan = await Daftar_lowongan.findOne({
                where:{
                    lowongan_id: lowonganId,
                    pelamar_id: pelamar.id
                }
            });

            if(daftarLowongan == null){
                status = null;
            }else{
                status = daftarLowongan.status;
            } 
            
            const persyaratan = await sequelize.query(`
            SELECT persyaratans.domisili, persyaratans.jk, persyaratans.keahlian, persyaratans.lainnya, persyaratans.umur, persyaratans.lainnya 
            FROM persyaratans
            WHERE persyaratans.lowongan_id = ${lowonganId}
            `, {type: QueryTypes.SELECT});

            const deskripsi = await sequelize.query(`
            SELECT deskripsi_kerjas.deskripsi AS Deskpisi_lowongan
            FROM deskripsi_kerjas 
            WHERE deskripsi_kerjas.lowongan_id = ${lowonganId}
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
                    status_daftar: status,
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
    detailLowonganId: async (req,res) =>{
        try{
            const lowonganId = req.params.id;
            const lowongan = await sequelize.query(`
            SELECT lowongans.id, lowongans.posisi, lowongans.gaji, lowongans.tgl_mulai, lowongans.tgl_akhir, umkms.alamat, umkms.img_url, umkms.nama_toko
            FROM lowongans 
            LEFT JOIN umkms ON umkms.id = lowongans.umkm_id
            WHERE lowongans.id = ${lowonganId}
            `, {type: QueryTypes.SELECT});
            
            const persyaratan = await sequelize.query(`
            SELECT persyaratans.domisili, persyaratans.jk, persyaratans.keahlian, persyaratans.lainnya, persyaratans.umur, persyaratans.lainnya 
            FROM persyaratans
            WHERE persyaratans.lowongan_id = ${lowonganId}
            `, {type: QueryTypes.SELECT});

            const deskripsi = await sequelize.query(`
            SELECT deskripsi_kerjas.deskripsi AS Deskpisi_lowongan
            FROM deskripsi_kerjas 
            WHERE deskripsi_kerjas.lowongan_id = ${lowonganId}
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
                    status_daftar: false,
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
    }
    ,
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
            SELECT daftar_lowongans.id AS daftar_lowongan_id, daftar_lowongans.waktu_daftar, daftar_lowongans.lowongan_id, daftar_lowongans.status AS status_lowongan, daftar_lowongans.pelamar_id,pelamars.nama_lengkap, pelamars.img_url, users.no_hp, pelamars.alamat  FROM daftar_lowongans 
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
            const daftarLowonganId = req.query.daftar_lowongan_id;
            const pelamarId = req.query.pelamar_id;
            const terimaPelamar = await Daftar_lowongan.update(
                { 
                    status: 1 
                },
                { 
                    where: {
                        id: daftarLowonganId,
                        pelamar_id: pelamarId
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
    tolakLamaran: async (req, res) => {
        try{
            const daftarLowonganId = req.query.daftar_lowongan_id;
            const pelamarId = req.query.pelamar_id;
            const tolakPelamar = await Daftar_lowongan.update(
                { 
                    status: 2 
                },
                { 
                    where: {
                        id: daftarLowonganId,
                        pelamar_id: pelamarId
                    }
                }
            );
            return res.status(200).json({
                status: true,
                message: "Berhasil Terima Pelamar",
                data: tolakPelamar
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

            for(let x in riwayat){
                riwayat[x].tgl_mulai = dateHelper.dateFormat(riwayat[x].tgl_mulai);
                riwayat[x].tgl_akhir = dateHelper.dateFormat(riwayat[x].tgl_akhir);
            }
            
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
    },
    postKlik: async(req,res) => {
        try{
            let jml_klik = parseInt(req.query.jumlahKlik);
            const lowonganId = parseInt(req.query.lowonganId);
            const user = req.user;
            const [klik, created] = await Trx_klik.findOrCreate({
                where: {
                    lowongan_id: lowonganId,
                    user_id: user.id
                },
                defaults:{
                    jumlah_klik: jml_klik
                }
            });
            if(created == false){
                jml_klik += klik.jumlah_klik;
                const update = await Trx_klik.update({
                    jumlah_klik: jml_klik
                }
                ,{
                    where: {
                        lowongan_id: lowonganId,
                        user_id: user.id
                    }
                });
                return res.status(201).json({
                    status: true,
                    message: "success",
                    data: null
                })
                
            }
            return res.status(200).json({
                status: true,
                message: "success",
                data: null
            })

        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    },
    rekomendasi: async(req,res) => {
        try{
            const user = req.user;
            const rekomendasi = await sequelize.query(`
            SELECT lowongans.*, umkms.alamat, umkms.nama_toko, umkms.img_url, trx_kliks.jumlah_klik 
            FROM lowongans 
            LEFT JOIN umkms ON umkms.id = lowongans.umkm_id
            LEFT JOIN trx_kliks ON trx_kliks.lowongan_id = lowongans.id
            WHERE trx_kliks.user_id = ${user.id}
				ORDER BY trx_kliks.jumlah_klik DESC
            `, {type: QueryTypes.SELECT});

            for(let x in rekomendasi){
                rekomendasi[x].tgl_mulai = dateHelper.dateFormat(rekomendasi[x].tgl_mulai);
                rekomendasi[x].tgl_akhir = dateHelper.dateFormat(rekomendasi[x].tgl_akhir);
                rekomendasi[x].createdAt = dateHelper.dateFormat(rekomendasi[x].createdAt);
                rekomendasi[x].updatedAt = dateHelper.dateFormat(rekomendasi[x].updatedAt);
            }
            
            return res.status(200).json({
                status: true,
                message: "Berhasil dapatkan semua lowongan",
                data: rekomendasi
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