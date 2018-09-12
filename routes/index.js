let user = require("./user")
let test = require("./test")
let article = require("./article")
let collection = require("./collection")
let upload = require("./upload")

let router = require('express').Router();

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
    app.use("/hos_api/article", article)
    app.use("/hos_api/collection", collection)
    app.use("/hos_api/upload", upload)
}

