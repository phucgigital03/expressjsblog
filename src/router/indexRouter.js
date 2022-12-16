const siteRouter = require('./siteRouter');
const userRouter = require('./api/userRouter');
const productsRouter = require('./api/productsRouter');

const verifyToken = require('../app/middleWare/verifyJwt');


function router(app) {
    app.use('/productsApi',productsRouter)
    app.use('/userApi',userRouter)
    app.use('/',siteRouter)
}

module.exports = router;