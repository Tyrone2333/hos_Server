import Auth from "../middlewares/auth"
import Message from "../websocket/chatRoom/messageControl"

let express = require('express');
let router = express.Router();

// 获取所有文章
router.get('/', Auth.checkUser, Message.getMessage)
router.get('/all', Auth.checkUser, Message.getMessageAll)

module.exports = router;
