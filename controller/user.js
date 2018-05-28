
function returnRes(row) {
    if (row.length > 0) {
        return ({
            errno: 0,
            data: row
        })
    } else {
        return ({
            errno: 2,
            data: row[0],
            message: "查询为空",
        })
    }
}
function getSha1(str) {
    var crypto = require('crypto');
    var sha1 = crypto.createHash("sha1");//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
    sha1.update(str);
    var res = sha1.digest("hex");  //加密后的值d
    return res;
}

export default class User {
    constructor() {
        // this.name = info.name;
        // this.age = info.age;
        // this.location = info.location
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
        let sql = "insert into loi_user set ?"
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
        const jwt = require('jsonwebtoken');

        let {username, pwd} = req.body
        let secretOrPrivateKey = "enzo server"; // 这是加密的key（密钥）

        let selectSql = "SELECT * FROM loi_user WHERE loi_user.username=?"
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
                let data = {
                    username,
                    salt: row[0].salt
                }
                let token = jwt.sign(data, secretOrPrivateKey, {expiresIn: 60 * 60 * 24})
                res.send({
                    errno: 0,
                    token,
                    user,
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

    static async getUser(userId) {

        let sql = 'select * from loi_user where id=?'
        const row = await query(sql, [userId]).catch((err) => {
            console.log(err)
        })
        return returnRes(row)
    }


}

// module.exports = new User(user_info);

