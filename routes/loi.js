var express = require('express');
var router = express.Router();

import Loi from "../controller/loi"

router.get('/', function (req, res, next) {
    log("/loi 根目录")
    next()
},Loi.auth, Loi.getAllInoventory);

router.get('/inventory/code/:inventoryCode',Loi.auth, async (req, res) => {
    const {inventoryCode} = req.params;
    const result = await Loi.getByInventoryCode(inventoryCode)
    res.json(result)
})
router.get('/inventory/name/:inventoryName',Loi.auth, async (req, res) => {
    const {inventoryName} = req.params;
    const result = await Loi.getByInventoryName(inventoryName)
    res.json(result)
})
router.get('/inventory/id/:id',Loi.auth, async (req, res) => {
    const {id} = req.params;
    const result = await Loi.getByInventoryId(id)
    res.json(result)
})

router.post('/entry',Loi.auth, Loi.entry)
router.post('/modify',Loi.auth, Loi.modify)
router.post('/auth', Loi.auth)
router.post('/register', Loi.register)
router.post('/login', Loi.login)

module.exports = router;
// export default  router;
