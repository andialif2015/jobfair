const { Umkm, Pelamar } = require('../models');


module.exports = {
    single: async (req, res) =>{
        try{
            const user = req.user;
            const path = req.protocol + '://' + req.get('host') + '/image/' + req.file.filename;
            res.header("Access-Control-Allow-Origin", "*");
            if(user.user_type == 1){
                const updateUmkm = await Umkm.update(
                    { 
                        img_url: path 
                    },
                    { 
                        where: {
                            user_id: user.id
                        }
                    }
                );
                return res.status(200).json({
                    status: true,
                    message: "Berhasil Upload Foto Profil",
                    data : updateUmkm
                })
            }else if(user.user_type == 2){
                const updatePelamar = await Pelamar.update(
                    { 
                        img_url: path 
                    },
                    { 
                        where: {
                            user_id: user.id
                        }
                    }
                );
                return res.status(200).json({
                    status: true,
                    message: "Berhasil Upload Foto Profil",
                    data : updatePelamar
                })
            }
         
        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    }
}