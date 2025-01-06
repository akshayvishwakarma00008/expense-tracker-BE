const express = require("express");
const {
  createIncCtrl,
  fetchIncCtrl,
  fetchIncByIdCtrl,
  updataIncCtrl,
  deleteIncCtrl,
} = require("../../controllers/income/incomeCtrl");
const authMiddleware = require("../../middleware/authMiddleware");

const incomeRoute = express.Router();

incomeRoute.post("/", authMiddleware, createIncCtrl);
incomeRoute.get("/", authMiddleware, fetchIncCtrl);
incomeRoute.get("/:id", authMiddleware, fetchIncByIdCtrl);
incomeRoute.put("/:id", authMiddleware, updataIncCtrl);
incomeRoute.delete("/:id", authMiddleware, deleteIncCtrl);

module.exports = incomeRoute;

//--imp notes
//the authmiddleware passed simply means that before creating a income the user should be authorised 
//and also logged in 