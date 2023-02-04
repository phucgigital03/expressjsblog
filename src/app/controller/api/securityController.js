

class securityController{
    //[get] /v1
    v1(req,res,next){
        res.status(201).json({
            message: "successfull",
            username: req.query.username
        })  
        return;      
    }

    //[get] /time
    time(req,res,next){
        res.status(201).json({
            message: "successfull",
            stime: Math.floor(Date.now() / (1000 * 60))
        })
        return;
    }

    //[get] /order
    order(req,res,next){
        console.log(Math.floor(Date.now() / (1000 * 60)))
        res.status(201).json({
            message: "successfull",
        })
        return;
    }
}

module.exports = new securityController()
