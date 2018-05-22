
var user = require("./user")
var test = require("./test")
var loi = require("./loi")
var router = require('express').Router();
router.get('/', function (req, res, next) {
    // console.log( process.env.PORT)
    res.send({
        status: 200,
        message: 'Welcome! Home Page',

    })
})
export default (app) => {
    app.use("/", router)
    app.use("/test", test)
    app.use("/user", user)
    app.use("/loi", loi)
}

