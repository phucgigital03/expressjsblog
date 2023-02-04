
module.exports = function verifyHtmlMiddleWare(req,res,next){
    let roles = req.cookies.roles || []
    if(typeof roles === 'string'){
        roles = JSON.parse(roles)
    }
    res.locals.user = {
        roles: roles,
    }
    next()
}
