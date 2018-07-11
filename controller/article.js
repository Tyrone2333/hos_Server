/**
 * 可参考 https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312 的api设计
  */

 class Article {
    constructor() {

    }

    async getArticle(req, res, next){
        let userId = req.params.id

        log(userId)
        let sql = 'select * from hos_user where id=?'
        const row = await query(sql, [userId]).catch((err) => {
            console.log(err)
        })
        res.send(returnRes(row))
    }
    

}

export default new Article()

// module.exports = new User(user_info);

