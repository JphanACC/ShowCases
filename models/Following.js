const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followingSchema = new Schema({
    Followers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    Followings: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

const Following = mongoose.model("Following", followingSchema);

module.exports = Following;