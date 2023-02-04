const { incr,expire,getTtl } = require('../../util/redis')

const redisGetIp = async (req,res,next)=>{
    try{
        const ipUser = '125.0.0.1' || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
        const numRequest = await incr(ipUser)
        let ttl;
        if(numRequest === 1){
            await expire(ipUser,60);
            ttl = 60;
        }else{
            ttl = await getTtl(ipUser)
        }

        if(numRequest > 20){
            res.status(503).json({
                message: "server busy",
                ipUser: ipUser,
                numRequest: numRequest,
                ttl: ttl
            })
            return;
        }
        next()
    }catch(err){
        console.log(err)
        next(err)
    }
}

module.exports = redisGetIp
