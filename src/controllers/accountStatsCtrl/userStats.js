const expressAsyncHandler = require('express-async-handler');
const Expense = require('../../model/Expense');
const Income = require('../../model/Income');
const mongoose = require('mongoose');


function getISOWeek(date) {
    const targetDate = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    targetDate.setDate(targetDate.getDate() - dayNr + 3);
    const firstThursday = targetDate.getDate();
    return Math.ceil(((targetDate - new Date(targetDate.getFullYear(), 0, 1)) / 86400000 + 1) / 7);
}

const getExpensesByUserWeekly = expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const year = req.query.year || new Date().getFullYear();

    const currentWeek = getISOWeek(new Date()); 

    const expensesStats = await Expense.aggregate([
        {
            $match: {
                user: mongoose.Types.ObjectId(userId),
                createdAt: {
                    $gte: new Date(`${year}-01-01T00:00:00Z`),
                    $lt: new Date(`${year}-12-31T23:59:59Z`),
                }
            }
        },
        {
            $addFields: {
                week: currentWeek  // Add week number
            }
        },
        {
            $group: {
                _id: "$week",
                totalExpenses: { $sum: "$amount" },
                details: {
                    $push: {
                        title: "$title",
                        amount: "$amount",
                        description: "$description",
                    }
                }
            }
        },
        {
            $sort: { "_id": 1 }
        }
    ])

    res.json(expensesStats);
});


const getExpensesByUserMonthly = expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const year = req.query.year || new Date().getFullYear();

    const expensesStats = await Expense.aggregate([
        {
            $match: {
                user: mongoose.Types.ObjectId(userId),
                createdAt: {
                    $gte: new Date(`${year}-01-01T00:00:00Z`),
                    $lt: new Date(`${year}-12-31T23:59:59Z`),
                }
            }
        },
        {
            $group: {
                _id: { month: { $month: "$createdAt" } },
                totalExpenses: { $sum: "$amount" },
                details: {
                    $push: {
                        title: "$title",
                        amount: "$amount",
                        description: "$description",
                    }
                }
            }
        },
        {
            $sort: { "_id.month": 1 }
        }
    ])

    res.json(expensesStats);
});

const getExpensesAllUsersMonthly = expressAsyncHandler(async (req, res) => {
    const year = req.query.year || new Date().getFullYear();

    const expensesStats = await Expense.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(`${year}-01-01T00:00:00Z`),
                    $lt: new Date(`${year}-12-31T23:59:59Z`),
                }
            }
        },
        {
            $group: {
                _id: { month: { $month: "$createdAt" } },
                totalExpenses: { $sum: "$amount" },
            }
        },
        {
            $sort: { "_id.month": 1 }
        }
    ])

    res.json(expensesStats);
});

const getIncomeByUserMonthly = expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const year = req.query.year || new Date().getFullYear();
    

    const expensesStats = await Income.aggregate([
        {
            $match: {
                user: mongoose.Types.ObjectId(userId),
                createdAt: {
                    $gte: new Date(`${year}-01-01T00:00:00Z`),
                    $lt: new Date(`${year}-12-31T23:59:59Z`),
                }
            }
        },
        {
            $group: {
                _id: { month: { $month: "$createdAt" } },
                totalIncome: { $sum: "$amount" },
                details: {
                    $push: {
                        title: "$title",
                        amount: "$amount",
                        description: "$description",
                    }
                }
            }
        },
        {
            $sort: { "_id.month": 1 }
        }
    ])

    res.json(expensesStats);
});

const getIncomeAllUsersMonthly = expressAsyncHandler(async (req, res) => {
    const year = req.query.year || new Date().getFullYear();

    const expensesStats = await Income.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(`${year}-01-01T00:00:00Z`),
                    $lt: new Date(`${year}-12-31T23:59:59Z`),
                }
            }
        },
        {
            $group: {
                _id: { month: { $month: "$createdAt" } },
                totalIncome: { $sum: "$amount" },
            }
        },
        {
            $sort: { "_id.month": 1 }
        }
    ])

    res.json(expensesStats);
});


module.exports = {
    getExpensesByUserMonthly,
    getIncomeByUserMonthly,
    getExpensesAllUsersMonthly,
    getIncomeAllUsersMonthly,
    getExpensesByUserWeekly
};