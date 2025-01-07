const express = require("express");
const {
  registerUserCtrl,
  fetchUsersCtrl,
  loginUserCtrl,
  userProfileCtrl,
  fetchUserDetailsCtrl
} = require("../../controllers/users/usersController");

const authMiddleware = require("../../middleware/authMiddleware");
const userRoute = express.Router();

userRoute.post("/register", registerUserCtrl);
userRoute.post("/login", loginUserCtrl);
userRoute.get("/users", fetchUsersCtrl);
userRoute.get("/profile", authMiddleware, userProfileCtrl);
userRoute.get("/:id", fetchUserDetailsCtrl);

module.exports = userRoute;
