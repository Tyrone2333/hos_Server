SHOW DATABASES;

-- 部分查询语句

CREATE TABLE hos_message (
  `id`               INT(20) NOT NULL AUTO_INCREMENT COMMENT '',
  `content`          VARCHAR(1000)       DEFAULT NULL,
  `create_time` INT(10)            DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE hos_message_notified (
  `id`          INT(20) NOT NULL AUTO_INCREMENT,
  `from_id`     INT(11)          DEFAULT NULL,
  `to_id`     INT(11)          DEFAULT NULL,
  `message_id`  INT(20)          DEFAULT NULL,
  `is_read`      BOOLEAN          DEFAULT FALSE ,
  `create_time` INT(10)            DEFAULT 0,
  `type`     VARCHAR(12)          DEFAULT NULL COMMENT '公告 announce，提醒 remind，信息 message',
  `action`     VARCHAR(12)          DEFAULT NULL COMMENT '
                                                     * reply: xx 回复了你的文章
                                                     * reply2: xx 在文章中回复了你
                                                     * follow: xx 关注了你的文章
                                                     * at: xx ＠了你',
  PRIMARY KEY (`id`)
);

INSERT INTO hos_message( content, create_time) VALUE ('enzo关注了你的文章图片测试','1533119604');
INSERT INTO hos_message_notified( from_id, to_id, message_id, is_read, create_time, type, action)
  VALUE ('38','1',1,FALSE ,'1533119604','remind','follow');

SELECT * FROM hos_message LEFT JOIN hos_message_notified ON hos_message.id=hos_message_notified.message_id;

SELECT hos_message.id,content, from_id, to_id, message_id, is_read, hos_message.create_time, type, action
FROM hos_message, hos_message_notified,hos_user
  LEFT JOIN hos_user AS nickname ON hos_user.id=hos_message_notified.from_id
WHERE hos_user.id=to_id
AND hos_message.id=hos_message_notified.message_id=1
AND is_read=FALSE
;

select *, case when
  (select count(*) from hos_collection,hos_article where hos_collection.article_id = hos_article.id)>0
  then 1 else 0 end as flag from hos_collection
;

# 获取收藏
SELECT * FROM hos_collection,hos_user WHERE exists(select id from hos_user,hos_collection where hos_user.id=hos_collection.user_id) AND  hos_user.id=user_id AND id=1;


SELECT *,CASE WHEN hos_user.id=hos_collection.user_id THEN 1 ELSE 0
  END AS 'is_collect',article_id
FROM hos_collection,hos_user,hos_article
WHERE hos_user.id=hos_collection.user_id AND article_id=109;

# 插入评论
INSERT INTO hos_comment( from_id, to_id, content, timestamp, article_id)
  VALUE (1, 38, '不用var', 1533194273, 110);


# 可查to_nickname
SELECT hos_comment.id AS 'comment_id', hos_comment.to_id,hos_user.nickname AS 'to_nickname'

FROM hos_user,hos_comment
WHERE hos_comment.article_id=110
      AND hos_comment.to_id=hos_user.id;

# 可查from_nickname
SELECT hos_comment.id AS 'comment_id', hos_comment.from_id,hos_user.nickname AS 'from_nickname'
FROM hos_user,hos_comment
WHERE hos_comment.article_id=110
      AND hos_comment.from_id=hos_user.id;


#可查所有评论,带to_nickname,from_nickname
SELECT A.id AS 'comment_id', A.from_id,B.nickname AS 'from_nickname',
A.to_id,C.nickname AS 'to_nickname',timestamp, article_id,B.avatar, content,
  CASE WHEN A.to_id=(SELECT hos_article.author_id FROM hos_article WHERE hos_article.id=110) THEN 1 ELSE 0
  END AS 'is_for_author'
FROM hos_comment A
  INNER JOIN hos_user B ON A.from_id=B.id
  INNER JOIN hos_user C ON A.to_id=C.id
WHERE A.article_id=110 ORDER BY timestamp DESC

