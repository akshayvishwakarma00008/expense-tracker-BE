const express = require("express");
const {
  createExpCtrl,
  fetchExpCtrl,
  fetchExpByIdCtrl,
  updataExpCtrl,
  deleteExpCtrl,
} = require("../../controllers/expenses/expenseCtrl");
const authMiddleware = require("../../middleware/authMiddleware");

const expenseRoute = express.Router();

expenseRoute.post("/", authMiddleware, createExpCtrl);
expenseRoute.get("/", authMiddleware, fetchExpCtrl);
expenseRoute.get("/:id", authMiddleware, fetchExpByIdCtrl);
expenseRoute.put("/:id", authMiddleware, updataExpCtrl);
expenseRoute.delete("/:id", authMiddleware, deleteExpCtrl);

module.exports = expenseRoute;
