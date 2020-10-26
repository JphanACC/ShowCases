const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100,
    },
    full_name: {
        type: String,
        required: null,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password: { type: String, required: true },
}, {
    timestamps: true,
});;

const Post = mongoose.model("Post", postSchema);

module.exports = Post;