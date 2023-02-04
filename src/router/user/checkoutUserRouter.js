const express = require('express')
const checkoutUserRouter = express.Router()

const checkoutUserController = require('../../app/controller/user/checkoutUserController')

checkoutUserRouter.get('/thankyou',checkoutUserController.thankYou)
checkoutUserRouter.get('/success',checkoutUserController.successPayment)
checkoutUserRouter.post('/card',checkoutUserController.card)
checkoutUserRouter.post('/cod',checkoutUserController.cod)
checkoutUserRouter.post('/',checkoutUserController.show)
checkoutUserRouter.get('/',checkoutUserController.home)

module.exports = checkoutUserRouter
