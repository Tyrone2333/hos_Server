var express = require('express');
var router = express.Router();

import Loi from "../controller/loi"

// router.get('/', function (req, res, next) {
//     log("/loi 根目录")
//     next()
// },Loi.auth, Loi.getAllInoventory);


router.post('/auth', Loi.auth)


module.exports = router;
// export default  router;
