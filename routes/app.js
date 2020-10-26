//imports
const router = require('express').Router();
const ctrl = require('../controllers');

//routes
//show home
router.get("/", ctrl.app.index);



//exports
module.exports = router;