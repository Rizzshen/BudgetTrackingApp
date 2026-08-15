import Recurring from "../models/Recurring.js";
import Expense from "../models/Expense.js";

const advance = (date, frequency) => {
  const d = new Date(date);
  if (frequency === "weekly") d.setDate(d.getDate() + 7);
  else d.setMonth(d.getMonth() + 1);
  return d;
};

export const processDueRecurring = async () => {
  const now = new Date();
  const due = await Recurring.find({ active: true, nextDate: { $lte: now } });

  for (const r of due) {
    await Expense.create({
      user: r.user,
      title: r.title,
      amount: r.amount,
      category: r.category,
      type: r.type, // expense OR income
      date: r.nextDate,
      notes: "Recurring",
      recurring: true, // harmless if your Expense schema doesn't have this field yet
    });

    // Advance past any missed periods so it doesn't double-log next run
    let next = new Date(r.nextDate);
    while (next <= now) next = advance(next, r.frequency);
    r.nextDate = next;
    await r.save();
  }

  if (due.length > 0) {
    console.log(`⏰ Processed ${due.length} recurring item(s)`);
  }
};

export const startScheduler = () => {
  processDueRecurring(); // once on boot
  setInterval(processDueRecurring, 60 * 60 * 1000); // then hourly
};
