import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import expenseRoutes from "./routes/expenseRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/expenses", expenseRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running 🎉" });
});
app.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});
app.use("/api/auth", authRoutes);

export default app;
