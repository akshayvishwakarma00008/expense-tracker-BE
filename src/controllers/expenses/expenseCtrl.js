const Expense = require("../../model/Expense");
const expressAsyncHandler = require("express-async-handler");

//create
const createExpCtrl = expressAsyncHandler(async (req, res) => {
  const { title, amount, description} = req?.body;
  try {
    const expense = await Expense.crseate({
      title,
      amount,
      description,
      user:req?.user?._id,
    });
    res.json(expense);
  } catch (error) {
    res.json(error);
  }
});

//fetch all expense
const fetchExpCtrl = expressAsyncHandler(async (req, res) => {
  const { page } = req.query; //taking page number as a query parameter i.e anything after ? =>api/income?page=3
  try {
    const expense = await Expense.paginate(
      {},
      { limit: 10, page: Number(page), populate: "user" } //here populate field will return details of user who has created the expense
    );
    res.json(expense);
  } catch (error) {
    res.json(error);
  }
});

//fetch expense by id
const fetchExpByIdCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  try {
    const expense = await Expense.findById(id);
    res.json(expense);
  } catch (error) {
    res.json("expense doesnt exist...add new one.");
  }
});

//update expense
const updataExpCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  const { title, amount, description } = req?.body;
  try {
    const expense = await Expense.findByIdAndUpdate(
      id,
      { title, amount, description },
      { new: true }
    );
    res.json(expense);
  } catch (error) {
    res.json(error);
  }
});

//delete
const deleteExpCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  try {
    const expense = await Expense.findByIdAndDelete(id);
    res.json(expense);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createExpCtrl,
  fetchExpCtrl,
  fetchExpByIdCtrl,
  updataExpCtrl,
  deleteExpCtrl,
};
