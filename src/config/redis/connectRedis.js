const Redis = require('ioredis')

const renderRedis = new Redis({
    username: process.env.USERNAME_REDIS, 
    host: process.env.HOST_REDIS,             
    password: process.env.PASSWORD_REDIS,    
    port: process.env.PORT_REDIS, 
    tls: process.env.TLS_REDIS,
})

renderRedis.on('connect',()=>{
    console.log('redis connected success')
})

module.exports = {
    renderRedis,
}
