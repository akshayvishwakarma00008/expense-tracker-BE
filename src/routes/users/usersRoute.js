const express = require("express");
const { registerUserCtrl,fetchUsersCtrl,loginUserCtrl} = require("../../controllers/users/usersController");



const userRoute = express.Router();

userRoute.post("/register", registerUserCtrl);
userRoute.post("/login", loginUserCtrl);
userRoute.get("/users", fetchUsersCtrl);

module.exports = userRoute;
