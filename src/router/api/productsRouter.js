const express = require('express')
const productsRouter = express.Router()

const productsController = require('../../app/controller/api/productsController')
const verifyRoles = require('../../app/middleWare/verifyRoles');
const allowRoles = require('../../config/const/allowRoles')
const upload = require('../../app/middleWare/uploadFile')

const cpUpload = upload.fields([{ name: 'mainProductImage', maxCount: 1 }, { name: 'productsImage', maxCount: 2 }])

productsRouter.get('/allProduct',verifyRoles(allowRoles.addmin),productsController.home)
productsRouter.get('/formCreatePro',verifyRoles(allowRoles.addmin),productsController.formCreatePro)
productsRouter.post('/createPro',verifyRoles(allowRoles.addmin),cpUpload,productsController.createPro)
productsRouter.patch('/updateProducts',verifyRoles(allowRoles.addmin),productsController.updateProducts)
productsRouter.delete('/delteProducts',verifyRoles(allowRoles.addmin),productsController.delteProducts)

module.exports = productsRouter
