import Auth from "../middlewares/auth"
import Article from "./article"
import Collection from "./collection"

export default class User {
    constructor() {

    }

    static async register(req, res, next) {
        let {username, pwd, nickname} = req.body

        let salt = getSha1("fucksalt" + username)
        let password = getSha1(username + pwd + salt)
        let user = {
            username,
            pwd: password,
            nickname,
            salt,
            register_time: Math.round(new Date().getTime() / 1000)
        }
        let sql = "insert into hos_user set ?"
        let result = await query(sql, user).catch((err) => {
            console.log(err)
            return err.sqlMessage
        })
        if (result !== undefined && result.affectedRows === 1) {
            res.send({
                errno: 0,
                id: result.insertId,
                message: '注册成功',
            })
        } else {
            res.send({
                errno: -1,
                message: result,
            })

        }

    }

    static async login(req, res, next) {
        let {username, pwd} = req.body

        let selectSql = "SELECT * FROM hos_user WHERE username=?"
        const row = await query(selectSql, username).catch((err) => {
            console.log(err)
            return err.message
        })

        if (row.length > 0) {
            let expectPwd = getSha1(username + pwd + row[0].salt)
            // 登录成功
            if (row[0].username === username && expectPwd === row[0].pwd) {
                let user = {}
                for (let key in row[0]) {
                    user[key] = row[0][key]
                }
                delete user.salt
                delete user.pwd

                let token = await Auth.getToken(username)

                res.send({
                    errno: 0,
                    token,
                    userinfo: user,
                    message: "登录成功"
                })
            } else {
                res.send({
                    errno: 1,
                    message: "密码错误"
                })
            }

        } else {
            res.send({
                errno: -1,
                row: row,
                message: "用户不存在"
            })
        }
    }

    // 使用token免密登录
    static async tokenLogin(req, res, next) {
        let {username} = req.body

        const jwt = require('jsonwebtoken');
        let headerToken = req.headers["token"] || req.body.token
        let expectUsername = req.body.username
        let decode, error

        jwt.verify(headerToken, "enzo server secret key", function (err, decoded) {
            if (err) {
                error = err
            }
            decode = decoded
        });

        if (error !== undefined && error.message === "jwt expired") {
            res.send({
                errno: 401,
                decode,
                error,
                message: "验证过期，请重新登录"
            })
        } else if (error !== undefined && error.message === "jwt must be provided") {
            res.send({
                errno: 401,
                error,
                message: "没有token信息,请登录"
            })
        } else if (headerToken === undefined || error) {
            res.send({
                errno: -1,
                error,
                message: "无权访问,请重新登录"
            })
        } else {
            // token验证成功了
            if (decode.username === expectUsername) {
                let selectSql = "SELECT * FROM hos_user WHERE username=?"
                const row = await query(selectSql, username).catch((err) => {
                    console.log(err)
                    return err.message
                })

                if (row.length > 0) {
                    let user = {}
                    for (let key in row[0]) {
                        user[key] = row[0][key]
                    }
                    delete user.salt
                    delete user.pwd

                    let token = await Auth.getToken(username)

                    res.send({
                        errno: 0,
                        token,
                        userinfo: user,
                        message: "登录成功"
                    })
                } else {
                    res.send({
                        errno: -1,
                        row: row,
                        message: "用户不存在"
                    })
                }
            } else {
                res.send({
                    errno: 401,
                    error,
                    message: "token错误,请重新登录获取"
                })
            }

        }


    }


    static async getUserInfo(req, res, next) {

        let userId = req.params.id
        let page = req.query.page > 0 ? req.query.page : 1 //设置当前页数，没有则设置为1

        let sql = 'select * from hos_user where id=?'
        const row = await query(sql, [userId]).catch((err) => {
            console.error(err)
            return []
        })

        let userArticle = await Article.getUserArticle(userId, page).catch((err) => {
            console.error(err)
            return []
        })
        let userComment = await Article.getUserComment(userId).catch((err) => {
            console.error(err)
            return []
        })
        let userCollection = await Collection.getUserCollection(userId, page).catch((err) => {
            console.error(err)
            return []
        })

        if (row.length > 0) {
            let user = {}
            for (let key in row[0]) {
                user[key] = row[0][key]
            }
            delete user.salt
            delete user.pwd

            res.send({
                errno: 0,
                data: {
                    userInfo: user,
                    userArticle,
                    userCollection,
                    // 现在只有评论,以后可能有其他拓展
                    userReply:{
                        comment:userComment,
                    } ,
                }
            })
        } else {
            res.send({
                errno: 2,
                data: row,
                message: "查询为空",
            })
        }
    }


}

// module.exports = new User(user_info);


