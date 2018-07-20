
import Auth from "../middlewares/auth"

import Article from "../controller/article"

let express = require('express');
let router = express.Router();
let multer = require('multer')

// 获取所有文章
router.get('/', Article.getArticleList)
router.get('/:id', Article.getArticleById)

// 上传文件 begin
let fileWithExtension
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {

        let extension = file.originalname.match(/\.(\w+)$/)[1]
        let author = req.body.author
        let rename = getSha1(author + file.originalname) + "." + extension;

        fileWithExtension = rename
        cb(null, rename)
    }
})
let upload = multer({storage: storage})
let config = require("../config")
router.post('/upload_img',Auth.checkUser,upload.any(),function (req, res, next) {
    // req.file 是文件的信息
    // req.body 将具有文本域数据，如果存在的话

    let imgFile = req.files[0]

    res.send({
        errno: 0,
        file: imgFile,
        author: req.body.author,
        data: [
            "//127.0.0.1:"+ config.dev.port+ "/static/images/" + fileWithExtension
        ],
        message:"已保存文件"
    })
})
// 上传文件 end

module.exports = router;
