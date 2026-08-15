import api from "./axios";

// Expenses CRUD
export const getExpenses = (params) => api.get("/expenses", { params });

export const getExpense = (id) => api.get(`/expenses/${id}`);

export const createExpense = (data) => api.post("/expenses", data);

export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);

export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

export const getAnalyticsDaily = (params) =>
  api.get("/analytics/daily", { params });

// Analytics
export const getAnalyticsSummary = (params) =>
  api.get("/analytics/summary", { params });

// AI Insights
export const getAiInsights = () => api.get("/ai/insights");
