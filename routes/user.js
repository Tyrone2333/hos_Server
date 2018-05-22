var express = require('express');
var router = express.Router();


// let User = require("../controller/user")
import User from "../controller/user"

// GET /user 默认内容
router.get('/', function (req, res, next) {
    log("/user 根目录")
    next()
},User.getUsers);

router.get('/users', User.getUsers)
router.get('/:userId',async(req, res) => {
    const {userId} = req.params;
    const result = await User.getUser(userId)
    res.json(result)
})
router.get('/test', User.test)
router.post('/add_user', async(req, res) => {
    const result = await User.addUser(req, res)
    res.json(result)
})

module.exports = router;
// export default  router;
