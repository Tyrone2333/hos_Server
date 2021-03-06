import Auth from "../middlewares/auth"
import Article from "../controller/article"

let express = require('express')
let router = express.Router()
let multer = require('multer')
let config = require("../config")

// 获取所有文章
router.get('/', Article.getArticleList)
router.get('/:id', Article.getArticleById)
// 发布文章
router.post('/public', Auth.checkUser, Article.publicArticle)
router.post('/reply', Auth.checkUser, Article.reply)
// 不用 get,会和 getArticleById 冲突
router.post('/setZan', Auth.checkUser, Article.setZan)


module.exports = router
