import mongoose from "mongoose";
import Expense from "../models/Expense.js";
import { generateInsights } from "../utils/aiClient.js";

// @desc   Get AI-generated savings insights
// @route  GET /api/ai/insights
export const getInsights = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3); // last 3 months for AI context

    const byCategory = await Expense.aggregate([
      { $match: { user: userId, type: "expense", date: { $gte: startDate } } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const monthlyTrend = await Expense.aggregate([
      { $match: { user: userId, type: "expense", date: { $gte: startDate } } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    if (byCategory.length === 0) {
      return res.status(400).json({
        message:
          "Not enough expense data yet to generate insights. Add a few expenses first.",
      });
    }

    const totals = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]);

    const totalExpense = totals.find((t) => t._id === "expense")?.total || 0;
    const totalIncome = totals.find((t) => t._id === "income")?.total || 0;

    const insights = await generateInsights({
      byCategory,
      monthlyTrend,
      totalExpense,
      totalIncome,
      balance: totalIncome - totalExpense,
    });

    res.json(insights);
  } catch (error) {
    console.error("AI Insights Error:", error.message);
    res
      .status(500)
      .json({ message: "Failed to generate insights. Please try again." });
  }
};
