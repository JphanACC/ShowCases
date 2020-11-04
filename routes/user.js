const express = require("express");
const router = express.Router();
const ctrl = require("../controllers");

//my profile
router.get("/:id/profile", ctrl.user.show);
router.get("/:id/gallery", ctrl.user.galleryShow);
router.put("/:id", ctrl.user.editProfile);
router.put("/editpost/:id", ctrl.user.editPost);
router.delete("/deletepost/:id", ctrl.user.deletePost);

module.exports = router;