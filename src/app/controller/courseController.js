const Course = require('../model/Course')
const mongooseObj = require('../../util/mongoose')
const slugify = require('slugify')

class CourseController{
    // [get]: /:slug
    show(req,res){
        const getOneCourse = async()=>{
            try{
                const course = await Course.findOne({slug: req.params.slug})
                res.render('courses/show',{course: mongooseObj.oneObj(course)})
            }catch(error){
                console.log(error)
            }
        }
        getOneCourse()
    }

    // [get]: /create
    create(req,res){
        res.render('courses/create')
    }

    // [get]: /storeCreate
    storeCreate(req,res){
        const formDataCourse = req.body;
        formDataCourse.image = `https://i.ytimg.com/vi/${formDataCourse.videoId}/hqdefault.jpg?sqp=-oaymwEcCPYBEIoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDU6wLL8X-7FPoJAYa7w02PqbhKrQ`
        const saveOneCourse = async ()=>{
            try{
                const course = new Course(formDataCourse)
                await course.save()
                res.redirect('/')
            }catch(error){
                console.log(error)
            }
        }
        saveOneCourse()
    }

    // [get]: /:id/update
    update(req,res){
        const getOneCourseUpd = async()=>{
            try{
                const course = await Course.findOne({_id: req.params.id})
                res.render('courses/update',{
                    course: mongooseObj.oneObj(course)
                })
            }catch(err){
                console.log(err)
            }
        }
        getOneCourseUpd()
    }

    // [patch] : /storeUpdate
    storeUpdate(req,res){
        const updateOneCourse = async()=>{
            try{
                const id = req.body._id
                const filedName = req.body.name;
                const course = await Course.find({name: filedName})
                if(course.length !== 0){
                    res.status(403).json('loi client trung name')
                }else{
                    req.body.slug = slugify(filedName)
                    await Course.updateOne({_id: id},req.body)
                    res.redirect('/me/mycourses');
                }
            }catch(err){
                console.log(err)
            }
        }
        updateOneCourse()
    }

    // [delte] : /:id/sortDelete
    sortDelete(req,res){
        const id = req.params.id
        const deleOneCourse = async()=>{
            try{
                await Course.delete({_id: id}).exec()
                res.redirect('back');
            }catch(err){
                console.log(err)
            }
        }
        deleOneCourse()
    }

    // [delete] : /:id/delete
    destroy(req,res){
        const destroyCourse = async ()=>{
            try{
                const id = req.params.id;
                console.log(id)
                await Course.findByIdAndDelete(id)
                res.redirect('back');
            }catch(err){
                console.log(err)
            }
        }
        destroyCourse()
    }

    // [get] /:id/restore
    restore(req,res){
        const restoreCourse = async ()=>{
            try{
                const id = req.params.id
                await Course.restore({_id: id}).exec()
                res.redirect('back');
            }catch(err){
                console.log(err)
            }
        }
        restoreCourse()
    }

    // [action] /handleAcrions
    handleActions(req,res){
        const handleSubmitAction = async()=>{
            let conditionAction = []
            conditionAction = conditionAction.concat(req.body.courseId)
            switch(req.body.action){
                case 'delete':
                    await Course.delete({_id: {$in: conditionAction}}).exec()
                    res.redirect('back');
                    break;
                default:
                    res.json('action no match')
            }
        }
        handleSubmitAction()
    }
}

module.exports = new CourseController()
