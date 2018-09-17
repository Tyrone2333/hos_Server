#!/usr/bin/env node

// import  wsServer from "../websocket/chatRoom"

/**
 * Module dependencies.
 */
require('babel-core/register')
require("babel-core").transform("code", {
    plugins: ["transform-runtime"]
})

var config = require('../config')

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}
var port = process.env.PORT || config.dev.port


var app = require('../app')
var debug = require('debug')('server:server')
var http = require('http')


/**
 * Get port from environment and store in Express.
 */

// var port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

/**
 * Create HTTP server.
 */

var server = http.createServer(app)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10)

    if (isNaN(port)) {
        // named pipe
        return val
    }

    if (port >= 0) {
        // port number
        return port
    }

    return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address()
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port
    debug('Listening on ' + bind)
}


// socken.io
// TODO 暂时这样写,还不能抽到单独文件夹
const io = require('socket.io')(server);


io.on('connection', (socket) => {

    socket.join('room 2333', () => {
        let rooms = Object.keys(socket.rooms);
        // console.log(rooms); // [ <socket.id>, 'room 237' ]
        io.to('room 2333').emit('a new user has joined the room'); // broadcast to everyone in the room
    })
    // 群聊
    socket.on('sendGroupMsg', function (data) {
        // socket.broadcast.emit('receiveGroupMsg', data);
        let resData
        if (data.action === "register") {
            // ws 注册
            resData = {
                errno: 0,
                message: "register success",
                type: "registed",
                timeStamp: Math.round(new Date().getTime() / 1000),
            }
        } else if (data.action === "send") {
            resData = {
                nickname: data.nickname,
                username: data.username,
                avatar: data.avatar,
                timeStamp: Math.round(new Date().getTime()),
                message: data.message,
                type: "message"
            }
            // connection.sendUTF(JSON.stringify(resData))
        }

        io.sockets.emit("receiveMsg", resData)
    })
    // 上线
    socket.on('online', data => {
        let notice = {
            nickname: data.nickname,
            timeStamp: Math.round(new Date().getTime()),
            type: "online"
        }
        // 触发上线提醒
        socket.broadcast.emit('notice', notice)
    })
    socket.on('offline', data => {
        let notice = {
            nickname: data.nickname,
            timeStamp: Math.round(new Date().getTime()),
            type: "offline"
        }
        // 触发下线提醒
        socket.broadcast.emit('notice', notice)
        // 断开客户端连接
        socket.disconnect(0)
    })

    socket.on("disconnect ", (reason) => {
        console.log("有人断开连接,原因: " + reason)
    })
})


/**
 * Listen on provided port, on all network interfaces.
 */
let url = 'http://' + getIPAddress() + ':' + port

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

log("现在正在 " + process.env.NODE_ENV + " 模式")
log('> Listening at ' + url + '\n')