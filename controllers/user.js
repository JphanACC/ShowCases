const db = require("../models");

//My Gallery
const galleryShow = async(req, res) => {
    try {
        const foundCurrentUser = await db.User.findById(req.session.currentUser.id).populate("Followings");
        const foundUser = await db.User.findById(req.params.id).populate("Followings");
        const foundcurrentFollowers = await db.User.findById(req.session.currentUser.id).populate("Followers");
        const foundUserPosts = await db.Post.find({
            User: foundUser.id
        }).populate("User").sort({ "createdAt": -1 })

        const filteredPosts = foundUserPosts.filter(post => post.content_image || post.content_video || post.content_3D)

        res.render('mygallery', {
            title: "My Gallery",
            eachPost: filteredPosts,
            currentUser: foundCurrentUser,
            foundUser: foundUser,
            currentFollowers: foundcurrentFollowers,
        })
    } catch (error) {
        console.log(error)
        return res.redirect("404")
    }
};

//My Profile
const show = async(req, res) => {
    try {
        const foundCurrentUser = await db.User.findById(req.session.currentUser.id).populate("Followings");
        const foundUser = await db.User.findById(req.params.id).populate("Followings");
        const foundcurrentFollowers = await db.User.findById(req.session.currentUser.id).populate("Followers");
        const foundUserPosts = await db.Post.find({
            User: foundUser.id
        }).populate("User")


        res.render('myprofile', {
            title: "My Profile",
            eachPost: foundUserPosts,
            currentUser: foundCurrentUser,
            foundUser: foundUser,
            currentFollowers: foundcurrentFollowers,
        })
    } catch (error) {
        console.log(error)
        return res.redirect("404")
    }
};

const editProfile = async(req, res) => {
    try {
        const foundCurrentUser = await db.User.findById(req.session.currentUser.id);
        const foundUser = await db.User.findById(req.params.id)

        if (foundCurrentUser.id === foundUser.id) {
            const updatedUser = await db.User.findByIdAndUpdate(foundUser.id, req.body, {
                new: true
            })
        }

        res.redirect(`/user/${foundUser.id}/profile`)
    } catch (error) {
        console.log(error)
        return res.redirect("404")
    }
}

const editPost = async(req, res) => {
    try {
        const foundCurrentUser = await db.User.findById(req.session.currentUser.id);
        const foundPost = await db.Post.findById(req.params.id).populate("User")
        const foundUserId = foundPost.User.id

        if (foundCurrentUser.id === foundUserId) {
            const updatedPost = await db.Post.findByIdAndUpdate(req.params.id, req.body, {
                new: true
            })

            // Youtube Video trimmed tag
            if (updatedPost.content_video && updatedPost.content_video.length !== 11) {
                const trimmedURL = updatedPost.content_video.slice(-11)
                updatedPost.content_video = trimmedURL
            }

            // sketchfab trimmed tag
            if (updatedPost.content_3D && updatedPost.content_3D.length !== 11) {
                const trimmedURL = updatedPost.content_3D.slice(-32)
                updatedPost.content_3D = trimmedURL
            }

            await updatedPost.save()

        }

        res.redirect(`/user/${foundUserId}/profile`)
    } catch (error) {
        console.log(error)
        return res.redirect("404")
    }
}

deletePost = async(req, res) => {
    try {
        const foundCurrentUser = await db.User.findById(req.session.currentUser.id);
        const foundPost = await db.Post.findById(req.params.id).populate("User")
        const foundUserId = foundPost.User.id


        if (foundCurrentUser.id === foundUserId) {
            const updatedPost = await db.Post.findByIdAndDelete(req.params.id)
        }

        res.redirect(`/user/${foundUserId}/profile`)
    } catch (error) {
        console.log(error)
        return res.redirect("404")
    }
}

module.exports = {
    show,
    editProfile,
    editPost,
    deletePost,
    galleryShow,
};