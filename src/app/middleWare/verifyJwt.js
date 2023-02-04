const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()


const verifyToken = (req,res,next)=>{
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(authHeader?.startsWith('Bearer')){
        token = authHeader.split(' ')[1];
        if(!token){
            return res.status(401).json({
                message: "khong co quyen truy cap"
            })
        }
    }
    jwt.verify(token,process.env.ACCESS_KEY_TOKEN,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                message: "token het han or token sai"
            })
        }
        req.username = decoded.userInfo.username;
        req.roles = decoded.userInfo.roles
        next()
    })
}

module.exports = verifyToken
