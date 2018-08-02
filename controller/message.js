/**
 * 可参考 https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312 的api设计
 */

class Message {
    constructor() {

    }

    async getArticleList(req, res, next) {

        let page = req.query.page > 0 ? req.query.page : 1 //设置当前页数，没有则设置为1

        //每页显示10条数据
        let num = 10;
        // 获取limit的第一个参数的值 offset ，(传入的页数-1) * 每页的数据 得到limit第一个参数的值
        let offset = (page - 1) * num;


        let sql = "select  id,title,description,dateline,banner_img,author,fuck_date,tags,agree,disagree from hos_article order by dateline desc limit "
            // let sql = "select * from hos_article order by dateline desc limit "
            + offset + ","
            + num;

        const row = await query(sql).catch((err) => {
            console.log(err)
        })
        res.send(returnRes(row))

    }

    async getArticleById(req, res, next) {

        let id = req.params.id
        let sql = "select * from hos_article WHERE id= " + id;

        const row = await query(sql).catch((err) => {
            console.log(err)
        })
        res.send(returnRes(row))

    }

}

export default new Message()

// module.exports = new User(user_info);

