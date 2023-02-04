const siteRouter = require('./siteRouter');
const userRouter = require('./api/userRouter');
const productsRouter = require('./api/productsRouter');
const clientRouter = require('./api/clientRouter');
const ordersRouter = require('./api/ordersRouter');
const productsUserRouter = require('./user/productsUserRouter');
const checkoutUserRouter = require('./user/checkoutUserRouter');
const authenticationRouter = require('./user/authenticationRouter');
const securityRouter = require('./api/securityRouter');

const verifyToken = require('../app/middleWare/verifyJwt');
const {notFound,errorHandler} = require('../app/middleWare/errorHandle')


function router(app) {
    app.use('/authen',authenticationRouter)
    app.use('/checkout',checkoutUserRouter)
    app.use('/products',productsUserRouter)
    app.use('/client',clientRouter)
    app.use('/apiPro',verifyToken,productsRouter)
    app.use('/apiOrder',verifyToken,ordersRouter)
    app.use('/apiUser',userRouter)
    app.use('/apiSecurity',securityRouter)
    app.use('/',siteRouter)
    app.use('*',notFound)
    app.use(errorHandler)
}

module.exports = router;