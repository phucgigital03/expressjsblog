const courseRouter = require('./courseRouter');
const siteRouter = require('./siteRouter');
const meRouter = require('./meRouter');
const userRouter = require('./api/userRouter');
const itemsRouter = require('./api/itemsRouter');

const verifyToken = require('../app/middleWare/verifyJwt');


function router(app) {
    app.use('/itemsApi',verifyToken,itemsRouter)
    app.use('/userApi',userRouter)
    app.use('/me',meRouter)
    app.use('/courses',courseRouter)
    app.use('/',siteRouter)
}

module.exports = router;