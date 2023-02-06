const express = require('express')
const morgan = require('morgan')
const hbs = require('express-handlebars')
const path = require('path')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv');
dotenv.config()
const app = express()

const router = require('./router/indexRouter')
const db = require('./config/data/db')
const cors = require('cors')
const corsOptions = require('./config/const/corsOption')
const credentials = require('./app/middleWare/credentials')
const verifyHtmlMiddleWare = require('./app/middleWare/verifyHtmlMiddleWare')
const configURL = require('./app/middleWare/configURL')
//const redisGetIp = require('./app/middleWare/redisGetIp')
const helpers = require('./helper')
const { set,setnx,get,dele,allKey } = require('./util/redis')

// http request
// app.use(morgan("combined"))

// credentials
app.use(credentials)

// cross origin resource sharing
app.use(cors(corsOptions))

// connect db
db.connect()

// override method
app.use(methodOverride('_method'))

// static file
app.use(express.static(path.join(__dirname,'public')));

// assign body
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())
app.use(cookieParser())

// template engine
app.engine(
  'hbs',
  hbs.engine({
    extname: '.hbs',
    partialsDir: path.join(__dirname,'resources/views/partials'),
    helpers: helpers
  })
);
app.set('view engine','hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

//verifyHtml
app.use(verifyHtmlMiddleWare)

// redisGetIp
//app.use(redisGetIp)

// configURL
app.use(configURL)

//router
router(app)

const PORT = process.env.PORT || 5500

app.listen(PORT,()=>{
    console.log(`created server success ${PORT}`)
});