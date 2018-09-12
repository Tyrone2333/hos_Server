
/**
 *   TODO 这一块处理的很不好,把逻辑放在路由
 */

import Auth from "../middlewares/auth"

let router = require('express').Router();
let multer = require('multer')
let config = require("../config")

// 上传图片 begin
let savePath
let fileWithExtension
let owner
/**
 *  巨坑!必须把文件放在 FormData 最底下,否则在后台会先收到文件,
 *  这时用 multer.diskStorage 处理会获取不到req.body,因为req.body还没收到.
 *  github 相关 issue: https://github.com/expressjs/multer/issues/146
 */
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let type = req.body.type
        if (type === "article") {
            owner = req.body.author
            savePath = 'static/images'
        } else if (type === "avatar") {
            owner = req.body.username
            savePath = 'static/images/avatar'
        } else {
            owner = req.body.username
            savePath = 'static/images'
        }
        cb(null, savePath)
    },
    filename: function (req, file, cb) {
        let extension = file.originalname.match(/\.(\w+)$/)[1]
        let rename = getSha1(owner + file.originalname) + "." + extension;

        // 完整的文件名
        fileWithExtension = rename
        cb(null, rename)
    }
})
let upload = multer({
    storage: storage,
})
// 上传文件 end


// 上传文章的图片
router.post('/article_img', upload.any(), outputFileInfo, (req, res, next) => {
    res.send({
        errno: 0,
        message: "已保存文件",
        ...req.fileInfo
    })
})
//  上传头像
router.post('/avatar', Auth.checkUser, upload.any(), outputFileInfo, async (req, res, next) => {

    let avatarUrl = req.fileInfo.data[0]
    let {userId} = req.userInfo
    let sql = `  update hos_user set avatar=? where id=? ; `
    // 修改数据库
    const row = await query(sql, [avatarUrl, userId]).catch((err) => {
        console.log(err)
        return err.message
    })
    if (row.affectedRows > 0) {
        res.send({
            errno: 0,
            row,
            avatarUrl,
            message: "头像修改成功"
        })
    } else {
        res.send({
            errno: 1,
            row,
            message: "头像修改失败"
        })
    }
})


function outputFileInfo(req, res, next) {
    // req.file 是文件的信息
    // req.body 将具有文本域数据，如果存在的话
    let imgFile = req.files[0]
    console.log("接收文件并保存:", `${savePath}/` + fileWithExtension)
    req.fileInfo = {
        file: imgFile,
        owner: owner,
        body: req.body,
        data: [
            "//127.0.0.1:" + config.dev.port + `/${savePath}/` + fileWithExtension
        ],
    }
    next()
}


module.exports = router;
