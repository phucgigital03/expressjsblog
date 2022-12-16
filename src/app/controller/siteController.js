const mongooseObj = require('../../util/mongoose')

class siteController{
    // [get]: /
    home(req,res){
        res.json('home')
    }

    // [get]: /search
    search(req,res){
        res.render('search')
    }
}

module.exports = new siteController()
