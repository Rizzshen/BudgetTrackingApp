import mongoose from "mongoose";

const CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Utilities",
  "Entertainment",
  "Health",
  "Shopping",
  "Education",
  "Other",
];

const recurringSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0.01 },
    category: { type: String, required: true, enum: CATEGORIES },
    type: { type: String, enum: ["expense", "income"], default: "expense" },
    frequency: {
      type: String,
      enum: ["weekly", "monthly"],
      default: "monthly",
    },
    nextDate: { type: Date, required: true },
    active: { type: Boolean, default: true },
    notes: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Recurring", recurringSchema);
