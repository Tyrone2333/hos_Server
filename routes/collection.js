
var express = require('express');
var router = express.Router();

import Auth from "../middlewares/auth"
import Collection from "../controller/collection"


router.post('/',Auth.checkUser, Collection.getCollection)
// 收藏/取消收藏
router.post('/collect',Auth.checkUser, Collection.collect)


module.exports = router;
