
const notFound = (req,res,next)=>{
    res.status(404)
    res.render("notFound.hbs")
    return;
}

const errorHandler = (error,req,res,next)=>{
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: error.message
    })
    return;
}

module.exports = {notFound,errorHandler}
