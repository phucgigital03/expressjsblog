const Course = require('../model/Course')
const mongooseObj = require('../../util/mongoose')

class siteController{
    // [get]: /
    home(req,res){
        const getCoures = async ()=>{
            try{
                const courses = await Course.find({})
                res.render('home',{ courses: mongooseObj.mutipleObj(courses) })
            }catch(error){
                console.log(error)
            }
        }
        getCoures()
    }

    // [get]: /search
    search(req,res){
        res.render('search')
    }
}

module.exports = new siteController()
