-- phpMyAdmin SQL Dump
-- version 4.8.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 2018-08-08 22:37:34
-- 服务器版本： 5.7.18
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO"
SET AUTOCOMMIT = 0
START TRANSACTION
SET time_zone = "+00:00"


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
/*!40101 SET NAMES utf8mb4 */

--
-- Database: `bdm289907541_db`
--
CREATE DATABASE IF NOT EXISTS `bdm289907541_db` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci
USE `bdm289907541_db`

-- --------------------------------------------------------

--
-- 表的结构 `hos_article`
--

DROP TABLE IF EXISTS `hos_article`
CREATE TABLE IF NOT EXISTS `hos_article` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(32) NOT NULL,
  `author` varchar(30) DEFAULT NULL COMMENT '作者',
  `description` text COMMENT '文章描述',
  `content` text COMMENT '文章内容（html）',
  `md` text COMMENT 'markdown结构',
  `author_id` int(11) NOT NULL COMMENT '作者id',
  `banner_img` text COMMENT 'banner图（文章的最后一张图）',
  `dateline` int(11) DEFAULT '0' COMMENT '提交时间',
  `fuck_date` int(11) DEFAULT NULL,
  `tags` varchar(128) DEFAULT NULL COMMENT '标签、主题',
  `agree` int(11) DEFAULT '0' COMMENT '赞同数',
  `disagree` int(11) DEFAULT '0' COMMENT '反对数',
  PRIMARY KEY (`id`),
  KEY `fk_authorId` (`author_id`)
) ENGINE=MyISAM AUTO_INCREMENT=167 DEFAULT CHARSET=utf8 COMMENT='文章表'

--
-- 转存表中的数据 `hos_article`
--

INSERT INTO `hos_article` (`id`, `title`, `author`, `description`, `content`, `md`, `author_id`, `banner_img`, `dateline`, `fuck_date`, `tags`, `agree`, `disagree`) VALUES
(106, '图片测试', 'Greak Neir', '', '<p>图片测试<br>\n<img src=\"data:image/pngbase64,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\" alt=\"图片\" rel=\"./0\"></p>\n', '图片测试\n![图片](./0)', 37, '', 1523754719, 1546275661, '时尚', 0, 0),
(110, '鸟巢发布会后，你觉得老罗和他的锤子凉了吗 ', 'Greak Neir', '', '<p>昨晚的锤子发布会，大部分人的裤裆都湿了。不是因为被罗永浩的颠覆设备吓尿，而是因为北京突发的雷阵雨。<br>\n很遗憾没有去到现场看，但想想这个天气，看直播也挺好，至少不会被淋湿。</p>\n<p>很多人说鸟巢这场发布会关乎锤子的性命，这个在 6 年内经历了风风雨雨终于活下来的手机厂商，能不能成就看这一把了。<br>\n而在看过这场发布会后，很多人在发布会中就给锤子，也给罗永浩做了判决：罗永浩和锤子都要凉了。</p>\n<p><img src=\"//img3.myhsw.cn/2018-07-20/bp2ae813.png\" alt=\"图片\"></p>\n<p>你觉得老罗真的凉了吗？<br>\n昨天发布的R1和Smartisan TNT Station，你们期待吗？</p>', '昨晚的锤子发布会，大部分人的裤裆都湿了。不是因为被罗永浩的颠覆设备吓尿，而是因为北京突发的雷阵雨。\n很遗憾没有去到现场看，但想想这个天气，看直播也挺好，至少不会被淋湿。\n\n很多人说鸟巢这场发布会关乎锤子的性命，这个在 6 年内经历了风风雨雨终于活下来的手机厂商，能不能成就看这一把了。\n而在看过这场发布会后，很多人在发布会中就给锤子，也给罗永浩做了判决：罗永浩和锤子都要凉了。\n\n你觉得老罗真的凉了吗？\n昨天发布的R1和Smartisan TNT Station，你们期待吗？\n\n![图片](//img3.myhsw.cn/2018-07-20/bp2ae813.png)\n', 37, '//img3.myhsw.cn/2018-07-20/bp2ae813.png', 1526645997, 1546275661, '游戏', 1478, 7741),
(108, '图片可用', 'Greak Neir', '', '<p><img src=\"//192.168.1.186/console/upload/49add012ae3503d58d9fc4a1c508e207.jpg\" alt=\"图片\"></p>\n', '\n![图片](//192.168.1.186/console/upload/49add012ae3503d58d9fc4a1c508e207.jpg)', 37, '', 1523785657, 1546275661, '游戏', 999990, 12),
(109, ' 域名未出错', 'Greak Neir', '', '<p>域名未出错<br>\n~~<br>\n域名未出错~~<br>\n<img src=\"//192.168.1.186/console/upload/49add012ae3503d58d9fc4a1c508e207.jpg\" alt=\"图片\"></p>\n<p><img src=\"//192.168.1.186/console/upload/9a4841fb3dac6f55972de6512bc1fb14.jpg\" alt=\"图片\"></p>\n<p><img src=\"//192.168.1.186/console/upload/9a4841fb3dac6f55972de6512bc1fb14.jpg\" alt=\"图片\"></p>\n<p><img src=\"//192.168.1.186/console/upload/05d4d507c5e8e7f7d8dd679893abb9ab.jpg\" alt=\"图片\"></p>\n', '\n域名未出错\n~~\n域名未出错~~\n![图片](//192.168.1.186/console/upload/49add012ae3503d58d9fc4a1c508e207.jpg)\n\n\n![图片](//192.168.1.186/console/upload/9a4841fb3dac6f55972de6512bc1fb14.jpg)\n\n\n![图片](//192.168.1.186/console/upload/9a4841fb3dac6f55972de6512bc1fb14.jpg)\n\n\n![图片](//192.168.1.186/console/upload/05d4d507c5e8e7f7d8dd679893abb9ab.jpg)\n\n', 37, '', 1523786214, 2082762000, '编程', 153543, 1564),
(111, '备份', 'Greak Neir', '', '<p>备份# 备份<ins>备份</ins> #</p>\n', '备份# 备份++备份++ #', 37, '', 1527504657, 1546275661, '玩机技巧,游戏', 0, 0),
(156, '草稿演示', '仁贾_陆', '', '<p><strong>这是草稿演示</strong></p>\n', '**这是草稿演示**', 1, '', 1533194273, 1546275661, '客户端测试', 0, 0),
(164, 'img test ', '仁贾_陆', '', '<p><strong>这是草稿演示</strong></p>\n<p><img src=\"//127.0.0.1:10010/static/images/e3a7ca5b2f30f294a86df3e53e879b60fabc51ff.png\" alt=\"7ZIDKNOYCQQF_Y5LU99WWT.png\" /></p>\n<p><img src=\"//127.0.0.1:10010/static/images/0de5283880fc0b5c68b1487602a964907ae3e9e5.jpg\" alt=\"Best Friend_.jpg\" /></p>\n<h3>单行的标题</h3>\n<p><strong>粗体</strong><br />\n<code>console.log(\'行内代码\')</code><br />\n<code>js\\n code \\n</code> 标记代码块<br />\n<a href=\"%E9%93%BE%E6%8E%A5\" target=\"_blank\">内容</a><br />\n<img src=\"%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5\" alt=\"文字说明\" /></p>\n<blockquote>\n<p>ii<br />\n<em>eoe</em></p>\n</blockquote>\n', '**这是草稿演示**\n\n![7ZIDKNOYCQQF_Y5LU99WWT.png](//127.0.0.1:10010/static/images/e3a7ca5b2f30f294a86df3e53e879b60fabc51ff.png)\n\n![Best Friend_.jpg](//127.0.0.1:10010/static/images/0de5283880fc0b5c68b1487602a964907ae3e9e5.jpg)\n\n### 单行的标题\n**粗体**\n`console.log(\'行内代码\')`\n```js\\n code \\n``` 标记代码块\n[内容](链接)\n![文字说明](图片链接)\n\n> ii\n*eoe*', 1, '//127.0.0.1:10010/static/images/0de5283880fc0b5c68b1487602a964907ae3e9e5.jpg', 1533194879, 1546275661, '客户端测试', 0, 0)

-- --------------------------------------------------------

--
-- 表的结构 `hos_collection`
--

DROP TABLE IF EXISTS `hos_collection`
CREATE TABLE IF NOT EXISTS `hos_collection` (
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `article_id` int(11) NOT NULL COMMENT '收藏的文章id',
  KEY `user_id` (`user_id`),
  KEY `article_id` (`article_id`)
) ENGINE=MyISAM DEFAULT CHARSET=gbk COMMENT='收藏表'

--
-- 转存表中的数据 `hos_collection`
--

INSERT INTO `hos_collection` (`user_id`, `article_id`) VALUES
(37, 95),
(38, 92),
(37, 102),
(37, 99),
(37, 98),
(37, 105),
(38, 108),
(1, 108),
(38, 110),
(62, 164),
(1, 110),
(1, 109)

-- --------------------------------------------------------

--
-- 表的结构 `hos_comment`
--

DROP TABLE IF EXISTS `hos_comment`
CREATE TABLE IF NOT EXISTS `hos_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from_id` int(11) NOT NULL COMMENT '评论者id',
  `to_id` int(11) NOT NULL COMMENT '评论对象id',
  `content` varchar(256) NOT NULL,
  `timestamp` int(11) NOT NULL,
  `article_id` int(11) NOT NULL COMMENT '评论发生的文章id',
  PRIMARY KEY (`id`),
  KEY `article_id` (`article_id`),
  KEY `from_id` (`from_id`),
  KEY `to_id` (`to_id`)
) ENGINE=MyISAM AUTO_INCREMENT=41 DEFAULT CHARSET=gbk COMMENT='评论表'

--
-- 转存表中的数据 `hos_comment`
--

INSERT INTO `hos_comment` (`id`, `from_id`, `to_id`, `content`, `timestamp`, `article_id`) VALUES
(1, 1, 38, 'test comment', 1533194273, 110),
(2, 1, 38, '应该可以从另外线程 close，block 的这个可能会读到 EOF 或这异常（可能语言相关）。', 1533194273, 110),
(3, 38, 1, '特别是现在这个动不动就要工作10个小时以上的时代；其次，我用鼠标只要动个手腕，用他的工作台我要手舞足蹈 ···最后···工作台1w，还一定要配备他的手机···<br>那么我如果买了工作台是放在家里还是放在办公室呢···恩··· 手机其实没什么问题，就是这个工作台太鸡肋了，无法连续长时间的使用 ···牛逼吹的太大，导致落差太大。凉还不至于，但温度会低一点是肯定的', 1526645997, 110),
(4, 37, 1, '(...)\r\nbanner_img\r\n:\r\n(...)\r\ndescription\r\n:\r\n(...)\r\neditorHtmlValue\r\n:\r\n(...)\r\neditorMDValue\r\n:\r\n(...)\r\neditorValue\r\n:\r\n(...)\r\nfuckDate\r\n:\r\n(...)\r\njoinTopicList\r\n:\r\n(...)\r\nminuteListValue\r\n:\r\n(...)\r\noptionsList\r\n:\r\n(...)\r\n', 1533194273, 110),
(5, 38, 1, '特别是现在这个动不动就要工作10个小时以上的时代；其次，我用鼠标只要动个手腕，用他的工作台我要手舞足蹈 ···最后···工作台1w，还一定要配备他的手机···<br>那么我如果买了工作台是放在家里还是放在办公室呢···恩··· 手机其实没什么问题，就是这个工作台太鸡肋了，无法连续长时间的使用 ···牛逼吹的太大，导致落差太大。凉还不至于，但温度会低一点是肯定的', 1533194273, 164),
(6, 37, 37, '	Nextcloud 上面的在线编辑完的 Office 文档，能版本控制嘛？', 1533198773, 110),
(7, 1, 37, '学会了ES6，就不会写出那样的代码.声明变量的新姿势,用let不用var', 1533194273, 110),
(23, 1, 38, '有bug,放在最底部可以这样,如果reply组件底下还有东西就应该', 1533349415, 110),
(17, 1, 1, '    this.fetchData()\n            this.initcollectList()', 1533308257, 110),
(16, 1, 38, '    this.fetchData()\n            this.initcollectList()', 1533308151, 110),
(24, 1, 37, '有bug,放在最底部可以这样,如果reply组件底下还有东西就应该', 1533349498, 110),
(25, 1, 1, 'color: #778087\n    text-decoration: none\n    word-break: break-all', 1533349730, 164),
(26, 62, 37, '我是虾米...米...', 1533352544, 110),
(27, 62, 1, 'space-around：子容器沿主轴均匀分布，位于首尾两端的子容器到父容器的距离是子容器间距的一半。', 1533352572, 164),
(28, 62, 1, '虾米测试..//dushizz.top/img/default.jpg', 1533352895, 164),
(29, 62, 1, '我爱彩虹六号', 1533375622, 111),
(30, 1, 62, '我也爱彩虹六号', 1533696855, 111),
(31, 1, 37, '我们都爱彩虹六号', 1533696873, 111),
(32, 1, 37, '回复楼主测试', 1533697117, 111),
(35, 1, 62, '排序来自两个表，所以没办法完全利用索引', 1533714936, 110),
(38, 38, 1, ' MySQL数据库order by 主键(索引) 查询慢解决方案', 1533715066, 111),
(39, 38, 37, 'Shell Script 实现使用 cat 读串口的同时向串口写数据', 1533715219, 111),
(40, 38, 62, '我不爱彩虹六号', 1533715239, 111)

-- --------------------------------------------------------

--
-- 表的结构 `hos_message`
--

DROP TABLE IF EXISTS `hos_message`
CREATE TABLE IF NOT EXISTS `hos_message` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `content` varchar(1000) DEFAULT NULL,
  `create_time` int(10) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8

--
-- 转存表中的数据 `hos_message`
--

INSERT INTO `hos_message` (`id`, `content`, `create_time`) VALUES
(1, 'enzo关注了你的文章图片测试', 1533119604),
(2, 'enzo在文章图片测试中回复了你', 1533119604),
(3, 'enzo在文章图片测试中回复了你', 1533119604)

-- --------------------------------------------------------

--
-- 表的结构 `hos_message_notified`
--

DROP TABLE IF EXISTS `hos_message_notified`
CREATE TABLE IF NOT EXISTS `hos_message_notified` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `from_id` int(11) DEFAULT NULL,
  `to_id` int(11) DEFAULT NULL,
  `message_id` int(20) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `create_time` int(10) DEFAULT '0',
  `type` varchar(12) DEFAULT NULL COMMENT '公告 Announce，提醒 Remind，信息 Message',
  `action` varchar(12) DEFAULT NULL COMMENT '\r\n                                                     * reply: xx 回复了你的文章\r\n                                                     * reply2: xx 在文章中回复了你\r\n                                                     * follow: xx 关注了你的文章\r\n                                                     * at: xx ＠了你',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8

--
-- 转存表中的数据 `hos_message_notified`
--

INSERT INTO `hos_message_notified` (`id`, `from_id`, `to_id`, `message_id`, `is_read`, `create_time`, `type`, `action`) VALUES
(1, 38, 1, 1, 0, 1533119604, 'remind', 'follow'),
(3, 38, 1, 2, 0, 1533119604, 'remind', 'reply2'),
(4, 39, 2, 2, 0, 1533119604, 'remind', 'reply2')

-- --------------------------------------------------------

--
-- 表的结构 `hos_token`
--

DROP TABLE IF EXISTS `hos_token`
CREATE TABLE IF NOT EXISTS `hos_token` (
  `user_id` int(11) NOT NULL,
  `user_token` varchar(50) NOT NULL,
  `expire_time` int(11) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=gbk

--
-- 转存表中的数据 `hos_token`
--

INSERT INTO `hos_token` (`user_id`, `user_token`, `expire_time`) VALUES
(44, '5583437dfa88ba9417a172db01d91a811e9383a8', 1515980532),
(43, '3eba8bce454715d344328ca77e2b1ca6f2cb52ae', 1531883290),
(40, '9ba4292b2db0433c47bffb55ab0c1e7ebb511c39', 1515121194),
(41, '19f6c6dd4a36380a07204f63b3f242715d706949', 1515122663),
(42, 'c664d2b44f43a757fc34086b2abd007e86640c8d', 1516023817),
(37, '519ac27514f55c52b489cf8aedeaece91024c2da', 1527685933),
(38, 'f802442e60fffebddde99902c9b178a7e64d8cb6', 1531883284),
(39, '992e1d45fb579455b90ca03710aff87ffc3a3129', 1514901343)

-- --------------------------------------------------------

--
-- 表的结构 `hos_user`
--

DROP TABLE IF EXISTS `hos_user`
CREATE TABLE IF NOT EXISTS `hos_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(25) NOT NULL,
  `nickname` varchar(32) DEFAULT NULL COMMENT '昵称',
  `pwd` varchar(50) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `sex` tinyint(4) DEFAULT NULL,
  `avatar` varchar(255) NOT NULL DEFAULT '//dushizz.top/img/default.jpg' COMMENT '头像',
  `salt` varchar(50) DEFAULT NULL COMMENT '盐值',
  `email` varchar(32) DEFAULT NULL,
  `register_time` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=64 DEFAULT CHARSET=gbk

--
-- 转存表中的数据 `hos_user`
--

INSERT INTO `hos_user` (`id`, `username`, `nickname`, `pwd`, `age`, `sex`, `avatar`, `salt`, `email`, `register_time`) VALUES
(1, 'root', '仁贾_陆', '4bf994a5467822ec39b76b92c02e792a33c4562a', NULL, NULL, 'https://upload-images.jianshu.io/upload_images/13417663-ba3041d5bd8209cf.png', 'f5c828ff122cd8d0509051584236cceb28c78bfa', NULL, 1531198885),
(38, 'enzo', 'enzo', 'c3aff9e384feeacc974eb4c41d1d80f16fb0f12f', NULL, NULL, 'http://placeholder.qiniudn.com/100x100/3c5e91/3c5e91', 'f5c828ff122cd8d0509051584236cceb28c78bfa', NULL, 0),
(37, 'Greak Neir', 'Greak Neir', 'e858d82241025b9561667f89db6d2eb963976b4b', NULL, NULL, 'https://avatars1.githubusercontent.com/u/5886475?v=4&s=120', 'f5c828ff122cd8d0509051584236cceb28c78bfa', NULL, 0),
(40, 'DuShiZZ', '渡世之舟', 'a8d1fed8ab12550420e114d4f91dba28e9d32fa7', NULL, NULL, '//dushizz.top/img/Best%20Friend_.jpg', '09452736ee45b57466c5d10953717b076fe8d0fa', NULL, 0),
(41, '123', '杨', '9682e044e74e3d151fa4b00cf99672bf015e41b7', NULL, NULL, '//www.yangzq.top/img/fuck_face.jpg', 'aea20ff7fcc9cf6a4b143bbd3c42fb52e557cd03', NULL, 0),
(42, '123456', '123456', 'b8da0d0b2fa6d17ecf14646604d17ec4daa9dee8', NULL, NULL, '//www.yangzq.top/img/fuck_face.jpg', '77ea84b2f8d802b971df82573b348a84810dfeca', NULL, 0),
(43, 'steamm', 'steamm', '6317b939665456e3c4a9a71744537e5a39a7db3c', NULL, NULL, '//www.yangzq.top/img/fuck_face.jpg', '3fd3b769f0fa698bf9c77f8c5cb7fb2b1695acdd', NULL, 0),
(56, 'Greaka', 'Greak Neir', '4bf994a5467822ec39b76b92c02e792a33c4562a', NULL, NULL, '//www.yangzq.top/img/fuck_face.jpg', NULL, NULL, 0),
(57, 'Greaka1', 'Greak Neir', '4bf994a5467822ec39b76b92c02e792a33c4562a', NULL, NULL, '//www.yangzq.top/img/fuck_face.jpg', NULL, NULL, 0),
(58, 'aa', NULL, 'b4ec5cb6c6167213f83aa95fb0a4524dfccf8b02', NULL, NULL, '//dushizz.top/img/Best%20Friend_.jpg', '6259f909af3e9a4c4cf1f5402f5870df4e0ce349', NULL, 1531298885),
(59, 'root2', NULL, '42aeb7a76eb650dc1f13a27c5ab8199446e68d75', NULL, NULL, '//dushizz.top/img/Best%20Friend_.jpg', '57f3ba1c424995ac41d84c8d239963d7da368e75', NULL, 1531299068),
(60, 'root22', NULL, '9372859f966cec7ee0243407bbe6b17a9f5800f0', NULL, NULL, '//dushizz.top/img/Best%20Friend_.jpg', 'f208e2e375a3afee5a82879608ed2bc1ce683110', NULL, 1531299257),
(61, 'root23', NULL, '6ddf23c65a59ade890008b8021d538e7ad2a445e', NULL, NULL, '//dushizz.top/img/Best%20Friend_.jpg', 'dcda27377afb502f02c74ca1f3d2c593dec1c7d9', NULL, 1531320861),
(62, 'xiami', '无味虾米', 'bbc1cd3932f4aa00c58ed57a6340279ec36f4bf0', NULL, NULL, '//dushizz.top/img/default.jpg', '29abd8e5d203b2a637d31985c89811a9a94cfb01', NULL, 1533352350)
COMMIT

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
