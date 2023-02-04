const express = require('express')
const productsUserRouter = express.Router()

const productsUserController = require('../../app/controller/user/productsUserController')

productsUserRouter.get('/allItem',productsUserController.home)
productsUserRouter.get('/:slug',productsUserController.show)

module.exports = productsUserRouter
