const mongooseObj = require('../../util/mongoose')
const path = require('path')
console.log()
class siteController{
    // [get]: /
    home(req,res){
        res.json('home')
    }

    // [get]: /css/app.css
    css(req,res){
        res.status(201).sendFile(path.join(__dirname,'public','css','app.css'))
        return;
    }

    // [get]: /search
    search(req,res){
        res.render('search')
    }
}

module.exports = new siteController()
