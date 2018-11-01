import Auth from "../middlewares/auth"
import Article from "./article"
import Collection from "./collection"

let resHelper = require("../helper/resHelper")
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
            res.send(rtFormat("注册成功", {
                id: result.insertId,
                message: '注册成功',
            }, 200))

        } else {
            res.send(rtFormat(result))
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

                res.send(rtFormat("登录成功", {token, userinfo: user,}, 200))

            } else {
                res.send(rtFormat("密码错误"))
            }

        } else {
            res.send(rtFormat("用户不存在", row, -1))

        }
    }

    // 使用token免密登录
    static async tokenLogin(req, res, next) {

        const jwt = require('jsonwebtoken');
        let headerToken = req.headers["authorization"] || req.body.token || null
        let decode, error

        jwt.verify(headerToken, "enzo server secret key", function (err, decoded) {
            if (err) {
                error = err
            }
            decode = decoded
        });

        if (error !== undefined) {
            res.send(rtFormat("验证过期，请重新登录", {decode, error}, 401,))
        } else {
            // token验证成功了
            if (decode.username && decode.userId) {
                let username = decode.username
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

                    res.send(rtFormat("token刷新,登录成功", {token, userinfo: user,}, 200))

                } else {
                    res.send(rtFormat("用户不存在", row, -1))
                }
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

            res.send(rtFormat("ok", {
                userInfo: user,
                userArticle,
                userCollection,
                // 现在只有评论,以后可能有其他拓展
                userReply: {
                    comment: userComment,
                },
            }, 200))
        } else {
            res.send(rtFormat("不存在这个用户"))
        }
    }

    // 改用户信息
    static async changeInformation(req, res, next) {
        let {username, userId} = req.userInfo
        let {nickname, age, sex, email, address} = req.body

        let sql = `
        update hos_user set nickname=?,age=?,sex=?,email=?,address=? where id=?
`
        const row = await query(sql, [nickname, age, sex, email, address, userId]).catch((err) => {
            console.log(err)
            return err.message
        })

        if (row.affectedRows > 0) {
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

                res.send(rtFormat("修改成功", {message: "修改成功", userinfo: user,}, 200))
            }
        } else {
            res.send(rtFormat("修改出错了"))
        }

    }

    // 改密
    static async changePwd(req, res, next) {
        let {username, userId} = req.userInfo
        let {oldPwd, newPwd} = req.body

        let selectSql = "SELECT * FROM hos_user WHERE username=?"
        const row = await query(selectSql, username).catch((err) => {
            console.log(err)
            return err.message
        })

        if (row.length > 0) {
            let salt = row[0].salt
            let expectPwd = getSha1(username + oldPwd + salt)
            // 旧密码验证成功
            if (row[0].username === username && expectPwd === row[0].pwd) {
                // 生成新密码
                let password = getSha1(username + newPwd + salt)
                let changePwdSql = `  update hos_user set pwd=? where id=? ; `
                // 修改数据库
                const row = await query(changePwdSql, [password, userId]).catch((err) => {
                    console.log(err)
                    return err.message
                })

                if (row.affectedRows > 0) {
                    res.send(rtFormat("修改成功", {row,}, 200))

                } else {
                    res.send(rtFormat("密码修改失败",))
                }

            } else {
                // 旧密码验证失败
                res.send(rtFormat("旧密码错误",))
            }
        } else {
            res.send(rtFormat("修改出错了",))
        }

    }


}

// module.exports = new User(user_info);


