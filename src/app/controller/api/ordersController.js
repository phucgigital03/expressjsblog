const mongoose = require('mongoose');

const Order = require('../../model/Order');
const ProductOrder = require('../../model/ProductOrder')
const Inventory = require('../../model/Inventory')
const mongooseObj = require('../../../util/mongoose')
const { decrby } = require('../../../util/redis')

class ordersController{
    static getSlugFromOrderPendding = async ()=>{
        try{
            const slugAtOrderPedding = await Order.aggregate([
                {
                    $match: {status: "pendding"}
                },
                {
                    $lookup:
                    {
                        from: "productorders",
                        localField: "products",
                        foreignField: "_id",
                        as: "getSlugs"
                    }
                },
                {
                    $project: {"getSlugs.slug": 1,"getSlugs.quatity": 1}
                }
            ])
            return slugAtOrderPedding
        }catch(err){
            return 0
        }
    }

    static updateInventory = async (slug,quatity)=>{
        try{
            const resData = await Inventory.findOneAndUpdate(
            {
                "reservations.slug": slug
            },
            {   
                $inc: {quatity: quatity},
                $pull: {reservations: {slug: slug}}
            })
            const id = resData.productId.toString()
            return 1;
        }catch(error){
            return 0;
        }
    }

    static deleteProductOrder = async (slug)=>{
        try{
            const isChecked = await ProductOrder.deleteOne({slug: slug})
            return isChecked;
        }catch(error){
            return 0;
        }
    }

    //[get]: /manageOrder
    home(req,res,next){
        const handleGetDataOrder = async()=>{
            try{
                const allOrder = await Order.find({});
                return res.status(201).json({
                    allOrder: allOrder
                })
            }catch(error){
                next(error)
            }
        }
        handleGetDataOrder()
    }

    //[get]: /managePrice
    managePrice(req,res,next){
        const handleGetDataOrder = async()=>{
            try{
                const orderPaidRes = await Order.find({status: "open"});
                const orderPaid = mongooseObj.mutipleObj(orderPaidRes);
                const totalPriceOfAllOrder = orderPaid.reduce((total,product)=>{
                    total += product.totalPrice
                    return total
                },0)
                return res.status(201).json({
                    orderPaid: orderPaid,
                    totalPriceOfAllOrder: totalPriceOfAllOrder
                });
            }catch(error){
                next(error)
            }
        }
        handleGetDataOrder()
    }

    //[patch]: /statusOrder
    statusOrder(req,res,next){
        const idOrder = req.body.idOrder
        const isChecked = req.body.isChecked
        if(!isChecked && isChecked !== false || !idOrder){
            next();
            return;
        }
        const handleGetDataOrder = async()=>{
            try{
                const orderFound = await Order.find({_id: idOrder})
                if(!orderFound || !orderFound.length){
                    next();
                    return;
                }
                if(isChecked){
                    await Order.updateOne({_id: orderFound[0]._id},{$set: {status: "open"}});
                }else{
                    await Order.updateOne({_id: orderFound[0]._id},{$set: {status: "pendding"}});
                }
                res.json({
                    status: 200,
                    message: "success"
                })
                return;
            }catch(error){
                next(error)
            }
        }
        handleGetDataOrder()
    }

    //[post]: /detailOrder
    detailOrder(req,res,next){
        const idOrder = req.body.idOrder;
        if(!idOrder){
            next();
            return;
        }
        const getOneOrder = async ()=>{
            try{
                const orderCustumer = await Order.aggregate([
                    {
                        $match: {_id: mongoose.Types.ObjectId(idOrder)}
                    },
                    {
                        $project: {_id: 0,userId: 0}
                    }
                ])
                if(!orderCustumer.length){
                    next()
                    return;
                }
                const productOrders = await ProductOrder.find({_id: {$in: orderCustumer[0].products}})
                if(!productOrders.length){
                    next()
                    return;
                }
                res.json({
                    infoCustomer: orderCustumer,
                    productOrders: productOrders
                })
                return;
            }catch(error){
                next(error)
            }
        }
        getOneOrder()
    }

    //[patch]: /handleInventory
    handleInventory(req,res,next){
        const handleResetInventory = async ()=>{
            try{
                const productInventory = await Inventory.aggregate([
                    {
                        $match: {"reservations.0": {$exists: true}}
                    },
                    {
                        $project: {_id: 1,reservations: 1}
                    }
                ])
                if(!productInventory.length){
                    res.status(409).json({
                        message: "no content"
                    })
                    return;
                }
                let wrapDataQueryProduct = [];
                productInventory.forEach((product)=>{
                    for(const objSlug of product.reservations){
                        wrapDataQueryProduct.push(objSlug)
                    }
                })
                let wrapDataProductOrder = [];
                let wrapDataSlugs = [];
                for(const objslugs of wrapDataQueryProduct){
                    const dataProductOrder = await ProductOrder.find({slug: objslugs.slug})
                    if(dataProductOrder.length){
                        wrapDataProductOrder.push(...dataProductOrder)
                    }else{
                        wrapDataSlugs.push(objslugs)
                    }
                }
                // check inventory when product in cart
                if(wrapDataSlugs.length){
                    for(const objSlugs of wrapDataSlugs){
                        const isChecked = await ordersController.updateInventory(objSlugs.slug,objSlugs.quatity)
                        if(!isChecked){
                            res.status(500).json({
                                message: "error server"
                            })
                            return;
                        }
                    }
                }

                // check inventory when productorder "pedding"
                if(wrapDataProductOrder.length){
                   const dataUpdateInventory =  await ordersController.getSlugFromOrderPendding()
                    if(!dataUpdateInventory){
                        res.status(500).json({
                            message: "error server!!!"
                        })
                        return;
                    }else if(!dataUpdateInventory.length){
                        res.status(409).json({
                            message: "no content"
                        })
                        return;
                    }

                    for(const wrapSlugs of dataUpdateInventory){
                        const manySlug = wrapSlugs.getSlugs.length;
                        const resDeleteOrder = await Order.deleteOne({_id: wrapSlugs._id})
                        if(!resDeleteOrder.deletedCount){
                            res.status(409).json({
                                message: "infomation invalid"
                            })
                            return;
                        }
                        for(let i = 0;i < manySlug;++i){
                            const isChecked = await ordersController.updateInventory(wrapSlugs.getSlugs[i].slug,wrapSlugs.getSlugs[i].quatity)
                            if(!isChecked){
                                res.status(500).json({
                                    message: "error server!!!"
                                })
                                return;
                            }
                            const isCheckedProductOrder = await ordersController.deleteProductOrder(wrapSlugs.getSlugs[i].slug)
                            if(!isCheckedProductOrder){
                                res.status(500).json({
                                    message: "error server!!!"
                                })
                                return;
                            }else if(!isCheckedProductOrder.deletedCount){
                                res.status(409).json({
                                    message: "infomation invalid"
                                })
                                return;
                            }
                        }
                    }
                }

                res.status(201).json({
                    message: 'successfull',
                    url: 'http://localhost:5500/client/orderUser'
                })
                return;
            }catch(error){
                next(error)
            }
        }
        handleResetInventory()
    }
}

module.exports = new ordersController()
