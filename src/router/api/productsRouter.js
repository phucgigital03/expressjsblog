const express = require('express')
const productsRouter = express.Router()

const productsController = require('../../app/controller/api/productsController')
const verifyRoles = require('../../app/middleWare/verifyRoles');
const allowRoles = require('../../config/const/allowRoles')
const upload = require('../../app/middleWare/uploadFile')

const cpUpload = upload.fields([{ name: 'mainProduct', maxCount: 1 }, { name: 'products', maxCount: 2 }])

productsRouter.get('/allProduct',productsController.home)

productsRouter.post('/createProducts',cpUpload,productsController.createProducts)

productsRouter.patch('/updateProducts',productsController.updateProducts)

productsRouter.delete('/delteProducts',productsController.delteProducts)

module.exports = productsRouter
