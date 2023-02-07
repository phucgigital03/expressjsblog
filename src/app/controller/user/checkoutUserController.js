const stripe = require('stripe')(process.env.KEY_API_PAYMENT_SECRET)
const mongoose = require('mongoose')
const {v4: uuidv4} = require('uuid')

const mongooseObj = require('../../../util/mongoose')
const Product = require('../../../app/model/Product')
const Inventory = require('../../../app/model/Inventory')
const Order = require('../../model/Order')
const ProductOrder = require('../../model/ProductOrder')


class checkoutUserController{
    static handleDataOrder = function (productDBs,orderProduct){
        const productIdDBChecked = productDBs.map((product)=>{
            return product._id.toString()
        })
        const totalQty = orderProduct.reduce((total,currentIdPro)=>{
            if(productIdDBChecked.includes(currentIdPro._id)){
                total+=currentIdPro.qtyCurrent
            }else{
                total+=0;
            }
            return total
        },0)
        const totalPrice = orderProduct.reduce((total,currentIdPro)=>{
            if(productIdDBChecked.includes(currentIdPro._id)){
                total+=(currentIdPro.qtyCurrent * currentIdPro.pricePro.price)
            }else{
                total+=0;
            }
            return total
        },0)
        const filterProductOrder = orderProduct.map((product)=>{
            if(productIdDBChecked.includes(product._id)){
                return {
                    name: product.nameProduct,
                    pricePro: product.pricePro,
                    image: product.mainProductImage,
                    size: product.size,
                    color: product.color,
                    groupId: product.groupId,
                    gender: product.gender,
                    quatity: product.qtyCurrent,
                    slug: product.slug
                }
            }
            return;
        }).filter((product) => product)
        return {
            totalQty,
            totalPrice,
            productIdDBChecked,
            filterProductOrder
        }
    }

    static handleDataOrderCard = function(orderProduct){
        const totalQty = orderProduct.reduce((total,product) => {
            total+=product.qtyCurrent
            return total
        },0)
        const totalPrice = orderProduct.reduce((total,product) => {
            total+=(product.qtyCurrent * product.pricePro.price)
            return total
        },0)
        const filterProductOrder = orderProduct.map((product)=>{
            return {
                name: product.nameProduct,
                pricePro: product.pricePro,
                image: product.mainProductImage,
                size: product.size,
                color: product.color,
                groupId: product.groupId,
                gender: product.gender,
                quatity: product.qtyCurrent,
                slug: product.slug,
            }
        })
        return {
            totalQty,
            totalPrice,
            filterProductOrder
        }
    }

    static checkInventory = async function (productId,quatity,nameProduct,slug){
        try{
            const result = await Inventory.updateOne({
                productId: mongoose.Types.ObjectId(productId.toString()), 
                quatity: {$gte: quatity}
            },{
                $inc: {quatity: -quatity},
                $push: {
                    reservations: {
                        quatity: quatity,
                        userId: null,
                        slug: slug,
                    }
                }
            })
            if(!result.modifiedCount){
                const inventory = await Inventory.findOne({productId: mongoose.Types.ObjectId(productId.toString())})
                return {
                    message: `${nameProduct} sold out, trong kho con lai ${inventory.quatity}`,
                    code: 0
                }
            }
            return {
                code: 1,
                slug: slug
            };
        }catch(error){
            return {
                code: 0,
                message: `${error}`
            }
        }
    }

    // [post] /checkout
    checkout(req,res,next){
        const allPro = req.body.allPro
        const idPros = req.idPros
        // check mutiple request when have one product (chua lam)
        const getPros = async ()=>{
            try{
                let slug;
                const allProDb =  await Product.find({_id: {$in: idPros}})
                const addQtyInObj = mongooseObj.mutipleObj(allProDb).map((pro)=>{
                    if(idPros.includes(pro._id.toString())){
                        slug = uuidv4()
                        const foundProClient = allPro.find((productClient)=>{
                            return pro._id.toString() === productClient._id
                        })
                        pro.qtyCurrent = foundProClient.qtyCurrent
                        pro.slug = slug
                    }
                    return pro
                })
                const errorMessages = [];
                for(const product of addQtyInObj){
                    let isChecked = await checkoutUserController.checkInventory(product._id,product.qtyCurrent,product.nameProduct,product.slug)
                    errorMessages.push(isChecked)
                }
                if(!errorMessages.every((error)=>{
                    return error.code;
                })){
                    res.status(409).json({
                        message: errorMessages
                    })
                    return;
                }
                res.cookie('productsChecked',JSON.stringify(addQtyInObj))
                res.status(201).json({
                    urlSwitch: `${process.env.LOCALHOST}/checkout`,
                })
                return;
            }catch(error){
                next(error)
            }
        }
        getPros()
    }

    //[get]: /
    home(req,res,next){
        const prochecked = req.cookies.productsChecked
        if(!prochecked){
            res.redirect(`${process.env.LOCALHOST}/products/allItem`)
            return;
        }
        const productsChecked = JSON.parse(prochecked)
        if(!productsChecked.length){
            res.redirect(`${process.env.LOCALHOST}/products/allItem`)
            return;
        }
        res.status(201).render('checkOut/payment.hbs',{
            productsChecked: productsChecked
        })
        return;
    }

    //[post]: /cod
    cod(req,res,next){
        const {orderProduct,billingAddress} = req.body
        if(!orderProduct || !billingAddress){
            next()
            return;
        }
        const productIds = orderProduct.map(product => {
            return product._id
        })
        const handleCheckSaveOrder = async ()=>{
            try{
                const productDBs = await Product.find({_id: {$in: productIds}})
                if(!productDBs.length){
                    next()
                    return;
                }
                const {totalPrice,totalQty,filterProductOrder} = checkoutUserController.handleDataOrder(productDBs,orderProduct)
                const saveProductOrder = await ProductOrder.insertMany(filterProductOrder)
                const products = saveProductOrder.map(product => product._id.toString())
                const order = new Order({
                    ...billingAddress,
                    phone: Number(billingAddress.phone),
                    totalQty,
                    totalPrice,
                    status: 'pendding',
                    products,
                })
                const orderSaved = await order.save()
                const dataOrder = {
                    ...mongooseObj.oneObj(orderSaved),
                    _id: null,
                    products: mongooseObj.mutipleObj(saveProductOrder)
                }
                res.cookie('dataOrder',JSON.stringify(dataOrder))
                res.json({
                    url: `${process.env.LOCALHOST}/checkout/thankyou`,
                })
                return;
            }catch(error){
                next(error)
            }
        }
        handleCheckSaveOrder()
    }

    //[get]: /thankyou
    thankYou(req,res,next){
        const dataOrder = req.cookies.dataOrder
        if(!dataOrder){
            res.render('checkOut/thankyouNoData.hbs')
            return;
        }
        const handleRenderPage = async ()=>{
            try{
                res.render('checkOut/thankyou.hbs',{
                    dataOrder: dataOrder,
                })
                return;
            }catch(error){
                next(error)
            }
        }
        handleRenderPage()
    }

    //[post]: /card
    card(req,res,next){
        const {orderProduct,billingAddress} = req.body
        const idProducts = orderProduct.map((product)=>{
            return mongoose.Types.ObjectId(product._id)
        })
        const handlePaymentCard = async()=>{
            try{
                const productsCondition = []
                const productIdBuyed = await Product.aggregate([
                    {
                        $match: {_id: {$in: idProducts}}
                    },
                    {
                        $project: {_id: 1}
                    }
                ])
                const arrayIdBuyed = productIdBuyed.map((productId)=> productId._id.toString())
                const lineItem = orderProduct.map((product)=>{
                    if(arrayIdBuyed.includes(product._id)){
                        productsCondition.push(product)
                        return {
                            quantity: product.qtyCurrent,
                            price_data: {
                                currency: 'vnd',
                                product_data: {
                                    name: product.nameProduct,
                                },
                                unit_amount: product.pricePro.price
                            }
                        }
                    }
                    return;
                }).filter(product => product)
        
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    line_items: lineItem,
                    mode: "payment",
                    success_url: `${process.env.LOCALHOST}/checkout/success`,
                    cancel_url: `${process.env.LOCALHOST}/checkout`,
                })
                const {totalPrice,totalQty,filterProductOrder} = checkoutUserController.handleDataOrderCard(productsCondition)
                const saveProductOrder = await ProductOrder.insertMany(filterProductOrder)
                const products = saveProductOrder.map(product => product._id.toString())
                const order = new Order({
                    ...billingAddress,
                    phone: Number(billingAddress.phone),
                    totalQty,
                    totalPrice,
                    status: session.status,
                    products,
                })
                const orderSaved = await order.save()
                const dataOrder = {
                    ...mongooseObj.oneObj(orderSaved),
                    _id: null,
                    products: mongooseObj.mutipleObj(saveProductOrder)
                }
                res.cookie('dataOrder',dataOrder)
                res.json({
                    status: 200,
                    urlPayment: session.url,
                })
                return
            }catch(error){
                next(error)
            }
        }
        handlePaymentCard()
    }

    //[get]: /success
    successPayment(req,res,next){
        const dataOrder = req.cookies.dataOrder
        if(!dataOrder){
            next()
            return;
        }
        const hanldeSaveCustomer = async ()=>{
            try{
                res.render('checkOut/thankyou.hbs',{
                    dataOrder: dataOrder,
                })
                return;
            }catch(error){
                next(error)
            }
        }
        hanldeSaveCustomer()
    }
}

module.exports = new checkoutUserController()
