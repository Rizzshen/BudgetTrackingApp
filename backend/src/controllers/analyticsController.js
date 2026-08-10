import mongoose from "mongoose";
import Expense from "../models/Expense.js";

// @desc   Get spending summary: totals by category + monthly trend
// @route  GET /api/analytics/summary
export const getSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Optional: limit to a date range via query params, default = last 6 months
    const monthsBack = parseInt(req.query.months) || 6;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsBack);

    // 1. Total spending by category (expenses only, not income)
    const byCategory = await Expense.aggregate([
      {
        $match: {
          user: userId,
          type: "expense",
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // 2. Monthly spending trend (for line/bar charts)
    const monthlyTrend = await Expense.aggregate([
      {
        $match: {
          user: userId,
          type: "expense",
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // 3. Overall totals (expense vs income, net balance)
    const totals = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalExpense = totals.find((t) => t._id === "expense")?.total || 0;
    const totalIncome = totals.find((t) => t._id === "income")?.total || 0;

    res.json({
      byCategory,
      monthlyTrend,
      totalExpense,
      totalIncome,
      balance: totalIncome - totalExpense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
