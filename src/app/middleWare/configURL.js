
module.exports = function configURL(req,res,next){
    res.locals.LOCALHOST = process.env.LOCALHOST
    next()
}