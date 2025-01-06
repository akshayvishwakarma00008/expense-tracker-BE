const User = require("../../model/User");
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../../middleware/generateToken");

//register
const registerUserCtrl = expressAsyncHandler(async (req, res) => {
  const { email, firstname, lastname, password } = req?.body; //getting data from the body and refactoring it
  //cheeck if user exist
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) throw new Error("User already exists");
  try {
    const user = await User.create({ email, firstname, lastname, password });
    res.status(200).json(user);
  } catch (error) {
    res.json(error);
  }
});

//fetch all users
const fetchUsersCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

//login controller
const loginUserCtrl = expressAsyncHandler(async (req, res) => {
  const { email, password } = req?.body;
  //find user in the DB
  const userFound = await User.findOne({ email });
  //check if the user password match
  if (userFound && (await userFound?.isPasswordMatch(password))) {
    res.json({
      _id: userFound?._id,
      firstname: userFound?.firstname,
      lastname: userFound?.lastname,
      email: userFound?.email,
      isAdmin: userFound?.admin,
      token: generateToken(userFound?._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid login credentials");
  }
});

module.exports = { registerUserCtrl, fetchUsersCtrl, loginUserCtrl };


//--useful comments--

//dont ever throw any error in the try and catch so to avoid this I have used expressAsyncHandler and hence userExists  code is out of try&catch
//the code for custom error has been written in errorMiddleware
//the problem with try and catch is that if you write it inside try, it will give you no feed back.

//--login--controller--
//this controller is for loging user int0 the system
//Authentication---
//first check if the user exist, if user exist and the password matches -- as password is encrypted so first need to decrypt it.
//to decrypt we are passing it to custom made function isPasswordMatch() which uses some bcrypt functionality to decrypt it.
//if both are true then we are returing some data as a response.
//if either userFound is NULL or password doesnt matches then we are returning response status as 401 and throwing some custom error.
//Authorisation
//also if user is found and has valid credentials then we are are also generating a token using JWT token to keep track of logged in user.
//and also to tell the server that the user is a authorised user. --