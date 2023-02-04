const express = require('express')
const authenticationRouter = express.Router()

const authenticationController = require('../../app/controller/user/authenticationController')

authenticationRouter.get('/register',authenticationController.register)
authenticationRouter.get('/signIn',authenticationController.signIn)

module.exports = authenticationRouter
