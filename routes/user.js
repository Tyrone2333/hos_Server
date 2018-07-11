
var express = require('express');
var router = express.Router();

import Auth from "../middlewares/auth"

import User from "../controller/user"

// 测试用
router.post('/test/:id',Auth.checkUser)

// 登录注册
router.post('/register', User.register)
router.post('/login', User.login)

// 获取用户信息
router.get('/:id', User.getUserInfo)


module.exports = router;
