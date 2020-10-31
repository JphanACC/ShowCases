const db = require("../models");

const show = async(req, res) => {
    try {
        const foundPost = await db.Post.find({}).populate("User");
        const foundCurrentUser = await db.User.findById(req.session.currentUser.id);
        const foundUser = await db.User.findById(req.params.id).populate("Followings");
        const foundcurrentFollowing = await db.User.findById(req.params.id).populate("Followings");

        console.log("Current User")
        console.log(foundCurrentUser)
        res.render('myprofile', {
            title: "My Profile",
            eachPost: foundPost,
            currentUser: foundCurrentUser,
            foundUser: foundUser,
            foundcurrentFollowing: foundcurrentFollowing,
        })
    } catch (error) {
        console.log(error)
        return res.redirect("404")
    }
};

module.exports = {
    show,
};