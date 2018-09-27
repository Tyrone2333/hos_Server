let mongoose = require('../../helper/mongoose').mongoose;

let Schema = mongoose.Schema;

let MessageSchema = new Schema({

    action: {type: String, default: "message"},
    from_uid: {type: String, index: true},
    to_uid: {type: String, index: true}, // 私聊的对象 || "" 空是群聊

    message: {type: String},
    message_type: {type: String, default: 'text'},
    // 发送者相关的信息
    nickname: String,
    username: {type: String},
    avatar: {type: String},

    timeStamp: {type: Number, default: Math.round(new Date().getTime() / 1000)}
})

let MessageModel = mongoose.model("message", MessageSchema);

function add(data, callback) {
    // 目前有下列 key: action,from_uid,to_uid,nickname,username,avatar,message,message_type,timeStamp

    let info = {...data}
    // 不是 Schema 定义的垃圾值并不会存进去
    // let {action, from_uid, to_uid, nickname, username, avatar, message, message_type, timeStamp} = data
    // let info = {action, from_uid, to_uid, nickname, username, avatar, message, message_type, timeStamp}


    let msgModel = new MessageModel(info);
    msgModel.save(function (err, res) {
        return callback(err, res);
    })
}

function query(uid, page, callback) {
    let size = 10
    var query = MessageModel.find({});
    var condition = [];
    if (uid) {
        condition.push({"from_uid": uid});
        // condition.push({"to_uid":uid});
    }

    var skip = (page - 1) * size;

    // 按时间倒序查询对应用户的记录
    query.or(condition).skip(skip).limit(size).sort({"timeStamp": -1}).exec(callback);
}
function queryAll( page, callback) {
    let size = 10
    var query = MessageModel.find({});
    var condition = [];

    var skip = (page - 1) * size;

    // 按时间倒序查询对应用户的记录
    query.skip(skip).limit(size).sort({"timeStamp": -1}).exec(callback);
}



exports.add = add;
exports.query = query;
exports.queryAll = queryAll;