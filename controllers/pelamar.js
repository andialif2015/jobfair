const { Pelamar,Daftar_lowongan,Lowongan } = require('../models');

module.exports = {
    daftarLowongan: async (req, res) => {
        try{
            const user = req.user;
            const lowongan = await Lowongan.findOne(
                { 
                    attributes: ['id','umkm_id'] 
                },
                {
                    where: {
                        id: req.body.lowongan_id    
                    }
                }
            );
            const pelamar = await Pelamar.findOne(
                {
                    attributes: ['id']
                },
                {
                    where: {
                        user_id: user.id
                    }
                }  
            );
            const sekarang = Date.now();
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
    }
}