const express = require('express')
const userRouter = express.Router()

const userController = require('../../app/controller/api/userController')
const verifyRoles = require('../../app/middleWare/verifyRoles');

userRouter.post('/register',userController.createUser)
userRouter.post('/signIn',userController.signIn)
userRouter.post('/signOut',userController.signOut)
userRouter.get('/refreshToken',userController.refreshToken)
userRouter.patch('/update',userController.updateUser)
userRouter.delete('/delete',verifyRoles(2003),userController.deleteUser)
userRouter.get('/',userController.home)

module.exports = userRouter
