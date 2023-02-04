const md5 = require('md5')
const { client } = require('../../config/redis/connectRedis')

const createSign = async (params)=>{
    const keySecrect = 'xxxxYYYY';
    params.keySecrect = keySecrect;
    const sortKeys = [];
    for(const key in params){
        if(key !== 'sign'){
            sortKeys.push(key)
        }
    }
    sortKeys.sort()
    let paramsHolder = '';
    for(const key of sortKeys){
        paramsHolder += (key + params[key])
    }
    return md5(paramsHolder).toString()
}

const securityRequest = async (req,res,next)=>{
    try{
        const {
            stime,
            nonce,
            sign,
        } = req.query
        if(!stime || !nonce || !sign){
            res.status(400).json({
                message: "bad request"
            })
            return;
        }
        if(Math.floor(Date.now() / (1000 * 60)) - stime > 1){
            res.status(403).json({
                message: "api expired"
            })
            return;
        }
        const signServer = await createSign(req.query);
        if(sign !== signServer){
            res.status(409).json({
                message: "conflic infomation"
            })
            return;
        }
        const isCheck = await client.exists(nonce)
        if(isCheck){
            res.status(403).json({
                message: "unthorization"
            })
            return;
        }
        await client.set(nonce,"true");
        next()
    }catch(err){
        next(err)
    }
}

module.exports = securityRequest
