const axios = require("axios")
const sha1 = require('../helper/sha1')
const aesDecrypt = require('../helper/aesDecrypt')
const WXBizDataCrypt = require('../helper/WXBizDataCrypt')
const path = require('path')
const fs = require('fs')

let express = require('express');
let router = express.Router();
let rf = require("fs");
let multer = require('multer')

let config = require("../config")

let fileWithExtension
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/images')
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

router.get('/', async (req, res, next) => {
    let data = await read().then((data) => {
        log("先then一下")
        return data
    })

    res.status(200)
    res.send({
        status: 200,
        // watch:"in watch???",
        data
    })
    log("hos_api test ")
});

router.post('/', async (req, res, next) => {
    let data = await read()
    log(data)
    res.send({
        status: 200,
        data
    })
    log(3)
});

import utils from "../helper/utils"
router.get('/checkDirExist', async (req, res, next) => {
    utils.checkDirExist("/static/avatar")
    res.send({
        status: 200,

    })
})


router.post('/upload', upload.any(), function (req, res, next) {
    // req.file 是文件的信息
    // req.body 将具有文本域数据，如果存在的话

    let imgFile = req.files[0]

    res.send({
        errno: 0,
        file: imgFile,
        author: req.body.author,
        data: [
            "//127.0.0.1:" + config.dev.port + "/static/images/" + fileWithExtension
        ],
        message: "已保存文件"
    })
})

async function read() {
    return new Promise((resolve, reject) => {
        rf.readFile(__dirname + "/test.txt", 'utf-8', (err, data) => {
            if (err) {
                reject(err)
            } else {
                // log(data)
                resolve(data)
            }
        });
    }).catch(err => {
        log(err)
    })
}

router.get('/login', async (req, res, next) => {

    const {
        'x-wx-code': code,
        'x-wx-encrypted-data': encryptedData,
        'x-wx-iv': iv
    } = req.headers
    if ([code, encryptedData, iv].every(v => !v)) {
        console.error("ERR_HEADER_MISSED")
    }

    const appid = "wxa57690ac52c01299"
    const appsecret = "4717b9a702b8643a76b524fdd0761cf9"

    let sessionResult = await axios({
        url: 'https://api.weixin.qq.com/sns/jscode2session',
        method: 'GET',
        params: {
            appid: appid,
            secret: appsecret,
            js_code: code,
            grant_type: 'authorization_code'
        }
    }).then(res => {
        res = res.data
        if (res.errcode || !res.openid || !res.session_key) {
            console.error("ERR_GET_SESSION_KEY")
        } else {
            // debug('openid: %s, session_key: %s', res.openid, res.session_key)    你debug个毛线啊,都出结果了还把控制台搞一坨东西
            return res
        }
    })

    const {session_key, openid} = sessionResult

    // 微信官方给的demo, Buffer() 报错
    // var pc = new WXBizDataCrypt(appid, session_key)
    // var data = pc.decryptData(encryptedData , iv)
    //  微信 END

    // 解密数据,wafer-node-sdk 提供的方法,如果解密失败,重新授权即可
    // 生成 3rd_session
    const skey = sha1(session_key)
    let decryptedData
    try {
        decryptedData = aesDecrypt(session_key, iv, encryptedData)
        // 解密出了userInfo
        decryptedData = JSON.parse(decryptedData)
    } catch (e) {
        console.error("ERR_IN_DECRYPT_DATA", e)
    }

    // 存储到数据库中
    // return AuthDbService.saveUserInfo(decryptedData, skey, session_key).then(userinfo => ({
    //     loginState: LOGIN_STATE.SUCCESS,
    //     userinfo
    // }))
    res.send({
        status: 200,
        sessionResult,
        decryptedData: decryptedData,
        head: req.headers,

    })

})


module.exports = router;
// export default  router;

