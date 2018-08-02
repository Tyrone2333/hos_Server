var express = require('express');
var router = express.Router();

import Auth from "../middlewares/auth"

import User from "../controller/user"

// 测试用
// router.post('/test/:id', Auth.checkUser, Auth.test)

// 登录注册
router.post('/register', User.register)
router.post('/login', User.login)
router.post('/token_login', User.tokenLogin)

// 获取用户信息
router.get('/:id', User.getUserInfo)


module.exports = router;
