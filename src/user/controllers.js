const jwt = require("jsonwebtoken");
const User = require("./model");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  // returns a jws token
  console.log("Request recieved by login.");
  try {
    const token = await jwt.sign({ _id: req.user._id }, process.env.SECRET)
    console.log("username is " + req.user.username);
    res.status(200).send({ msg: "Request processed.", token, username: req.user.username })
  } catch (error) {
    console.log(error);
    res.status(500).send({ err: error.message });
  }
}

exports.readAllUsers = async (req, res) => {
  // returns all usernames in the db
  console.log("Request recieved readAllUsers.");
  try {
    const result = await User.find({username: new RegExp(req.body.username)});
    const allUsers = result.map( x => x.username);
    console.log(allUsers);
    res.status(200).send({ msg: "Request processed.", allUsers });
  } catch (error) {
    console.log(error);
    res.status(500).send({ err: error.message });
  }
}

exports.createUser = async (req, res) => {
  // creates a new user 
  console.log("Request recieved by createUser.");
  try {
    const newUser = await User.create(req.body);
    console.log(newUser);
    const token = await jwt.sign({ _id: newUser._id }, process.env.SECRET)
    // note: we create a jwt token on the mongo db user id, 
    // hence when we decode it we can search for a user document by this id
    if (token) {
      res.status(200).send({ msg: "Request processed.", token, username: newUser.username });
    } else {
      throw new Error("Error creating token.")
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ err: error.message });
  }
};

exports.readUser = async (req, res) => {
  // returns the user's info, except the password
  console.log("Request recieved by readUser.");
  try {
    console.log("Retrieving user.");
    console.log(req.user);
    const user = { username: req.user.username, email: req.user.email }
    console.log("Removing password from user.");
    console.log(user);
    console.log("Sending response.");
    res.status(200).send({ msg: "Request processed.", user })
  } catch (error) {
    console.log(error);
    res.status(500).send({ err: error.message })
  }
}

exports.updateUser = async (req, res) => {
  // updates user info
  console.log("Request recieved by updateUser.");
  try {
    let result
    if (req.body.newPassword) {
      console.log("Patching password.");
      const newPassword = await bcrypt.hash(req.body.newPassword, 8)
      result = await User.updateOne({ username: req.user.username }, { password: newPassword })
    }
    if (req.body.newEmail) {
      console.log("Patching email.");
      result = await User.updateOne({ username: req.user.username }, { email: req.body.newEmail })
    }
    if (req.body.newUsername) {
      console.log("Patching username.");
      result = await User.updateOne({ username: req.user.username }, { username: req.body.newUsername })
    }
    console.log(result)
    res.status(200).send({ msg: "Request processed.", result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ err: error.message });
  }
}

exports.deleteUser = async (req, res) => {
  // deletes a user
  console.log("Request recieved deleteUser.");
  console.log(req.query);
  try {
    console.log(req.body);
    console.log(req.user.username);
    const result = await User.deleteOne({username: req.user.username});
    console.log(result)
    if (result.deletedCount === 1) {
      res.status(200).send({ msg: `User: ${req.user.username} deleted.` })
    } else {
      throw new Error("No user found.")
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ err: error.message });
  }
};

exports.addStock = async (req, res) => {
  // adds stocks to the user
  console.log("Request recieved by addStock.");
  try {
    let result
    if (req.user.stocks.some( x => JSON.parse(x).symbol === req.body.addStock.symbol )) { 
      // 1. if the new stock is in stocks, increment/decrement the quantity 
      console.log("Updating stocks.");
      const newStock = req.body.addStock
      const userStocks = req.user.stocks.map( el => JSON.parse(el))
      const updateStock = userStocks.find( el => el.symbol === newStock.symbol )
      updateStock.quantity = updateStock.quantity + newStock.quantity // update the quantity
      const updatedStocks = userStocks.map( el => el.symbol === newStock.symbol ? [ JSON.stringify(updateStock)] : [JSON.stringify(el)] )
      result = await User.updateOne({ username: req.user.username }, { stocks: updatedStocks })
      console.log(result)
      console.log(userStocks)
     } else { 
      // 2. otherwise push the new stock to stocks
      console.log("Adding new stock.");
      result = await User.updateOne({ username: req.user.username }, { $addToSet: { stocks : [JSON.stringify(req.body.addStock)] } })
      console.log(result);
     }
     if (!result) {
        throw new Error("Error adding stocks.")
     } else {
        res.status(200).send({ msg: "Request processed.", result });
     }
  } catch (error) {
    console.log(error);
    res.status(500).send({ err: error.message });
  }
}
