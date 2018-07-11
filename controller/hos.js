export default class Hos {
    constructor() {
        // this.name = info.name;
        // this.age = info.age;
        // this.location = info.location
    }

    static async auth(req, res, next) {
        const jwt = require('jsonwebtoken');

        let headerToken = req.headers["token"]
        let data = req.body
        let secretOrPrivateKey = "enzo server"; // 这是加密的key（密钥）
        let token = jwt.sign(data, secretOrPrivateKey, {expiresIn: 60 * 60});

        let decode, error
        jwt.verify(headerToken, secretOrPrivateKey, function (err, decoded) {
            if (err) {
                error = err
            }
            decode = decoded
        });

        if (error !== undefined && error.message === "jwt expired") {
            res.send({
                errno: 2,
                token,
                temp: getSha1("enzo"),
                decode,
                error,
                message: "验证过期，请重新登录"
            })
        } else if (headerToken === undefined || error) {
            res.send({
                errno: -1,
                error,
                message: "无权访问,请重新登录"
            })
        } else {
            next()
        }
    }

}

function getSha1(str) {
    var crypto = require('crypto');
    var sha1 = crypto.createHash("sha1");//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
    sha1.update(str);
    var res = sha1.digest("hex");  //加密后的值d
    return res;
}

