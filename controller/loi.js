export default class Loi {
    constructor() {
        // this.name = info.name;
        // this.age = info.age;
        // this.location = info.location
    }

    //获取用户信息
    static async getAllInoventory(req, res, next) {
        try {
            let sql = 'select * from inventory'
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

    static async getByInventoryName(name) {

        log(name)
        let sql = 'select * from inventory where i_name like ?'
        const row = await query(sql, '%' + name + '%').catch((err) => {
            console.log(err)
        })

        return returnRes(row)
    }

    static async entry(req, res, next) {
        let inventory = req.body

        let sql = "insert into inventory set ?"

        let result = await query(sql, inventory).catch((err) => {
            console.log(err)
            return err.sqlMessage
        })
        if (result !== undefined && result.affectedRows === 1) {
            res.send({
                errno: 0,
                id : result.insertId,
                message: '添加库存信息成功',
            })
        } else {
            res.send({
                errno: -1,
                message: result,
            })

        }

    }

}

function returnRes(row) {
    if (row.length > 0) {
        return ({
            errno: 0,
            data: row
        })
    } else {
        return ({
            errno: -1,
            data: row[0],
            message: "查询为空"
        })
    }
}
