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
        const row = await query(sql, [userId,userId,userId]).catch((err) => {
            console.log(err)
            return err.message
        })
        res.send(returnRes(row))
    }
}

export default new Collection()

// module.exports = new User(user_info);

