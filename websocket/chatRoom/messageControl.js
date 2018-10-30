/**
 * 可参考 https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312 的api设计
 */
const msgModel = require('./messageModel');

export default new class Message {
    constructor() {
    }


    getMessage(req, res, next) {

        var page = req.query.page || 1;
        var uid = req.query.uid;

        if (!uid) {
            return res.send({errno: 500, message: "参数不全"});
        }

        msgModel.query( uid,page, function (err, data) {
            if (err) {
                console.error(err);
                return res.send({errno: 400, message: "系统错误"});
            }
            return res.send({errno: 0, message: "获取成功", data: data});
        })


    }

    getMessageAll(req, res, next) {

        var page = req.query.page || 1;


        msgModel.queryAll( page, function (err, data) {
            if (err) {
                console.error(err);
                return res.send({errno: 400, message: "系统错误"});
            }
            return res.send({errno: 0, message: "获取成功", data: data});
        })

    }

}


// module.exports = new User(user_info)

