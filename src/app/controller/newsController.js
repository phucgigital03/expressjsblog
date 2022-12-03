
class NewsController{
    // [get]: /
    index(req,res){
        res.render('news')
    }

    // [get]: /:slug
    show(req,res){
        res.send('chi tiet')
    }
}

module.exports = new NewsController()
