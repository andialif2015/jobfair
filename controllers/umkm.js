const { User, Umkm } = require('../models')

module.exports = {
    addLowongan: async (req, res) => {
        try{
            const user = req.user;

            return res.send(user);
        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            })
        }
    }
}