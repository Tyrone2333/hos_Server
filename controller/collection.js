/**
 * 可参考 https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312 的api设计
 */

class Collection {
    constructor() {

    }

    async getCollection(req, res, next) {
        let userId = req.body.id

        let sql = "SELECT article_id,title,dateline,banner_img,author,fuck_date,tags,agree"
            + " FROM hos_collection ,hos_article,hos_user "
            + "  WHERE hos_article.id IN ("
            + "  SELECT article_id FROM hos_collection WHERE user_id=? GROUP BY article_id"
            + " ) AND hos_collection.article_id=hos_article.id AND user_id=? AND hos_user.id=?;"
        const row = await query(sql, [userId, userId, userId]).catch((err) => {
            console.log(err)
            return err.message
        })
        res.send(returnRes(row))
    }

    //  返回用户的收藏
    async getUserCollection(userId, page) {
        //每页显示100条数据
        let num = 100;
        // 获取limit的第一个参数的值 offset ，(传入的页数-1) * 每页的数据 得到limit第一个参数的值
        let offset = (page - 1) * num;

        let sql = "SELECT article_id,title,dateline,banner_img,author,fuck_date,tags,agree"
            + " FROM hos_collection ,hos_article,hos_user "
            + "  WHERE hos_article.id IN ("
            + "  SELECT article_id FROM hos_collection WHERE user_id=? GROUP BY article_id"
            + " ) AND hos_collection.article_id=hos_article.id AND user_id=? AND hos_user.id=?  limit "
            + offset + ","
            + num;

        const row = await query(sql, [userId, userId,userId]).catch((err) => {
            console.log(err)
        })

        return row
    }



    // 执行收藏/取消收藏
    async collect(req, res, next) {
        let userId = req.body.userId
        let articleId = req.body.articleId
        let collect = req.body.collect  // 1 是执行收藏,0 是取消收藏

        let sql
        if (collect === 1) {
            sql = "insert into hos_collection(user_id, article_id) values (?,?);";
        } else {
            sql = "DELETE FROM hos_collection WHERE user_id=? AND article_id=?;";
        }
        const row = await query(sql, [userId, articleId]).catch((err) => {
            console.log(err)
            return err.message
        })

        // 返回收藏列表
        let sqlCollectList = "SELECT article_id,title,dateline,banner_img,author,fuck_date,tags,agree"
            + " FROM hos_collection ,hos_article,hos_user "
            + "  WHERE hos_article.id IN ("
            + "  SELECT article_id FROM hos_collection WHERE user_id=? GROUP BY article_id"
            + " ) AND hos_collection.article_id=hos_article.id AND user_id=? AND hos_user.id=?;"
        const row2 = await query(sqlCollectList, [userId, userId, userId]).catch((err) => {
            console.log(err)
            return err.message
        })

        if (row.affectedRows > 0) {
            res.send({
                errno: 0,
                res: row,
                data:row2,
                message: "收藏成功"
            })
        } else {
            res.send({
                errno: -1,
                res: row[0],
                data:row2,
                message: "收藏失败"
            })
        }
    }

}

export default new Collection()

// module.exports = new User(user_info);

