import api from "./axios";

export const getBudgets = () => api.get("/budgets");

export const setBudget = (category, limit) =>
  api.put(`/budgets/${category}`, { limit });

export const deleteBudget = (category) => api.delete(`/budgets/${category}`);
