const expressAsyncHandler = require("express-async-handler");
const Expense = require("../../model/Expense");
const Income = require("../../model/Income");
const mongoose = require("mongoose");

function getISOWeek(date) {
    const targetDate = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    targetDate.setDate(targetDate.getDate() - dayNr + 3);
    const firstThursday = targetDate.getDate();
    return Math.ceil(
        ((targetDate - new Date(targetDate.getFullYear(), 0, 1)) / 86400000 + 1) / 7
    );
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
                },
            },
        },
        {
            $addFields: {
                week: currentWeek, // Add week number
            },
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
                    },
                },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);

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
                },
            },
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
                    },
                },
            },
        },
        {
            $sort: { "_id.month": 1 },
        },
    ]);

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
                },
            },
        },
        {
            $group: {
                _id: { month: { $month: "$createdAt" } },
                totalExpenses: { $sum: "$amount" },
            },
        },
        {
            $sort: { "_id.month": 1 },
        },
    ]);

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
                },
            },
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
                    },
                },
            },
        },
        {
            $sort: { "_id.month": 1 },
        },
    ]);

    res.json(expensesStats);
});

const getIncomeAllUsersMonthly = expressAsyncHandler(async (req, res) => {
    const { userId } = req.params
    const year = req.query.year || new Date().getFullYear();

    const expensesStats = await Income.aggregate([
        {
            $match: {
                createdAt: {
                    user: mongoose.Types.ObjectId(userId),
                    $gte: new Date(`${year}-01-01T00:00:00Z`),
                    $lt: new Date(`${year}-12-31T23:59:59Z`),
                },
            },
        },
        {
            $group: {
                _id: { month: { $month: "$createdAt" } },
                totalIncome: { $sum: "$amount" },
            },
        },
        {
            $sort: { "_id.month": 1 },
        },
    ]);

    res.json(expensesStats);
});

const getExpensesByCategories = expressAsyncHandler(async (req, res) => {
    const now = new Date();
    // Get month and year from request query, default to the current month/year
    const year = req.query.year || now.getFullYear();
    const month = req.query.month || now.getMonth() + 1;

    // Define the start and end of the requested month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    try {
        const expenseByMonth = await Expense.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfMonth, 
                        $lte: endOfMonth, 
                    },
                },
            },
            {
                $group: {
                    _id: "$category", 
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }, 
                },
            },
            {
                $project: {
                    _id: 0, 
                    category: "$_id", 
                    totalAmount: 1, 
                    count: 1, 
                },
            },
            {
                $sort: { totalAmount: -1 }, 
            },
        ]);

        res.status(200).json({
            success: true,
            data: expenseByMonth,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = {
    getExpensesByUserMonthly,
    getIncomeByUserMonthly,
    getExpensesAllUsersMonthly,
    getIncomeAllUsersMonthly,
    getExpensesByUserWeekly,
    getExpensesByCategories,
};
