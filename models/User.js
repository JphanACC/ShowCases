const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100,
    },
    firstName: {
        type: String,

    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password: {
        type: String,
        required: true
    },
    profileUrl: {
        type: String,
    },
    Followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        minimize: false
    }],
    Followings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        minimize: false
    }],
}, { timestamps: true });

userSchema.set("toJSON", {
    transform: (doc, ret, opt) => {
        delete ret["password"];
        return ret;
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;