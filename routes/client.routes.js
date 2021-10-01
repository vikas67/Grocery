var express = require('express');
var router = express.Router();

var client = require("../controllers/client.controllers")

/* GET api page. */

router.get("/check" , client.Check)



module.exports = router;
