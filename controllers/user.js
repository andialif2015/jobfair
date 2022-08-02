const { User, Pelamar, Umkm } = require('../models');

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

    }
}