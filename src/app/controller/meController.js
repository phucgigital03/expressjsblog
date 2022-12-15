const Course = require('../model/Course')
const mongooseObj = require('../../util/mongoose')

class MeController{
    // [get]: /mycourse
    mycourses(req,res,next){
        
        const getCourses = async()=>{
            try{
                let courses;
                const types = {
                    des: -1,
                    asc: 1,
                }
                if(res.locals._sort.type === 'default'){
                    courses = await Course.find({}).exec()
                }else{
                    courses = await Course.find({}).sort({
                        [req.query.column]: types[res.locals._sort.type]
                    })
                }
                const countDeleted = await Course.countDeleted().exec()
                res.render('myCourses/mycourse',{
                    courses: mongooseObj.mutipleObj(courses),
                    countDeleted,
                })
            }catch(err){
                console.log(err)
            }
        }
        getCourses()
    }

    // [get] : /trashCourses
    trashCourses(req,res){
        const getCourseDeleted = async()=>{
            try{
                const courses = await Course.findDeleted({}).exec()
                res.render('myCourses/trash',{
                    courses: mongooseObj.mutipleObj(courses),
                })
            }catch(err){
                console.log(err)
            }
        }
        getCourseDeleted()
    }
}

module.exports = new MeController()
