/* external modules*/
const dotenv = require('dotenv').config();
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

/* internal modules*/
const db = require("./models");
const routes = require("./routes");

/*Instanced Modules */
const app = express();

/* Config */
// const PORT = process.env.DATABASE_URL || 3001;
const port = process.env.PORT || 3001;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

/* middleware */
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(methodOverride("_method"));

//SECTION Session setup
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: "FunnyMan",
        store: new MongoStore({
            url: process.env.MONGODB_URI || "mongodb://localhost:27017/showcases",
        }),
        cookie: {
            // milliseconds
            // 1000 (one second) * 60 (one minute) * 60 (one hour) * 24 (one day) * 7 (one week) * 2
            maxAge: 1000 * 60 * 60 * 24 * 7 * 2,
        },
    })
);

const authRequired = function(req, res, next) {
    if (!req.session.currentUser) {
        return res.redirect("/auth/login");
    }
    next();
};

app.use(function(req, res, next) {
    res.locals.user = req.session.currentUser; // adds the user to all ejs views
    next();
});

//SECTION Server-based Application
//App route
app.use("/showcases", authRequired, routes.app);
//Auth route
app.use("/auth", routes.auth);
//User route
app.use("/user", authRequired, routes.user);



/* Server Listener*/
// connection
app.listen(port, () => console.log(`Server is running on port ${port}`));