
var express = require('express');
var router = express.Router();

import Auth from "../middlewares/auth"

import Article from "../controller/article"

// 获取用户信息
router.get('/:id', Article.getArticle)


module.exports = router;
