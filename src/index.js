const express = require('express')
const morgan = require('morgan')
const hbs = require('express-handlebars')
const path = require('path')
const app = express()

const router = require('./router/indexRouter')
const db = require('./config/data/db')

// http request
// app.use(morgan("combined"))

// static file
app.use(express.static(path.join(__dirname,'public')));

// assign body
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())

// template engine
app.engine(
  'hbs',
  hbs.engine({
    extname: '.hbs',
    partialsDir: path.join(__dirname,'resources/views/partials')
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

//router
router(app)

// connect db
db.connect()

app.listen(5500,()=>{
    console.log('create server success')
})