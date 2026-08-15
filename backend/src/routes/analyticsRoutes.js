import express from "express";
import { getSummary, getDaily } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/summary", protect, getSummary);
router.get("/daily", protect, getDaily);

export default router;
