const express = require('express')
const morgan = require('morgan')
const hbs = require('express-handlebars')
const path = require('path')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const app = express()

const router = require('./router/indexRouter')
const db = require('./config/data/db')
const sortMiddleWare = require('./app/middleWare/sortMiddleWare')
const cors = require('cors')
const corsOptions = require('./config/const/corsOption')
const credentials = require('./app/middleWare/credentials')

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
    helpers: {
        isCondition(value){
          return value
        },
        showStt(ind){
          return ind + 1;
        },
        sortTable(filed,sort){
          const icons = {
            default: 'funnel-outline',
            des: 'arrow-down-outline',
            asc: 'arrow-up-outline'
          }
          const types = {
            default: 'des',
            des: 'asc',
            asc: 'default'
          }
          const sortType = filed === sort.column ? sort.type : 'default'
          const icon = icons[sortType]
          const type = types[sortType]
          return `
              <a href="?_sort&column=${filed}&type=${type}" class="sort-name">
                <span>
                    <ion-icon name="${icon}"></ion-icon>
                </span>
              </a>
          `
        }
    }
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));


// use MiddleWare
app.use(sortMiddleWare)

//router
router(app)

app.listen(5500,()=>{
    console.log('created server success')
})
