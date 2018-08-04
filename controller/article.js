/**
 * 可参考 https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312 的api设计
 */

class Article {
    constructor() {
        this.getArticleList = this.getArticleList.bind(this)
        this.getArticleById = this.getArticleById.bind(this)
        // this.getCommentByArticle = this.getCommentByArticle.bind(this)
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
        const reply = await this.getCommentByArticle(id).catch(err => {
            console.error(err)
        })

        if (row.length > 0) {
            res.send({
                errno: 0,
                data: row,
                reply
            })
        } else {
            res.send({
                errno: 2,
                data: row[0],
                message: "查询为空",
            })
        }

    }

    async publicArticle(req, res, next) {

        let title = req.body.title
        let author = req.body.author
        let description = req.body.description
        let content = req.body.content
        let md = req.body.md
        let banner_img = req.body.banner_img
        let author_id = req.body.author_id
        let fuck_date = req.body.fuck_date
        let tags = req.body.tags
        let dateline = Math.round(new Date().getTime() / 1000)

        // 验证
        let editError;
        if (title === '') {
            editError = '标题不能是空的。';
        } else if (title.length < 4 || title.length > 100) {
            editError = '标题字数太多或太少。';
        } else if (tags === "") {
            editError = '必须选择一个版块。';
        } else if (content === '') {
            editError = '内容不可为空';
        }
        // END 验证
        if (editError) {
            res.send({
                errno: 2,
                message: editError,
            })
        }
        let sql = "insert into hos_article(title, author,author_id, description, content,md,banner_img,dateline,fuck_date,tags)"
            + " values(?,?,?,?,?,?,?,?,?,?)";

        let row = await query(sql, [title, author, author_id, description, content, md, banner_img, dateline, fuck_date, tags]).catch((err) => {
            console.log(err)
            return err.message
        })

        if (row.affectedRows > 0) {
            res.send({
                errno: 0,
                data: row,
                article_id: row.insertId,
                message: "发布成功"
            })
        } else {
            res.send({
                errno: 2,
                data: row,
                message: "发布失败",
            })
        }
    }

    // 返回评论而不是res.send
    async getCommentByArticle(article_id) {

        let sql = "SELECT   hos_comment.id AS 'comment_id',from_id, to_id, content, timestamp, article_id, from_nickname, to_nickname,hos_user.avatar "
            + " FROM hos_comment,hos_user  WHERE article_id=? AND from_id=hos_user.id"
            + " ORDER BY timestamp ASC"

        let row = await query(sql, [article_id]).catch((err) => {
            console.log(err)
            return err.message
        })

        return row

    }

    async reply(req, res, next) {

        // from_id, to_id, content, timestamp, article_id, from_nickname, to_nickname
        let from_id = req.body.from_id
        let to_id = req.body.to_id
        let content = req.body.content
        let timestamp = Math.round(new Date().getTime() / 1000)
        let article_id = req.body.article_id
        let from_nickname = req.body.from_nickname
        let to_nickname = req.body.to_nickname

        // 验证
        let editError;
        if (content === '') {
            editError = '内容不能是空的。';
        } else if (content.length < 4 || content.length > 400) {
            editError = '字数太多或太少。';
        } else if (!from_id ) {
            editError = '没有回复主体';
        }else if (from_id !== req.body.id) {
            editError = '用户信息有误';
        }else if (to_id === req.body.id) {
            editError = '不能@自己哦';
        }
        // END 验证
        if (editError) {
            res.send({
                errno: 2,
                message: editError,
            })
            return
        }

        let sql = "INSERT INTO hos_comment(from_id, to_id, content, timestamp, article_id, from_nickname, to_nickname) " +
            "  VALUE (?,?,?,?,?,?,?);"

        let row = await query(sql, [from_id, to_id, content, timestamp, article_id, from_nickname, to_nickname]).catch((err) => {
            console.log(err)
            return err.message
        })

        if (row.affectedRows > 0) {
            res.send({
                errno: 0,
                row_insertId: row.insertId,
                message: "评论成功",
                body:req.body
            })
        } else {
            res.send({
                errno: 2,
                data: row,
                message: "评论失败",
            })
        }
    }

}

export default new Article()

// module.exports = new User(user_info);

