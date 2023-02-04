const express = require('express')
const clientRouter = express.Router()

const ClientController = require('../../app/controller/api/clientController')

clientRouter.get('/formCreatePro',ClientController.formCreatePro)
clientRouter.get('/orderUser',ClientController.orderUser)
clientRouter.get('/managePrice',ClientController.managePrice)
clientRouter.get('/watchUser',ClientController.watchUser)

module.exports = clientRouter
