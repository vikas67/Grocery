var express = require('express');
var router = express.Router();

var admin = require("../controllers/admin.controllers")

/* Login */
router.get("/login" , admin.Login)
router.post("/login" , admin.Post_Login)

module.exports = router;
