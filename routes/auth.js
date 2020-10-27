const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");

router.get("/login", ctrl.auth.showLogin)
router.post("/register", ctrl.auth.register);
router.post("/login", ctrl.auth.login);
router.post("/logout", ctrl.auth.logout);

module.exports = router;