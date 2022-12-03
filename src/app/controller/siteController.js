const Course = require('../model/Course')

class siteController{
    // [get]: /
    home(req,res){
        const getCoures = async ()=>{
            try{
                const result = await Course.find({})
                
                res.json(result)
            }catch(error){
                console.log(error)
                res.status(500).send("loi")
            }
        }
        getCoures()
        // res.render('home')
    }

    // [get]: /search
    search(req,res){
        res.render('search')
    }
}

module.exports = new siteController()
