const express = require('express')
const itemsRouter = express.Router()

const itemsController = require('../../app/controller/api/itemsController')
const verifyRoles = require('../../app/middleWare/verifyRoles');
const allowRoles = require('../../config/const/allowRoles')

itemsRouter.get('/allItem',
verifyRoles(allowRoles.user,allowRoles.addmin,allowRoles.editer),
itemsController.home)

itemsRouter.post('/createItems',
verifyRoles(allowRoles.addmin,allowRoles.editer),
itemsController.createItems)

itemsRouter.patch('/updateItems',
verifyRoles(allowRoles.addmin,allowRoles.editer),
itemsController.updateItems)

itemsRouter.delete('/delteItems',
verifyRoles(allowRoles.addmin,allowRoles.editer),
itemsController.delteItems)

module.exports = itemsRouter
