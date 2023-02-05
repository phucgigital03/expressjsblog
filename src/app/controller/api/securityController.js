const {setNx,incrby,exist} = require('../../../util/redis')

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
    async order(req,res,next){
        const timeNow = Math.floor(Date.now() / (1000 * 60))
        console.log(timeNow)
        const nameSp = 'iphone13';
        const slInventory = 10;
        const slMua = 1;
        let slBanRa;
        const isCheck = await exist(nameSp)
        console.log(isCheck)
        if(!isCheck){
            await setNx(nameSp,0)
        }
        slBanRa = await incrby(nameSp,slMua);
        if(slBanRa > slInventory){
            console.log(`het hang so luong trong kho ${slInventory}`)
            console.log(`het hang so luong ban qua la ${slBanRa - slInventory}`)
            res.status(201).json({
                message: "successfull",
            })
            return;
        }

        // con hang 
        console.log(`so luong ban ra la ${slBanRa}`)

        res.status(201).json({
            message: "successfull",
        })
        return;
    }
}

module.exports = new securityController()
