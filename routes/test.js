var express = require('express');
var router = express.Router();
var rf = require("fs");

router.get('/', async (req, res, next) => {
    let data = await read().then((data) =>{
        log("先then一下")
        return data
    })
    res.send({
        status: 200,
        // watch:"in watch???",
        data
    })
    log("hos_api test ")
});
router.post('/', async (req, res, next) => {
    let data = await read()
    log(data)
    res.send({
        status: 200,
        data
    })
    log(3)
});


async function read() {
    return new Promise((resolve, reject) => {
        rf.readFile(__dirname + "/test.txt", 'utf-8', (err, data) => {
            if (err) {
                reject(err)
            } else {
                // log(data)
                resolve(data)
            }
        });
    }).catch(err => {
        log(err)
    })
}

module.exports = router;
// export default  router;
