import Goal from "../models/Goal.js";

// GET /api/goals
export const getGoals = async (req, res) => {
  const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(goals);
};

// POST /api/goals
export const createGoal = async (req, res) => {
  const { name, target, deadline } = req.body;
  if (!name || !target || target <= 0) {
    return res
      .status(400)
      .json({ message: "Name and a positive target are required" });
  }

  const goal = await Goal.create({
    user: req.user._id,
    name,
    target,
    deadline: deadline || undefined,
  });

  res.status(201).json(goal);
};

// PUT /api/goals/:id
export const updateGoal = async (req, res) => {
  const { name, target, deadline } = req.body;
  const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
  if (!goal) return res.status(404).json({ message: "Goal not found" });

  if (name !== undefined) goal.name = name;
  if (target !== undefined) {
    if (target <= 0)
      return res.status(400).json({ message: "Target must be positive" });
    goal.target = target;
  }
  if (deadline !== undefined) goal.deadline = deadline || null;

  await goal.save();
  res.json(goal);
};

// POST /api/goals/:id/contribute
export const contribute = async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res
      .status(400)
      .json({ message: "Amount must be a positive number" });
  }

  const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
  if (!goal) return res.status(404).json({ message: "Goal not found" });

  goal.saved += amount;
  await goal.save();
  res.json(goal);
};

// DELETE /api/goals/:id
export const deleteGoal = async (req, res) => {
  const goal = await Goal.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!goal) return res.status(404).json({ message: "Goal not found" });
  res.json({ message: "Goal removed" });
};
