const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    description: {
        type: String,
        required: [true, "Please provide what you want to say in the post!"],
        maxlength: 500,
    },
    created_at: Date,
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    content_video: {
        type: String,

    },
    content_image: {
        type: String,
    },
    content_3D: {
        type: String,
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true,
});;

const Post = mongoose.model("Post", postSchema);

module.exports = Post;