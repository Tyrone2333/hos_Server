
var express = require('express');
var router = express.Router();

import Auth from "../middlewares/auth"

import Article from "../controller/article"

// 获取所有文章
router.get('/', Article.getArticleList)
router.get('/:id', Article.getArticleById)

module.exports = router;
