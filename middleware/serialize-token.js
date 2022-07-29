const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try{
        let bearer = req.headers['authorization'];
        
        if(!bearer){
            return res.status(400).json({
                status: false,
                message: "Silahkan login terlebih dahulu",
                data: null
            })
        }
        
        const token = bearer.split(' ')[1];
        const secretKey = 'ini_key_rahasia';
        const decode = jwt.verify(token, secretKey);
        req.user = decode;

        next();
    }catch(err){
        res.status(500).json({
            status: false,
            message: err.message,
            data: null
        })
    }

}