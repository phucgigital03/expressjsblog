const redis = require('redis')

const client = redis.createClient({
    host: 'http://localhost:5500',
    port: 6379
})

const connectRedis = async()=>{
    try{
        await client.connect()
    }catch(err){
        console.log("redis connect error")
    }
}
connectRedis()

client.on('connect',()=>{
    console.log('redis connected')
})

module.exports = {
    client,
}
