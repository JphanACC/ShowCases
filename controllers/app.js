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

        const carouselSlides = Array.from({ length: Math.ceil(trendingPost.length / 5) }, (v, i) => trendingPost.slice(i * 5, i * 5 + 5));

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