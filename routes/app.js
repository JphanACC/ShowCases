//imports
const express = require("express");
const router = express.Router();
const ctrl = require('../controllers');


//routes
//show home
router.get("/", ctrl.app.index);

//create
router.post("/", ctrl.app.addPost);
router.post("/:id/like", ctrl.app.likePost)
router.post("/:id/follow", ctrl.app.followUser)

//exports
module.exports = router;