const mongooseObj = require('../../../util/mongoose')
const Product = require('../../../app/model/Product')

class productsUserController{
    // [get]: /allItem
    home(req,res,next){
        const getAllProduct = async()=>{
            try{
                const groupProducts = await Product.aggregate([{
                    $group: {_id: "$nameProduct", getId: {$push: "$_id"}}},
                    {$project: {_id: 0,getId: {$arrayElemAt: ["$getId", 0]}}
                }])
                const idFoundPro = groupProducts.map((groupProduct,ind)=>{
                    return groupProduct.getId
                })
                const allProduct = await Product.find({_id: {$in: idFoundPro}})
                res.render("productsUser/allProductUser.hbs",{
                    allProduct: mongooseObj.mutipleObj(allProduct)
                })
            }catch(err){
                next(err)
            }
        }
        getAllProduct()
    }

    // [get]: /:slug
    show(req,res,next){
        const namePro = req.params.slug
        const hanldeGetDetailPro = async ()=>{
            try{
                const groupPro = await Product.aggregate([
                    {$match: {nameProduct: namePro}},
                    {$group: {
                        _id: "$nameProduct",
                        sizes: {$addToSet: "$size"},
                        colors: {$addToSet: "$color"},
                        getId: {$addToSet: "$_id"}
                    }},
                ])
                if(!groupPro.length){
                    next()
                    return
                }
                const proFound = await Product.find({_id: {$in: groupPro[0].getId}})
                res.cookie('products', JSON.stringify(mongooseObj.mutipleObj(proFound)));
                const proChoosed = proFound.find((pro,ind)=>{
                    return pro.nameProduct === namePro
                })
                const oneProduct = {...proChoosed.toObject(),...groupPro[0]}
                
                const sortColor = oneProduct.colors.filter((color,ind)=>{
                    return color !== oneProduct.color
                })
                sortColor.unshift(oneProduct.color)
                oneProduct.colors = sortColor;

                const sortSize = oneProduct.sizes.filter((size,ind)=>{
                    return size !== oneProduct.size
                })
                sortSize.unshift(oneProduct.size)
                oneProduct.sizes = sortSize;
                res.render("productsUser/detailProduct.hbs",{
                    oneProduct: oneProduct
                })
                return;
            }catch(error){
                next(error)
            }
        }
        hanldeGetDetailPro()
    }
    
}

module.exports = new productsUserController()
