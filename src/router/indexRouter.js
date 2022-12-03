const newsRouter = require('./newsRouter');
const siteRouter = require('./siteRouter');

function router(app) {
    app.use('/news',newsRouter)
    app.use('/',siteRouter)
}

module.exports = router;