let user_info = {
    name: "enzo",
    age: 22,
    "location": {
        "lat": 24.9075,
        "lng": 118.58687,
        "city": "泉州"
    }
}
var fs = require('fs');

function returnRes(row) {
    log(row)
    if (row.length > 0) {
        return {
            errno: 0,
            data: row[0]
        }
    } else {
        return {
            errno: -1,
            data: row[0],
            message: "查询为空"
        }
    }

}

export default class User {
    constructor() {
        // this.name = info.name;
        // this.age = info.age;
        // this.location = info.location
    }

    //获取用户信息
    static getUsers(req, res, next) {
        try {
            res.send({
                status: 200,
                data: user_info,
                message: '获取全部用户信息成功'
            })
        } catch (err) {
            console.log('获取用户信息失败', err);
            res.send({
                status: -1,
                message: '获取用户信息失败'
            })
        }
    }

    static async getUser(userId) {

        let sql = 'select * from hos_user where id=?'
        const row = await query(sql, [userId]).catch((err) => {
            console.log(err)
        })
        return returnRes(row)
    }

    static async addUser(req, res, next) {
        let {username, nickname, pwd} = req.body;
        let user = {
            "username": username,
            "nickname": nickname,
            "pwd": pwd
        }
        const sql = 'insert into hos_user set ?'

        // 注意，Node 有计划在未来废除unhandledRejection事件。
        // 如果 Promise 内部有未捕获的错误，会直接终止进程，并且进程的退出码不为 0。
        const result = await query(sql, user).catch((err) => {

            return err.sqlMessage
        })
        if (result !== undefined && result.affectedRows === 1) {
            let user_detail = {
                "user_id": result.insertId, //用户的id
                "nick_name": nickname // 昵称
            }
            return {
                errno: 0,
                data: user_detail,
                message: '添加用户信息成功',
            }
        } else {
            return {
                errno: -1,
                message: result,
            }
        }
    }

    static test(req, res, next) {
        // fs.readFile('/static/users.txt', function (err, data) {
        //     if (err) {
        //         console.log(err);
        //     }
        //     console.log(data.toString());
        // });
        res.send({
            errno: 0,
            // data: user_info,
            message: 'test',
        })
    }

}

// module.exports = new User(user_info);

