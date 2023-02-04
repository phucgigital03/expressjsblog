const express = require('express')
const securityRouter = express.Router()

const securityController = require('../../app/controller/api/securityController')
const securityRequest = require('../../app/middleWare/securityRequest')

securityRouter.get('/v1',securityRequest,securityController.v1)
securityRouter.get('/time',securityController.time)
securityRouter.get('/order',securityController.order)

module.exports = securityRouter
