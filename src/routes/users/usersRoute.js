const express = require("express");
const {
  registerUserCtrl,
  fetchUsersCtrl,
  loginUserCtrl,
  userProfileCtrl,
  fetchUserDetailsCtrl,
  updateUserCtrl,
  updateUserPasswordCtrl,
  deleteUsersCtrl
} = require("../../controllers/users/usersController");

const authMiddleware = require("../../middleware/authMiddleware");
const userRoute = express.Router();

userRoute.post("/register", registerUserCtrl);
userRoute.post("/login", loginUserCtrl);
userRoute.get("/users", fetchUsersCtrl);
userRoute.get("/profile", authMiddleware, userProfileCtrl);
userRoute.get("/:id", fetchUserDetailsCtrl);
userRoute.put("/:id", authMiddleware, updateUserCtrl);
userRoute.delete("/:id", deleteUsersCtrl);

module.exports = userRoute;
