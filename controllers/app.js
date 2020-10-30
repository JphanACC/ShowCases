const db = require('../models');

//Show Home Page
const index = async(req, res) => {
    try {
        const foundPost = await db.Post.find({}).populate("User")
        const foundCurrentUser = await db.User.findById(req.session.currentUser.id).populate("Followings");
        const foundcurrentFollowing = await db.User.findById(req.session.currentUser.id).populate("Followings");

        console.log("Current User")
        console.log(foundCurrentUser)
        res.render('index', {
            title: "Home Page",
            eachPost: foundPost,
            currentUser: foundCurrentUser,
            foundcurrentFollowing: foundcurrentFollowing,
        })
    } catch (error) {
        console.log(error)
        return res.redirect("404")
    }
};

//Create new post
const addPost = async(req, res) => {
    try {

        const newPost = await db.Post.create(req.body);
        const foundUser = await db.User.findById(req.session.currentUser.id);

        // User of the Post is taken from current session's ID
        newPost.User = foundUser._id;

        // Youtube Video trimmed tag
        if (newPost.content_video) {
            const trimmedURL = newPost.content_video.slice(-11)

            newPost.content_video = trimmedURL
        }

        // sketchfab trimmed tag
        if (newPost.content_3D) {
            const trimmedURL = newPost.content_3D.slice(-32)

            newPost.content_3D = trimmedURL
        }

        await newPost.save();

        res.redirect("/showcases/");
    } catch (error) {
        console.log(`found User: ${req.session.currentUser.id}`)
        console.log(error)
        res.send('<script>alert("Cannot create message");</script>');
        return res.redirect("/showcases/")
    }
};

//Like
const likePost = async(req, res) => {
    try {
        const foundPost = await db.Post.findById(req.params.id).populate("User");
        const foundCurrentUser = await db.User.findById(req.session.currentUser.id);

        if (foundPost.likes.length === 0) {
            foundPost.likes.push(req.session.currentUser.id)
            await foundPost.save();
            res.redirect("/showcases/");
        } else {
            const isInLikes = foundPost.likes.includes(foundCurrentUser._id)

            if (isInLikes === false) {
                foundPost.likes.push(foundCurrentUser._id)
                await foundPost.save();
            }

            res.redirect("/showcases/");
        }
    } catch (error) {
        console.log(error)

        return res.redirect("404")
    }
}

//Follow
const followUser = async(req, res) => {
    try {
        const foundPost = await db.Post.findById(req.params.id).populate("User");
        const foundCurrentUser = await db.User.findById(req.session.currentUser.id);

        console.log(foundPost.User.Followers)

        //Pseudo-Code

        //if post user's followers are empty
        //if current user's following is empty
        if (foundCurrentUser.id !== foundPost.User.id) {
            if (foundCurrentUser.Followings.length === 0 || foundPost.User.Followers.length === 0) {
                foundCurrentUser.Followings.push(foundPost.User._id)
                foundPost.User.Followers.push(foundCurrentUser.id)
                await foundCurrentUser.save()
                await foundPost.User.save();

            } else {
                //Current user
                //Following: Post's user (unique)
                const isInFollowing = foundCurrentUser.Followings.includes(foundPost.User._id)
                const isInFollower = foundPost.User.Followers.includes(foundCurrentUser._id)

                if (!isInFollowing && !isInFollower) {
                    foundCurrentUser.Followings.push(foundPost.User._id)
                    foundPost.User.Followers.push(foundCurrentUser.id)
                    await foundCurrentUser.save()
                    await foundPost.User.save()
                }
            }
        } else {
            res.send('<script>alert("You cant like your own post");</script>');
            res.redirect("/showcases/");
        }

        //Check
        // console.log("Current User Model status:")
        // console.log(foundCurrentUser)

        console.log("Found Post User Model status:")
        console.log(foundPost.User)

        res.redirect("/showcases/")
    } catch (error) {
        console.log(error)

        return res.redirect("404")
    }
}


module.exports = {
    index,
    addPost,
    likePost,
    followUser,
}