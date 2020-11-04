const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");

router.get("/", ctrl.auth.showLogin)
router.post("/login", ctrl.auth.login);

router.post("/register", ctrl.auth.register);


router.delete("/logout", ctrl.auth.logout)
    // router.post("/logout", ctrl.auth.logout);

module.exports = router;