import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Food",
        "Transport",
        "Housing",
        "Utilities",
        "Entertainment",
        "Health",
        "Shopping",
        "Education",
        "Other",
      ],
    },
    type: {
      type: String,
      enum: ["expense", "income"],
      default: "expense",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries when filtering by user + date range (common pattern)
expenseSchema.index({ user: 1, date: -1 });

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;