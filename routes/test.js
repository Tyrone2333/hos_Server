var express = require('express');
var router = express.Router();
var rf = require("fs");

router.get('/', function (req, res, next) {
    const promise = new Promise(function(resolve, reject) {
        return reject(new Error('test'));
    });
    promise.catch(function(error) {
        log(1)
    });

    new Promise((resolve, reject) => {
        return resolve(22);
        // 后面的语句不会执行
        console.log(2);
    }).then(function (val) {
        log(val)
        rf.readFile("routes/tiest.txt", 'utf-8', function (err, data) {
            if (err) {
                res.send({
                    status: -1,
                    errno: err.errno
                })
            } else {
                res.send({
                    status: 200,
                    msg: "test page",
                    data: data
                })
            }
        });
    }).catch(err => {
        log(err)
    })

    log(3)
});


module.exports = router;
// export default  router;
