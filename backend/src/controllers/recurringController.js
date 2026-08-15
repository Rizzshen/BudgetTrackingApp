import Recurring from "../models/Recurring.js";

// GET /api/recurring
export const getRecurring = async (req, res) => {
  const items = await Recurring.find({ user: req.user._id }).sort({
    nextDate: 1,
  });
  res.json(items);
};

// POST /api/recurring
export const createRecurring = async (req, res) => {
  const { title, amount, category, type, frequency, nextDate, notes } =
    req.body;
  if (!title || !amount || amount <= 0 || !category || !nextDate) {
    return res.status(400).json({
      message: "Title, amount, category and next date are required",
    });
  }

  const item = await Recurring.create({
    user: req.user._id,
    title,
    amount,
    category,
    type,
    frequency,
    nextDate,
    notes,
  });

  res.status(201).json(item);
};

// PUT /api/recurring/:id — partial update (also used to pause/resume)
export const updateRecurring = async (req, res) => {
  const item = await Recurring.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!item)
    return res.status(404).json({ message: "Recurring item not found" });

  const fields = [
    "title",
    "amount",
    "category",
    "type",
    "frequency",
    "nextDate",
    "notes",
    "active",
  ];
  for (const f of fields) {
    if (req.body[f] !== undefined) item[f] = req.body[f];
  }

  await item.save();
  res.json(item);
};

// DELETE /api/recurring/:id
export const deleteRecurring = async (req, res) => {
  const item = await Recurring.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!item)
    return res.status(404).json({ message: "Recurring item not found" });
  res.json({ message: "Recurring item removed" });
};
