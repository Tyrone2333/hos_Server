/**
 * 聊天室的
 * @param io
 */
import clientMap from "./clientMap"

const msgModel = require("./messageModel")
const redis = require("../../helper/redis")

//初始化连接人数
redis.set('online_count', 3, null, function (err, ret) {
    if (err) {
        console.error(err);
    }
});

redis.get("online_count", function (err, data) {
    if (err) throw err;
    if (data != null) {
        console.log("online_count",data)
    } else {
        next();
    }
});

function ioServer(io) {
    io.on('connection', (socket) => {
        console.log(socket.handshake.headers.origin + " ,id: " + socket.id + " 已连接")

        socket.join('room 2333', () => {

            // console.log(rooms); // [ <socket.id>, 'room 237' ]
            io.to('room 2333').emit('a new user has joined the room'); // broadcast to everyone in the room
        })
        // 群聊
        socket.on('message', function (data) {
            // socket.broadcast.emit('receiveGroupMsg', data);
            let resData
            if (data.message_type === "text") {
                resData = {
                    action: "message",

                    from_uid: data.from_uid,
                    to_uid: data.to_uid,

                    nickname: data.nickname,
                    username: data.username,
                    avatar: data.avatar,
                    message: data.message,
                    message_type: data.message_type,

                    timeStamp: Math.round(new Date().getTime() / 1000),
                }
                // connection.sendUTF(JSON.stringify(resData))
            }

            // 私聊的消息
            if (data.to_uid !== undefined && data.to_uid.length >= 16) {
                // 获取私聊双方的 socketId,然后把消息推给双方
                let toSocketId = clientMap.getClientByUid(data.to_uid)
                let fromSocketId = clientMap.getClientByUid(data.from_uid)

                io.to(toSocketId).emit('message', resData);
                io.to(fromSocketId).emit('message', resData);
            } else {
                // 这里可以是群聊,也可以把没有对象的消息丢弃
                io.sockets.emit("message", resData)
            }

            msgModel.add(resData, function (err) {
                if (err) {
                    console.error(err);
                }
            });
        })

        // 上线
        socket.on('online', data => {
            let notice = {
                nickname: data.nickname,
                timeStamp: Math.round(new Date().getTime()),
                type: "online",
                userNum: 0,
                uid: data.uid,
            }

            clientMap.addClient(data.uid, socket.id)
            // 获取房间的在线人数
            io.in('room 2333').clients((error, clients) => {
                if (error) throw error;
                notice.userNum = clients.length

                // 触发上线提醒
                // socket.broadcast.emit('notice', notice) // 对除自己外所有人广播
                io.emit('notice', notice)   // 对所有人广播
            })
            // io.clinets 是异步获取客户端的!!
            // console.log("获取人数的外面先 log 出来!!")
        })
        socket.on('offline', data => {
            let notice = {
                nickname: data.nickname,
                timeStamp: Math.round(new Date().getTime()),
                type: "offline"
            }
            // 先,断开客户端连接
            socket.disconnect(0)
            console.log(socket.handshake.headers.origin + " ,id: " + socket.id + " 正常下线")

            // 后,获取房间的在线人数
            io.in('room 2333').clients((error, clients) => {
                if (error) throw error;
                notice.userNum = clients.length

                // 触发下线提醒
                socket.broadcast.emit('notice', notice)
            })
        })

        //重连事件
        socket.on('reconnect', function () {
            console.log(socket.id + " 重新连接到 ws 服务器");
        })
        // 断开连接
        socket.on("disconnect", (rea) => {
            console.log(socket.id + " 断开连接,原因: " + rea)
        })
    })

}

// socket.io 模块导出
exports.ioServer = ioServer;