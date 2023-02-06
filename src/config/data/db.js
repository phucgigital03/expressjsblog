const mongoose = require('mongoose')

const connect = async ()=>{
    try{
        await mongoose.connect(process.env.DB_URL_ATLAS,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('DB connect sucess')
    }catch(err){
        console.log('DB connect fail')
    }
}

module.exports = {
    connect,
}