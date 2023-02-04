const express = require('express')
const userRouter = express.Router()

const userController = require('../../app/controller/api/userController')
const verifyRoles = require('../../app/middleWare/verifyRoles');
const verifyToken = require('../../app/middleWare/verifyJwt')
const allowRoles = require('../../config/const/allowRoles')

userRouter.post('/register',userController.createUser)
userRouter.post('/signIn',userController.signIn)
userRouter.post('/signOut',userController.signOut)
userRouter.get('/formOtp',userController.formOtp)
userRouter.post('/verifyOtp',userController.verifyOtp)
userRouter.get('/refreshToken',userController.refreshToken)
userRouter.patch('/update',verifyToken,verifyRoles(allowRoles.addmin),userController.updateUser)
userRouter.delete('/delete',verifyToken,verifyRoles(allowRoles.addmin),userController.deleteUser)
userRouter.get('/allUser',verifyToken,verifyRoles(allowRoles.addmin),userController.home)

module.exports = userRouter
