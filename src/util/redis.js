const { client } = require('../config/redis/connectRedis')

const incr = (key)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result = await client.incr(key)
            resolve(result)
        }catch(err){
            reject(err)
        }
    })
}

const expire = (key,valueTime)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result = await client.expire(key,valueTime)
            resolve(result)
        }catch(err){
            reject(err)
        }
    })
}

const getTtl = (key)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result = await client.ttl(key)
            resolve(result)
        }catch(err){
            reject(err)
        }
    })
}

const incrby = (key,numberIncr)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result = await client.incrBy(key,numberIncr)
            resolve(result)
        }catch(err){
            reject(err)
        }
    })
}

const setNx = (key,vualueSet)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result = await client.setNX(key,vualueSet)
            resolve(result)
        }catch(err){
            reject(err)
        }
    })
}

module.exports = {
    incr,
    expire,
    getTtl,
    incr,
    setNx
}
