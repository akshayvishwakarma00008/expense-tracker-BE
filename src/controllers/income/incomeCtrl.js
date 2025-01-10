const Income = require("../../model/Income");
const expressAsyncHandler = require("express-async-handler");

//create
const createIncCtrl = expressAsyncHandler(async (req, res) => {
  const { title, amount, description } = req?.body;
  try {
    const income = await Income.create({
      title,
      amount,
      description,
      user:req?.user?._id,
    });
    res.json(income);
  } catch (error) {
    res.json(error);
  }
});
//fetch all income
const fetchIncCtrl = expressAsyncHandler(async (req, res) => {
  const { page } = req.query; //taking page number as a query parameter i.e anything after ? =>api/income?page=3
  try {
    const income = await Income.paginate({}, { limit: 10, page: Number(page),populate:"user"});
    res.json(income);
  } catch (error) {
    res.json(error);
  }
});

//fetch Income by id
const fetchIncByIdCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  try {
    const income = await Income.findById(id);
    res.json(income);
  } catch (error) {
    res.json("income doesnt exist...add new one.");
  }
});

//update Income
const updataIncCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  const { title, amount, description } = req?.body;
  try {
    const income = await Income.findByIdAndUpdate(
      id,
      { title, amount, description },
      { new: true }
    );
    res.json(income);
  } catch (error) {
    res.json(error);
  }
});

//delete
const deleteIncCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  try {
    const income = await Income.findByIdAndDelete(id);
    res.json(income);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createIncCtrl,
  fetchIncCtrl,
  fetchIncByIdCtrl,
  updataIncCtrl,
  deleteIncCtrl,
};
