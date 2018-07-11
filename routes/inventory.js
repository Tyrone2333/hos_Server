var express = require('express');
var router = express.Router();

import Inventory from "../controller/inventory"
import Loi from "../controller/hos"


router.get('/code/:inventoryCode', Loi.auth, Inventory.getByInventoryCode)
router.get('/name/:inventoryName', Loi.auth, Inventory.getByInventoryName)
router.get('/id/:id', Loi.auth, Inventory.getByInventoryId)
// id是无用的
router.get('/all/:id', Loi.auth, Inventory.getAllInoventory)

router.post('/entry',Loi.auth, Inventory.entry)
router.post('/modify',Loi.auth, Inventory.modify)
router.post('/delete',Loi.auth, Inventory.delete)

module.exports = router;
