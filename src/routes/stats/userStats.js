const express = require("express");
const {
  getExpensesByUserMonthly,
  getIncomeByUserMonthly,
  getExpensesAllUsersMonthly,
  getIncomeAllUsersMonthly,
  getExpensesByUserWeekly,
  getExpensesByCategories
  
} = require("../../controllers/accountStatsCtrl/userStats");

const userStatsRoute = express.Router();

userStatsRoute.get("/expenses/:userId/weekly",getExpensesByUserWeekly);

userStatsRoute.get("/expenses/:userId/monthly", getExpensesByUserMonthly);
userStatsRoute.get("/income/:userId/monthly", getIncomeByUserMonthly);

userStatsRoute.get("/all-users-expenses/monthly", getExpensesAllUsersMonthly);
userStatsRoute.get("/all-users-income/monthly", getIncomeAllUsersMonthly);

userStatsRoute.get("/expenses-by-category", getExpensesByCategories);

module.exports = userStatsRoute;
