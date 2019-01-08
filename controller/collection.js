/**
 * 可参考 https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312 的api设计
 */

class Collection {
    constructor() {

    }

    // 返回指定用户的收藏列表
    async getCollection(req, res, next) {
        let userId = req.body.id

        let sql = `
              SELECT DISTINCT C.article_id,
                  A.title,
                  A.dateline,
                  A.banner_img,
                  A.author,
                  A.fuck_date,
                  A.tags
                  ,(SELECT count(1) FROM hos_zan Z WHERE A.id=Z.type_id) AS 'agree'
                FROM hos_collection C
                  RIGHT JOIN hos_article A on A.id = C.article_id
                where C.user_id = ${userId} 
        `

        const row = await query(sql ).catch((err) => {
            console.log(err)
            return err.message
        })
        res.send(returnRes(row))
    }

    //  返回用户的收藏 (不是 post,普通函数)
    async getUserCollection(userId, page) {
        //每页显示100条数据
        let num = 100;
        // 获取limit的第一个参数的值 offset ，(传入的页数-1) * 每页的数据 得到limit第一个参数的值
        let offset = (page - 1) * num;

        let sql = `
               SELECT DISTINCT C.article_id,
                  A.title,
                  A.dateline,
                  A.banner_img,
                  A.author,
                  A.fuck_date,
                  A.tags
                  ,(SELECT count(1) FROM hos_zan Z WHERE A.id=Z.type_id) AS 'agree'
                FROM hos_collection C
                  RIGHT JOIN hos_article A on A.id = C.article_id
                where C.user_id = ${userId} 
                 limit ${offset}, ${num};
        `

        const row = await query(sql).catch((err) => {
            console.log(err)
        })

        return row
    }


    // 执行收藏/取消收藏
    async collect(req, res, next) {
        // let userId = req.body.userId
        let userId = req.userInfo.userId
        let articleId = req.body.articleId
        let collect = req.body.collect  // 1 是执行收藏,0 是取消收藏

        // TODO 重复插入数据的可能？？ 需处理
        let sql
        if (collect === 1) {
            sql = `insert into hos_collection(user_id, article_id) values (?,?);`;
        } else {
            sql = "DELETE FROM hos_collection WHERE user_id=? AND article_id=?;";
        }
        const row = await query(sql, [userId, articleId]).catch((err) => {
            console.log(err)
            return err.message
        })

        let sqlCollectList = `
              SELECT DISTINCT C.article_id,
                  A.title,
                  A.dateline,
                  A.banner_img,
                  A.author,
                  A.fuck_date,
                  A.tags
                  ,(SELECT count(1) FROM hos_zan Z WHERE A.id=Z.type_id) AS 'agree'
                FROM hos_collection C
                  RIGHT JOIN hos_article A on A.id = C.article_id
                where C.user_id = ${userId} ;
        `

        if (row.affectedRows > 0) {
            const row2 = await query(sqlCollectList ).catch((err) => {
                console.log(err)
                return err.message
            })
            res.send(rtFormat(collect === 1 ? "已收藏" : "取消收藏", {
                res: row,
                data: row2,
                message: collect === 1 ? "已收藏" : "取消收藏"
            }, 200))

        } else {
            res.send(rtFormat("收藏失败"))
        }
    }

}

export default new Collection()

// module.exports = new User(user_info);

