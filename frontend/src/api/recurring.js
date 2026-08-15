import api from "./axios";

export const getRecurring = () => api.get("/recurring");

export const createRecurring = (data) => api.post("/recurring", data);

export const updateRecurring = (id, data) => api.put(`/recurring/${id}`, data);

export const deleteRecurring = (id) => api.delete(`/recurring/${id}`);