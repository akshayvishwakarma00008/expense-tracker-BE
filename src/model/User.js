const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
//schema
const userSchema = mongoose.Schema(
  {
    firstname: {
      required: [true, "first name is required"],
      type: String,
    },
    lastname: {
      required: [true, "last name is required"],
      type: String,
    },
    email: {
      required: [true, "email is required"],
      type: String,
    },
    password: {
      required: [true, "password is required"],
      type: String,
    },
    admin: {
      default: false,
      type: Boolean,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

//these methods are responsible to populate data of
//expenses and income in profile
//virtual method to populate created post
userSchema.virtual("expenses", {
  ref: "Expense",
  foreignField: "user",
  localField: "_id",
});

//virtual method to populate created post
userSchema.virtual("income", {
  ref: "Income",
  foreignField: "user",
  localField: "_id",
});

//Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//verifying and matching the password by dcrypting it
userSchema.methods.isPasswordMatch = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//compile scheme to model
const User = mongoose.model("User", userSchema);
module.exports = User;

//----useful--comments---
//the userSchema.pre will be called before the schema is compiled
//the hash password block will hash the by using bcrypt for security purpose.
//i.e before const User
