import mongoose from "mongoose";
import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";

// GET /api/budgets — limits + what's been spent this month
export const getBudgets = async (req, res) => {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  const [budgets, spentRows] = await Promise.all([
    Budget.find({ user: req.user._id }),
    Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
          type: "expense",
          date: { $gte: start, $lt: end },
        },
      },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]),
  ]);

  const spentBy = Object.fromEntries(spentRows.map((r) => [r._id, r.total]));

  res.json(
    budgets.map((b) => ({
      _id: b._id,
      category: b.category,
      limit: b.limit,
      spent: spentBy[b.category] || 0,
    })),
  );
};

// PUT /api/budgets/:category — create or update
export const setBudget = async (req, res) => {
  const { limit } = req.body;
  if (!limit || limit <= 0) {
    return res.status(400).json({ message: "Limit must be a positive number" });
  }

  const budget = await Budget.findOneAndUpdate(
    { user: req.user._id, category: req.params.category },
    { user: req.user._id, category: req.params.category, limit },
    { new: true, upsert: true, runValidators: true },
  );

  res.json(budget);
};

// DELETE /api/budgets/:category
export const deleteBudget = async (req, res) => {
  await Budget.findOneAndDelete({
    user: req.user._id,
    category: req.params.category,
  });
  res.json({ message: "Budget removed" });
};
