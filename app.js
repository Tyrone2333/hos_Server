var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')


import router from "./routes/index"

// 设置为全局数据库连接句柄
import query from './common/db'

global.query = query
// 全局公共函数
import * as func from "./common/func"

for (let i in func) {
    global[i] = func[i]
}

var app = express()
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*')
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With,token")
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    res.header("Access-Control-Allow-Credentials", true) //可以带cookies
    if (req.method === 'OPTIONS') {
        res.send(200)
    } else {
        next()
    }
})
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

// 静态文件
app.use("/static", express.static(path.join(__dirname, 'public')))


router(app)
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404))
// })
app.use(function (req, res, next) {
    // res.state(404)
    res.status(404)
    res.send({
        errno: 4,
        message: '404 没有找到页面',
    })
})


// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)

    console.warn(err)
    // respond with json
    if (req.accepts('json')) {
        res.send({
            errno: 5,
            message: '500 服务器出错',
            errdetial:err.message
        })
    } else {
        // respond with html page
        res.render('error')
    }
})


module.exports = app
