const mongoose = require('mongoose')

const connect = async ()=>{
    try{
        await mongoose.connect(process.env.DB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('connect sucess')
    }catch(err){
        console.log('connect fail')
    }
}

module.exports = {
    connect,
}