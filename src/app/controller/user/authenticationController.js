const mongooseObj = require('../../../util/mongoose')
const Product = require('../../../app/model/Product')

class authenticationController{
    //[get]: /register
    register(req,res,next){
        res.render("authentication/register.hbs")
        return;
    }

    //[get]: /signIn
    signIn(req,res,next){
        res.render("authentication/signIn.hbs")
        return;
    }
}

module.exports = new authenticationController()
