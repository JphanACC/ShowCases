/* external modules*/
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");


/* internal modules*/
// const db = require("./models");
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
app.use(methodOverride("_method"));

//Admin Home
app.use("/showcase", routes.app);


/* Server Listener*/
// connection
app.listen(port, () => console.log(`Server is running on port ${port}`));