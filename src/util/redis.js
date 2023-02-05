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

const decrby = (key,numberIncr)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result = await client.decrBy(key,numberIncr)
            resolve(result)
        }catch(err){
            reject(err)
        }
    })
}

const setNx = (key,valueSet)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result = await client.set(key,valueSet)
            resolve(result)
        }catch(err){
            reject(err)
        }
    })
}

const exist = (key)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const result = await client.exists(key)
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
    incrby,
    setNx,
    exist,
    decrby
}
