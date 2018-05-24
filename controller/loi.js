export default class Loi {
    constructor() {
        // this.name = info.name;
        // this.age = info.age;
        // this.location = info.location
    }

    //获取用户信息
    static async getAllInoventory(req, res, next) {
        log(req.query)
        let page = req.query.page || 1 //设置当前页数，没有则设置为1
        let num = 10;//每页显示10条数据
        // 获取limit的第一个参数的值 offset ，(传入的页数-1) * 每页的数据 得到limit第一个参数的值
        let offset = (page - 1) * num;

        try {
            let sql = 'select * from inventory order by id desc limit '+offset+','+num
            const row = await query(sql).catch((err) => {
                console.log(err)
            })
            res.send(returnRes(row))

        } catch (err) {
            console.log(err);
            res.send({
                errno: -1,
                message: '出错了！'
            })
        }
    }

    static async getByInventoryCode(code) {
        let sql = 'select * from inventory where i_code=?'
        const row = await query(sql, [code]).catch((err) => {
            console.log(err)
        })

        return returnRes(row)
    }

    static async getByInventoryId(id) {

        let sql = 'select * from inventory where id=?'
        const row = await query(sql, [id]).catch((err) => {
            console.log(err)
        })

        return returnRes(row)
    }

    static async getByInventoryName(req, res, next){

        let name = req.params.inventoryName
        let page = req.query.page || 1 //设置当前页数，没有则设置为1
        let num = 10;//每页显示10条数据
        // 获取limit的第一个参数的值 offset ，(传入的页数-1) * 每页的数据 得到limit第一个参数的值
        let offset = (page - 1) * num;

        try {
            let sql = 'select * from inventory where i_name like ? or i_specification like ? order by id desc limit '+offset+','+num

            const row = await query(sql, ['%' + name + '%', '%' + name + '%']).catch((err) => {
                console.log(err)
            })
            res.send(returnRes(row))

        } catch (err) {
            console.log(err);
            res.send({
                errno: -1,
                message: '出错了！'
            })
        }
    }

    static async entry(req, res, next) {
        let inventory = req.body
        inventory.create_time = Math.round(new Date().getTime() / 1000)
        inventory.update_time = Math.round(new Date().getTime() / 1000)

        let sql = "insert into inventory set ?"

        let result = await query(sql, inventory).catch((err) => {
            console.log(err)
            return err.sqlMessage
        })
        if (result !== undefined && result.affectedRows === 1) {
            res.send({
                errno: 0,
                id: result.insertId,
                message: '添加库存信息成功',
            })
        } else {
            res.send({
                errno: -1,
                message: result,
            })

        }

    }

    static async modify(req, res, next) {
        let inventory = req.body
        let id = inventory.id
        delete inventory.id
        delete inventory.create_time
        inventory.update_time = Math.round(new Date().getTime() / 1000)


        let sql = 'update inventory set ? where id=? '
        let result = await query(sql, [inventory, id]).catch((err) => {
            console.log(err)
            return err.sqlMessage
        })
        if (result !== undefined && result.affectedRows === 1) {
            res.send({
                errno: 0,
                id: result.insertId,
                message: '修改库存信息成功',
            })
        } else {
            res.send({
                errno: -1,
                message: result,
            })

        }

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
                errno: 1,
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

    static async delete(req, res, next) {
        let inventory = req.body
        let id = inventory.id

        let sql = "DELETE FROM inventory WHERE id=?"
        const row = await query(sql, id).catch((err) => {
            console.log(err)
            return err.message
        })

        log(row)
        if (row !== undefined && row.affectedRows === 1) {
            // 删除成功
            res.send({
                errno: 0,
                message: "删除成功"
            })
        } else {
            res.send({
                errno: -1,
                row: row,
                message: "失败,请刷新重试"
            })
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
