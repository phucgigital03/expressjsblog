const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()


const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader){
        return res.status(401).json({
            message: "khong co quyen truy cap"
        })
    }
    const token = authHeader.split(' ')[1];
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
