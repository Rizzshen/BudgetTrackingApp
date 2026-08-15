import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getGoals,
  createGoal,
  updateGoal,
  contribute,
  deleteGoal,
} from "../controllers/goalController.js";

const router = express.Router();

router.get("/", protect, getGoals);
router.post("/", protect, createGoal);
router.put("/:id", protect, updateGoal);
router.post("/:id/contribute", protect, contribute);
router.delete("/:id", protect, deleteGoal);

export default router;
