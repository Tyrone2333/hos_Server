var express = require('express');
var router = express.Router();

import Loi from "../controller/loi"

// let User = require("../controller/user")
import User from "../controller/user"

// GET /user 默认内容
// router.get('/', function (req, res, next) {
//     res.send({
//         errno:0,
//         message:"hello user"
//     })
// });


router.post('/register', User.register)
router.post('/login', User.login)

module.exports = router;
// export default  router;
