const jwt = require('jsonwebtoken');

const authAdmin = (req, res, next)=>{
    try {
        const token = req.header('Authorization');
        const decode = jwt.verify(token, process.env.TokenSecret);
        req.user = decode;
        if(req.user.role === 'Admin') return next();
        return res.status(401).json({error: 'Authorization error'});
    } catch (ex) {
        return res.status(401).json({error: 'Authorization error'});
    }
}

exports.authAdmin = authAdmin;