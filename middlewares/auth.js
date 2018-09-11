/**
 * 过期的token:
 * eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJzYWx0IjoiZjVjODI4ZmYxMjJjZDhkMDUwOTA1MTU4NDIzNmNjZWIyOGM3OGJmYSIsImlhdCI6MTUzMTI3NTY3NywiZXhwIjoxNTMxMjc1NjgyfQ.7Z6K1wK72psCBwV1BGgUSOq7gJyqiqUlXx6D77nAV-U
 */

class Auth {
    constructor() {
        this.secretOrPrivateKey = "enzo server secret key"  // 这是加密的密钥
        this.expiresTime = 60 * 60 * 24

        // 有(req, res, next)的函数里不这样绑定是访问不到this,
        this.checkUser = this.checkUser.bind(this);
    }

    // 获取token
    async getToken(usernameOrId) {
        const jwt = require('jsonwebtoken');


        // var secretOrPrivateKey = "enzo server secret key"; // 这是加密的key（密钥）
        let selectSql = typeof usernameOrId === "number"
            ? "SELECT * FROM hos_user WHERE id=?"
            : "SELECT * FROM hos_user WHERE username=?"

        const row = await query(selectSql, usernameOrId).catch((err) => {
            console.log(err)
            return err.message
        })

        let data = {
            userId: row[0].id,
            username: row[0].username,
        }

        return jwt.sign(data, this.secretOrPrivateKey, {expiresIn: this.expiresTime})
    }

    //  用于客户端自动刷新 token
    async refreshToken() {

    }

    //  验证用户是否登录
    async checkUser(req, res, next) {
        const jwt = require('jsonwebtoken');
        let headerToken = req.headers["authorization"] || req.body.token || null
        // let expectUsername = req.body.username

        let decode, error
        jwt.verify(headerToken, this.secretOrPrivateKey, function (err, decoded) {
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
            // TODO 待修改,验证方式存在安全问题
            if (decode.username && decode.userId) {
                // 把存着的用户信息放置  req.userInfo 方便后面路由使用
                req.userInfo = {
                    userId: decode.userId,
                    username: decode.username
                }
                next()
            } else {
                res.send({
                    errno: -1,
                    error,
                    message: "token错误,请重新登录获取"
                })
            }

        }
    }

}


export default new Auth()