const {setNx,incrby,exist} = require('../../util/redis')
const Product = require('.././model/Product')

const checkProductWithRedis = async (key,slMua,slInventory,nameProduct)=>{
    try{
        let slBanra;
        const isCheck = await exist(key)
        if(!isCheck){
            await setNx(key,0)
        }
        slBanra = await incrby(key,slMua)
        if(slBanra > slInventory){
            return nameProduct;
        }
        return 1;
    }catch(err){
        return nameProduct;
    }
}

const getQuatity = (quatityProducts,id)=>{
    for (const dataId of quatityProducts) {
        if(dataId.id === id){
            return dataId.quatity
        }
    }
    return 0;
}

const checkManyProductInventory = async (req,res,next)=>{
    const timeNow = Math.floor(Date.now() / (1000 * 60))
    console.log(timeNow)
    try{
        const allPro = req.body.allPro
        if(!allPro){
            res.status(400).json({
                status: 400,
                message: "no content"
            })
            return;
        }
        const idPros = allPro.map((pro)=>{
            return pro._id
        })
        const quatityProducts = allPro.map((pro)=>{
            return {
                id: pro._id.toString(),
                quatity: pro.qtyCurrent
            }
        })
        const allProDb =  await Product.find({_id: {$in: idPros}})
        if(!allProDb.length){
            res.status(409).json({
                message: "bad request"
            })
            return;
        }
        let isChecks = [];
        for(const product of allProDb){
            const id = product._id.toString();
            const quatity = getQuatity(quatityProducts,id)
            const isCheck = await checkProductWithRedis(id,quatity,product.countInstock,product.nameProduct)
            isChecks.push(isCheck)
        }
        if(!isChecks.every((isCheck) => isCheck === 1)){
            const errorMessages = isChecks.map(isCheck => ({
                message: `${isCheck} ko du`
            }))
            res.status(409).json({
                message: errorMessages
            })
            return;
        }else{
            next()
        }
    }catch(error){
        next(error)
    }
} 

module.exports = checkManyProductInventory
