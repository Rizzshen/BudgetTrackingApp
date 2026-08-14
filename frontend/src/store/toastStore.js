import { create } from "zustand";

let nextId = 0;

export const useToastStore = create((set) => ({
  toasts: [],
  push: (message, type = "success") => {
    const id = ++nextId;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3500);
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// Call from anywhere without a hook
export const toast = (message, type = "success") =>
  useToastStore.getState().push(message, type);
