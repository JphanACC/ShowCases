const db = require('../models');

//Show Home Page
const index = async(req, res) => {
    try {
        const foundPost = await db.Post.find({}).populate("User").sort({ "createdAt": -1 })
        const foundCurrentUser = await db.User.findById(req.session.currentUser.id).populate("Followings");
        const foundcurrentFollowing = await db.User.findById(req.session.currentUser.id).populate("Followings");
        const sortedLikes = await db.Post.aggregate([
            // project with an array length
            {
                "$project": {
                    "description": 1,
                    "created_at": 1,
                    "likes": 1,
                    "content_video": 1,
                    "content_image": 1,
                    "content_3D": 1,
                    "User": 1,
                    "length": { "$size": "$likes" }
                }
            },
            // sort on the "length"
            { "$sort": { "length": -1 } },
        ])
        let trendingPost = await db.User.populate(sortedLikes, { "path": "User" })
        trendingPost = trendingPost.filter(post => post.content_image || post.content_video || post.content_3D)

        //algorithm credits go to https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-265.php
        const carouselSlides = Array.from({ length: Math.ceil(trendingPost.length / 4) },
            (v, i) => trendingPost.slice(i * 4, i * 4 + 4));

        res.render('index', {
            title: "Home Page",
            carouselSlides: carouselSlides,
            trendingPosts: trendingPost,
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

//SECTION Like
const likePost = async(req, res) => {
    try {
        const foundPost = await db.Post.findById(req.params.id).populate("User");
        const foundCurrentUser = await db.User.findById(req.session.currentUser.id);

        if (foundPost.likes.length === 0) {
            foundPost.likes.push(req.session.currentUser.id)
            await foundPost.save();

        } else {
            const isInLikes = foundPost.likes.map(id => id.toString()).includes(foundCurrentUser._id.toString())

            if (isInLikes === false) {
                foundPost.likes.push(foundCurrentUser._id)
            } else {
                foundPost.likes = foundPost.likes.filter((id) => id.toString() !== foundCurrentUser.id.toString())
            }

            await foundPost.save();
        }

        return res.redirect("/showcases/")
    } catch (error) {
        console.log(error)

        return res.redirect("404")
    }
}

// SECTION Follow
const followUser = async(req, res) => {
    try {
        const foundPost = await db.Post.findById(req.params.id).populate("User");
        const foundCurrentUser = await db.User.findById(req.session.currentUser.id);

        // string conversion is important here for the comparison
        //Check if current user's following section has target post user
        const isInFollowing = foundCurrentUser.Followings.map(id => id.toString()).includes(foundPost.User._id.toString())

        //Check if target post user's followers has current users id or not
        const isInFollower = foundPost.User.Followers.map(id => id.toString()).includes(foundCurrentUser._id.toString())


        //if post user's followers are empty
        //if current user's following is empty
        if (foundCurrentUser.id !== foundPost.User.id) {
            // the way you had it before is
            // if () then follow. if() then unfollow
            // whereas it should have been if () then follow, else then unfollow
            if (isInFollowing && isInFollower) {
                // unfollow
                // string conversion is important here for the comparison
                foundCurrentUser.Followings = foundCurrentUser.Followings.filter((id) => id.toString() !== foundPost.User._id.toString())
                foundPost.User.Followers = foundPost.User.Followers.filter((id) => id.toString() !== foundCurrentUser.id.toString())
            } else {
                // follow
                foundCurrentUser.Followings.push(foundPost.User._id)
                foundPost.User.Followers.push(foundCurrentUser.id)
            }
            await foundCurrentUser.save()
            await foundPost.User.save();
        } else {
            res.send('<script>alert("You cant follow your own post");</script>');
            res.redirect("/showcases/");
        }

        //Check
        // console.log("Current User Model status:")
        // console.log(foundCurrentUser)

        // console.log("Found Post User Model status:")
        // console.log(foundPost.User)

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