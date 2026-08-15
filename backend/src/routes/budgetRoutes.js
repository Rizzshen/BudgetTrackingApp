import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getBudgets,
  setBudget,
  deleteBudget,
} from "../controllers/budgetController.js";

const router = express.Router();

router.get("/", protect, getBudgets);
router.put("/:category", protect, setBudget);
router.delete("/:category", protect, deleteBudget);

export default router;