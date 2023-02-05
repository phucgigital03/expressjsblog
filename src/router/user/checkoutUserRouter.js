const express = require('express')
const checkoutUserRouter = express.Router()

const checkoutUserController = require('../../app/controller/user/checkoutUserController')
const checkManyProductInventory = require('../../app/middleWare/checkManyProductInventory')

checkoutUserRouter.get('/thankyou',checkoutUserController.thankYou)
checkoutUserRouter.get('/success',checkoutUserController.successPayment)
checkoutUserRouter.post('/card',checkoutUserController.card)
checkoutUserRouter.post('/cod',checkoutUserController.cod)
checkoutUserRouter.post('/',checkManyProductInventory,checkoutUserController.checkout)
checkoutUserRouter.get('/',checkoutUserController.home)

module.exports = checkoutUserRouter
