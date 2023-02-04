const Product = require('../../model/Product')
const mongooseObj = require('../../../util/mongoose')

class ClientController{
    //[get] /formCreatePro
    formCreatePro(req,res,next){
        return res.render("products/formCreatePro.hbs")
    }

    //[get] /orderUser
    orderUser(req,res,next){
        return res.render("order/manageOrder.hbs")
    }

    //[get] /managePrice
    managePrice(req,res,next){
        return res.render("order/managePrice.hbs")
    }

    //[get] /watchUser
    watchUser(req,res,next){
        return res.render("user/allUser.hbs")
    }
}

module.exports = new ClientController()
