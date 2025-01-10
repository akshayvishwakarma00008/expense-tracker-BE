const User = require("../../model/User");
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../../middleware/generateToken");
const validateMongodbId = require("../../utils/validateMongodbID");

//register
const registerUserCtrl = expressAsyncHandler(async (req, res) => {
  const { email, firstname, lastname, password } = req?.body; //getting data from the body and refactoring it
  //cheeck if user exist
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) throw new Error("User already exists");
  try {
    const user = await User.create({ email, firstname, lastname, password });
    res.status(200).json({
      _id:user?._id,
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email,
      isAdmin: user?.admin,
      token: generateToken(user?._id),
    });
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

//profile
const userProfileCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req?.user;

  try {
    const myProfile = await User.findById(_id).populate(["expenses", "income"]);
    res.json(myProfile);
  } catch (error) {
    res.json(error);
  }
});

//----------------
//user details
//----------------
const fetchUserDetailsCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //check if user id is valid
  validateMongodbId(id);
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//Update profile
//------------------------------
const updateUserCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req?.user;
  validateMongodbId(_id);
  const user = await User.findByIdAndUpdate(
    _id,
    {
      firstname: req?.body?.firstname,
      lastname: req?.body?.lastname,
      email: req?.body?.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.json(user);
});

//------------------------------
//Update password
//------------------------------

const updateUserPasswordCtrl = expressAsyncHandler(async (req, res) => {
  //destructure the login user
  const { _id } = req.user;
  const { password } = req.body;
  validateMongodbId(_id);
  //Find the user by _id
  const user = await User.findById(_id);

  if (password) {
    user.password = password;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.json(user);
  }
});

//------------------------------
//Delete user
//------------------------------
const deleteUsersCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //check if user id is valid
  validateMongodbId(id);
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  registerUserCtrl,
  fetchUsersCtrl,
  loginUserCtrl,
  userProfileCtrl,
  fetchUserDetailsCtrl,
  deleteUsersCtrl,
  updateUserCtrl,
  updateUserPasswordCtrl,
};

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
