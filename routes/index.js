
var user = require("./user")
var test = require("./test")
var hos = require("./hos")

var router = require('express').Router();

router.get('/', function (req, res, next) {
    // console.log( process.env.PORT)
    res.send({
        status: 200,
        message: 'Welcome! Home Page',

    })
})

export default (app) => {
    app.use("/hos_api/", router)
    app.use("/hos_api/test", test)
    app.use("/hos_api/user", user)
    app.use("/hos_api/loi", hos)
}

