export default class Inventory {
    constructor() {

    }

    static async getAllInoventory(req, res, next) {
        log(req.query)
        let page = req.query.page > 0 ? req.query.page : 1 //设置当前页数，没有则设置为1

        let num = 10;//每页显示10条数据
        // 获取limit的第一个参数的值 offset ，(传入的页数-1) * 每页的数据 得到limit第一个参数的值
        let offset = (page - 1) * num;

        try {
            let sql = 'select * from inventory order by id desc limit '
                + offset + ','
                + num
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

    static async getByInventoryCode(req, res, next) {
        let {inventoryCode} = req.params;

        let page = req.query.page > 0 ? req.query.page : 1 //设置当前页数，没有则设置为1
        let num = 10;//每页显示10条数据
        // 获取limit的第一个参数的值 offset ，(传入的页数-1) * 每页的数据 得到limit第一个参数的值
        let offset = (page - 1) * num;

        let sql = 'select * from inventory where i_code=? order by id desc limit ' + offset + ',' + num
        const row = await query(sql, [inventoryCode]).catch((err) => {
            console.log(err)
            return err.message
        })
        res.send(returnRes(row))


    }

    static async getByInventoryId(req, res, next) {
        let {id} = req.params;
        let sql = 'select * from inventory where id=? '
        const row = await query(sql, [id]).catch((err) => {
            console.log(err)
            return err.message
        })

        res.send(returnRes(row))

    }

    static async getByInventoryName(req, res, next) {

        let name = req.params.inventoryName
        let page = req.query.page > 0 ? req.query.page : 1 //设置当前页数，没有则设置为1
        let num = 10;//每页显示10条数据
        // 获取limit的第一个参数的值 offset ，(传入的页数-1) * 每页的数据 得到limit第一个参数的值
        let offset = (page - 1) * num;

        try {
            let sql = 'select * from inventory where i_name like ? or i_specification like ? order by id desc limit ' + offset + ',' + num

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
            data: row,
            message: "查询为空",
        })
    }
}
