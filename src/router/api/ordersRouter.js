const express = require('express')
const ordersRouter = express.Router()

const ordersController = require('../../app/controller/api/ordersController')
const verifyToken = require('../../app/middleWare/verifyRoles')
const allowRoles = require('../../config/const/allowRoles')

ordersRouter.get('/manageOrder',verifyToken(allowRoles.addmin),ordersController.home)
ordersRouter.get('/managePrice',verifyToken(allowRoles.addmin),ordersController.managePrice)
ordersRouter.post('/detailOrder',verifyToken(allowRoles.addmin),ordersController.detailOrder)
ordersRouter.patch('/statusOrder',verifyToken(allowRoles.addmin),ordersController.statusOrder)
ordersRouter.patch('/handleInventoty',verifyToken(allowRoles.addmin),ordersController.handleInventory)

module.exports = ordersRouter
