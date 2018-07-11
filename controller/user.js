import Auth from "../middlewares/auth"


export default class User {
    constructor() {

    }

    static async register(req, res, next) {
        let {username, pwd} = req.body

        let salt = getSha1("fucksalt" + username)
        let password = getSha1(username + pwd + salt)
        let user = {
            username,
            pwd: password,
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
                    userinfo:user,
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

    static async getUserInfo(req, res, next) {

        let userId = req.params.id

        log(userId)
        let sql = 'select * from hos_user where id=?'
        const row = await query(sql, [userId]).catch((err) => {
            console.log(err)
        })
        res.send(returnRes(row))
    }


}

// module.exports = new User(user_info);


