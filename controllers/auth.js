const bcrypt = require("bcryptjs");
const db = require("../models");
const jwt = require("jsonwebtoken");

//SECTION Register
// POST Register Route
const register = async(req, res) => {
    try {
        const foundUser = await db.User.findOne({ email: req.body.email });

        if (foundUser) {
            return res.send({ message: "Account is already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        // takes each character and turns it into multiple random characters
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
        // create user with req.body and hashed password
        const createdUser = await db.User.create({...req.body, password: hash });

        return res
            .status(201)
            .json({ status: 201, message: "success", createdUser });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Something went wrong. Please try again",
        });
    }
};


//______________________________
// SECTION Login
// POST Login Route
const login = async(req, res) => {
    try {
        const foundUser = await await db.User.findOne({ email: req.body.email });

        console.log(foundUser);

        if (!foundUser) {
            return res.send({ message: "Email or Password incorrect" });
        }

        const match = await bcrypt.compare(req.body.password, foundUser.password);

        if (!match) {
            return res.send({ message: "Email or Password incorrect" });
        }

        const isMatch = await bcrypt.compare(req.body.password, foundUser.password);

        if (isMatch) {
            //TODO create a json web token
            const signedJwt = await jwt.sign({
                    // take id of the found user and add in the id to the jwt payload
                    _id: foundUser._id,
                },
                // secret to sign the jwt with
                "super_secret_key", {
                    // its good practice to have an expiration amount for jwt tokens.
                    expiresIn: "1h",
                }
            );

            return res.status(200).json({
                status: 200,
                message: "Success",
                id: foundUser._id,
                signedJwt,
            });
            // the password provided does not match the password on file.
        } else {
            return res.status(400).json({
                status: 400,
                message: "Username or password is incorrect",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            message: "Something went wrong. Please try again",
        });
    }
};

// Show Login page
const showLogin = (req, res) => {
    res.render('auth/login', { title: "Login Page" })
}

// POST Logout Route
const logout = (req, res) => {
    // logout functionality not needed. We just remove the JWT on the front end.
};


module.exports = {
    register,
    login,
    showLogin,
    logout,
};