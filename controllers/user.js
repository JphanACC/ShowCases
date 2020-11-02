const db = require("../models");

const show = async(req, res) => {
    try {
        const foundCurrentUser = await db.User.findById(req.session.currentUser.id);
        const foundUser = await db.User.findById(req.params.id).populate("Followings");
        const foundcurrentFollowing = await db.User.findById(req.params.id).populate("Followings");
        const foundUserPosts = await db.Post.find({
            User: foundUser.id
        }).populate("User")


        res.render('myprofile', {
            title: "My Profile",
            eachPost: foundUserPosts,
            currentUser: foundCurrentUser,
            foundUser: foundUser,
            foundcurrentFollowing: foundcurrentFollowing,
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
};