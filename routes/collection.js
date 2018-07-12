
var express = require('express');
var router = express.Router();

import Auth from "../middlewares/auth"
import Collection from "../controller/collection"


router.post('/',Auth.checkUser, Collection.getCollection)


module.exports = router;
