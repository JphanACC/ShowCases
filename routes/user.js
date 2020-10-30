const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");

//my profile
router.get("/:id/profile", ctrl.user.show);


module.exports = router;