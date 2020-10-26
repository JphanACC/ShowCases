// const db = require('../models');

const index = (req, res) => {
    res.render('index', { title: "Home Page" })
};



module.exports = {
    index,
}