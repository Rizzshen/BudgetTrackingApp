import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getRecurring,
  createRecurring,
  updateRecurring,
  deleteRecurring,
} from "../controllers/recurringController.js";

const router = express.Router();

router.get("/", protect, getRecurring);
router.post("/", protect, createRecurring);
router.put("/:id", protect, updateRecurring);
router.delete("/:id", protect, deleteRecurring);

export default router;
