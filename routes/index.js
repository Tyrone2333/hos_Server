
var user = require("./user")
var test = require("./test")
var loi = require("./loi")
var inventory = require("./inventory")
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
    app.use("/loi/user", user)
    app.use("/loi/inventory", inventory)
    app.use("/loi", loi)
}

