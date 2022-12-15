module.exports = function sortMiddleWare(req,res,next){
    res.locals._sort = {
        enabled: false,
        type: 'default',
        column: undefined
    }
    if(req.query.hasOwnProperty('_sort')){
        Object.assign(res.locals._sort,{
            type: req.query.type,
            column: req.query.column,
            enabled: true,
        })
    }
    next()
}