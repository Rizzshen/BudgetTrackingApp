import { useState } from "react";
import { X } from "lucide-react";
import { createExpense, updateExpense } from "../../api/expenses";
import { CATEGORIES } from "../../lib/constants";
import Input from "../ui/Input";
import Dropdown from "../ui/Dropdown";
import Button from "../ui/Button";
import { toast } from "../../store/toastStore";

const today = () => new Date().toISOString().slice(0, 10);

const defaultForm = {
  title: "",
  amount: "",
  category: CATEGORIES[0],
  type: "expense",
  date: today(),
  notes: "",
};

const ExpenseFormModal = ({ expense, onClose, onSaved }) => {
  // Fresh mount every time it opens → state is always correct
  const [form, setForm] = useState(() =>
    expense
      ? {
          title: expense.title,
          amount: String(expense.amount),
          category: expense.category,
          type: expense.type,
          date: expense.date.slice(0, 10),
          notes: expense.notes || "",
        }
      : { ...defaultForm, date: today() },
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = { ...form, amount: parseFloat(form.amount) };
    try {
      if (expense) {
        await updateExpense(expense._id, payload);
      } else {
        await createExpense(payload);
      }
      onSaved();
      onClose();
      toast(expense ? "Changes Saved" : "Expense Added");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save expense.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-sidebar/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-card border border-border bg-white p-6 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl">
            {expense ? "Edit Expense" : "Add Expense"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-ink-muted hover:bg-border/60 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
              {error}
            </p>
          )}

          <Input
            label="Title"
            name="title"
            required
            placeholder="e.g. Groceries"
            value={form.title}
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
            />
            <Input
              label="Date"
              name="date"
              type="date"
              required
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Dropdown
              label="Category"
              value={form.category}
              onChange={(v) => setForm({ ...form, category: v })}
              options={CATEGORIES}
            />
            <Dropdown
              label="Type"
              value={form.type}
              onChange={(v) => setForm({ ...form, type: v })}
              options={[
                { value: "expense", label: "Expense" },
                { value: "income", label: "Income" },
              ]}
            />
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">
              Notes{" "}
              <span className="font-normal text-ink-muted">(optional)</span>
            </span>
            <textarea
              name="notes"
              rows={3}
              placeholder="Anything to remember…"
              value={form.notes}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-cream/50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/20"
            />
          </label>

          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {expense ? "Save changes" : "Add expense"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseFormModal;
