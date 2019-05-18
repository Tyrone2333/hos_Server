/**
 * 可参考 https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312 的api设计
 */
import {returnRes} from "../common/func";

class Article {
    constructor() {
        this.getArticleList = this.getArticleList.bind(this)
        this.getArticleById = this.getArticleById.bind(this)
        // this.getCommentByArticle = this.getCommentByArticle.bind(this)
    }


    async getArticleList(req, res, next) {

        let page = req.query.page > 0 ? req.query.page : 1 //设置当前页数，没有则设置为1

        //每页显示10条数据
        let num = 20
        // 获取limit的第一个参数的值 offset ，(传入的页数-1) * 每页的数据 得到limit第一个参数的值
        let offset = (page - 1) * num


        let sql = "select  id,title,description,dateline,banner_img,author,fuck_date,tags from hos_article order by dateline desc limit "
            // let sql = "select * from hos_article order by dateline desc limit "
            + offset + ","
            + num

        const row = await query(sql).catch((err) => {
            console.log(err)
        })
        res.send(returnRes(row))
    }

    async getArticleById(req, res, next) {

        let id = req.params.id
        let userId = req.query.userId || 0
        // # 查找当前文章的内容,包含自己是否已赞过,需传入文章 id 和 用户id
        // let sql = "select * from hos_article WHERE id= " + id
        let sql = `
                    SELECT
                      (SELECT count(1) FROM hos_zan Z WHERE A.id=Z.type_id) AS 'agree',
                      CASE WHEN A.id = Z.type_id
                        THEN TRUE
                      ELSE FALSE
                      END      AS 'is_zan',
                      A.*
                    FROM hos_article A
                      LEFT JOIN hos_zan Z ON Z.type_id = A.id AND Z.user_id = ${userId}
                    WHERE A.id= ${id};
                    `

        const row = await query(sql).catch((err) => {
            console.log(err)
        })
        const reply = await this.getCommentByArticle(id).catch(err => {
            console.error(err)
        })
        if (row.length > 0) {
            res.send(rtFormat("ok", {
                data: row,
                reply
            }, 200))
        } else {
            res.send(rtFormat("查询为空"))
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
        let editError
        if (title === '') {
            editError = '标题不能是空的。'
        } else if (title.length < 4 || title.length > 100) {
            editError = '标题字数太多或太少。'
        } else if (tags === "") {
            editError = '必须选择一个版块。'
        } else if (content === '') {
            editError = '内容不可为空'
        }
        // END 验证
        if (editError) {

            res.send(rtFormat(editError))

        }
        let sql = "insert into hos_article(title, author,author_id, description, content,md,banner_img,dateline,fuck_date,tags)"
            + " values(?,?,?,?,?,?,?,?,?,?)"

        let row = await query(sql, [title, author, author_id, description, content, md, banner_img, dateline, fuck_date, tags]).catch((err) => {
            console.log(err)
            return err.message
        })

        if (row.affectedRows > 0) {
            res.send(rtFormat("发布成功", {
                row,
                article_id: row.insertId,
                message: "发布成功"
            }, 200))

        } else {
            res.send(rtFormat("发布失败"))
        }
    }

    //  返回评论而不是res.send
    async getCommentByArticle(article_id) {

        let sql = `SELECT A.id AS 'comment_id', A.from_id,B.nickname AS 'from_nickname',
                    A.to_id,C.nickname AS 'to_nickname',timestamp, article_id,B.avatar, content,
                      CASE WHEN A.to_id=(SELECT hos_article.author_id FROM hos_article WHERE hos_article.id=?) THEN 1 ELSE 0
                      END AS 'is_for_author'
                    FROM hos_comment A
                      INNER JOIN hos_user B ON A.from_id=B.id
                      INNER JOIN hos_user C ON A.to_id=C.id
                    WHERE A.article_id=? ORDER BY timestamp DESC`
        let row = await query(sql, [article_id, article_id]).catch((err) => {
            console.log(err)
            return err.message
        })

        return row

    }

    //  返回评论而不是res.send
    async getUserComment(user_id) {

        let sql = `SELECT A.id AS 'comment_id', A.from_id,B.nickname AS 'from_nickname',
                      A.to_id,C.nickname AS 'to_nickname',timestamp, article_id,B.avatar,D.title, A.content AS 'comment_content'
                    FROM hos_comment A
                      LEFT JOIN hos_user B ON A.from_id=B.id
                      LEFT JOIN hos_user C ON A.to_id=C.id
                      LEFT JOIN hos_article D ON D.id=A.article_id
                    WHERE A.from_id=? ORDER BY timestamp DESC`
        let row = await query(sql, [user_id]).catch((err) => {
            console.log(err)
            return err.message
        })

        return row

    }

    // 返回用户写的文章
    async getUserArticle(userId, page) {
        // let userId = req.params.id
        // let page = req.query.page > 0 ? req.query.page : 1 //设置当前页数，没有则设置为1

        //每页显示100条数据
        let num = 100
        // 获取limit的第一个参数的值 offset ，(传入的页数-1) * 每页的数据 得到limit第一个参数的值
        let offset = (page - 1) * num


        let sql = " select  id AS 'article_id',title,description,dateline,banner_img,author,fuck_date,tags from hos_article " +
            "WHERE author_id=? order by dateline desc limit "
            + offset + ","
            + num

        const row = await query(sql, [userId]).catch((err) => {
            console.log(err)
        })

        return row
    }

    // 评论发表
    async reply(req, res, next) {

        // from_id, to_id, content, timestamp, article_id,
        let from_id = req.body.from_id
        let to_id = req.body.to_id
        let content = req.body.content
        let timestamp = Math.round(new Date().getTime() / 1000)
        let article_id = req.body.article_id

        // 验证
        let editError
        if (content === '') {
            editError = '内容不能是空的'
        } else if (content.length < 4 || content.length > 400) {
            editError = '字数太多或太少'
        } else if (!from_id) {
            editError = '没有回复主体'
        }
        // END 验证
        if (editError) {
            res.send(rtFormat(editError))

            return
        }

        let sql = "INSERT INTO hos_comment(from_id, to_id, content, timestamp, article_id) " +
            "  VALUE (?,?,?,?,?)"

        let row = await query(sql, [from_id, to_id, content, timestamp, article_id]).catch((err) => {
            console.log(err)
            return err.message
        })

        if (row.affectedRows > 0) {
            res.send(rtFormat("评论成功", "评论成功", 200))

        } else {
            res.send(rtFormat("评论失败"))

        }
    }

    // id	主键
    // type_id	对应的作品或评论的id
    // type	点赞类型  1作品点赞  2 评论点赞 3....
    // user_id	用户id
    // dateline  创建时间

    // 这样的表结构也并不好,有些大v的文章可能会得到几十万的点赞，这样就会产生几十万条数据,而普通人可能就一两个赞
    async setZan(req, res, next) {
        let {typeId, userId, action} = req.body

        console.log(req.body)
        let dateline = Math.round(new Date().getTime() / 1000)
        let sql
        // 点赞的行为
        if (action === "zan") {
            sql = `INSERT INTO hos_zan(user_id, type_id, type, dateline) VALUE (${userId}, ${typeId}, 1, ${dateline});`
            let checkSql = `SELECT id
                            FROM hos_zan
                            WHERE user_id = ${userId} AND type_id = ${typeId};`
            let row = await query(checkSql).catch((err) => {
                console.log(err)
                return err.message
            })
            if (row.length > 0) {
                res.send(rtFormat("点赞已存在,不能重复插入"))
                return
            }
            // 取消赞
        } else if (action === "cancelZan") {
            sql = `
                    DELETE FROM hos_zan
                    WHERE user_id = ${userId} AND type_id = ${typeId};
                    `
        } else {
            res.send(rtFormat("必须传入action"))
            return
        }

        let row = await query(sql).catch((err) => {
            console.log(err)
            return err.message
        })
        if (row.affectedRows > 0) {
            res.send(rtFormat("成功", "成功", 200))
        } else {
            res.send(rtFormat("点赞失败"))

        }
    }
}

export default new Article()

// module.exports = new User(user_info)

