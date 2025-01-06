const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
//schema
const incomeSchema = mongoose.Schema(
  {
    title: {
      required: [true, "title is required"],
      type: String,
    },
    description: {
      required: [true, "description is required"],
      type: String,
    },
    type: {
      type: String,
      default: "income",
    },
    amount: {
      required: [true, "amount is required"],
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

//pagination
incomeSchema.plugin(mongoosePaginate);

//instance of Income
const Income = mongoose.model("Income", incomeSchema);
module.exports = Income;

//--useful comments --
//user field
//add user field as Incom is associated with user i.e 1-m relatin
