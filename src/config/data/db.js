const mongoose = require('mongoose')

const connect = async ()=>{
    try{
        await mongoose.connect('mongodb://localhost:27017/nodejs_blog_dev',{
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