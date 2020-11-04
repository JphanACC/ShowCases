const mongoose = require("mongoose");

const connectionString =
    process.env.MONGODB_URL || "mongodb://localhost:27017/showcases";
const configOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
};

mongoose
    .connect(connectionString, configOptions)
    .then(() => console.log("MongoDB successfully connected..."))
    .catch((err) => console.log(`MongoDB connection error: ${err}`));

module.exports = {
    Post: require("./Post"),
    User: require("./User"),
};