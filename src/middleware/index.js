const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../user/model")

exports.hashPass = async (req, res, next) => {
    // takes the password out of the body, hashes that password with bcrypt, and then puts it back in the body
    try {
        console.log(req.body.username);
        console.log("Hashing password.");
        req.body.password = await bcrypt.hash(req.body.password, 8)
        // note to self: add password length condition here.
        console.log("Sending request to controller.");
        next()
    } catch (error) {
        console.log(error);
        res.status(500).send({ err: error.message })
    }
}

exports.comparePass = async (req, res, next) => {
    // finds a user in the database, compares the body password with the db password,
    // if successful passes the user to the controller through req, if unsuccessful sends error
    console.log("Request recieved by compare password.");
    try {
        // note: need check whether the password is in the body (login) or the query (delete)
        if (req.query.password) {
            request = req.query
        } else {
            request = req.body   
        }
        console.log("Finding user");
        req.user = await User.findOne({ username: request.username })
        console.log("Checking password.");
        if (req.user && (await bcrypt.compare(request.password, req.user.password))) {
            console.log("Sending request to controller.");
            next()
        } else {
            throw new Error("Incorrect credentials.")
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ err: error.message });
    }
}

exports.tokenCheck = async (req, res, next) => {
    // gets a token from req, unlocks the token, finds a user with the id in the token, send the user to a controller
    try {
        console.log("Request recieved by tokenCheck.");
        const token = req.header("Authorization")
        console.log("user token: " + token);
        console.log("Decoding token.");
        const decodedToken = await jwt.verify(token, process.env.SECRET)
        console.log("decodedToken: ");
        console.log(decodedToken);
        console.log("Finding user by token id.");
        const user = await User.findById(decodedToken._id)
        console.log("user found: ");
        console.log(user);
        console.log("Passing user to request.");
        req.user = user
        console.log("username found in db: " + req.user);
        if (req.user) {
            console.log("Sending request to controller.");
            next()
        } else {
            console.log("No user found.");
            throw new Error("Incorrect credentials.")
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ err: error.message })
    }
}

