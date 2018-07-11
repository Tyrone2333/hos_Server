var express = require('express');
var router = express.Router();

import Hos from "../controller/hos"

// router.get('/', function (req, res, next) {
//     log("/loi 根目录")
//     next()
// },Loi.auth, Loi.getAllInoventory);


router.post('/auth', Hos.auth)


module.exports = router;
// export default  router;
