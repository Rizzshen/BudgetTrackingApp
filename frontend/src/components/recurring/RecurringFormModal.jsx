import { useState } from "react";
import { X } from "lucide-react";
import { createRecurring, updateRecurring } from "../../api/recurring";
import { CATEGORIES } from "../../lib/constants";
import Input from "../ui/Input";
import Dropdown from "../ui/Dropdown";
import Button from "../ui/Button";
import { toast } from "../../store/toastStore";

const today = () => new Date().toISOString().slice(0, 10);

const RecurringFormModal = ({ item, onClose, onSaved }) => {
  const [form, setForm] = useState(
    item
      ? {
          title: item.title,
          amount: String(item.amount),
          category: item.category,
          type: item.type,
          frequency: item.frequency,
          nextDate: item.nextDate.slice(0, 10),
          notes: item.notes || "",
        }
      : {
          title: "",
          amount: "",
          category: CATEGORIES[0],
          type: "expense",
          frequency: "monthly",
          nextDate: today(),
          notes: "",
        },
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
      if (item) await updateRecurring(item._id, payload);
      else await createRecurring(payload);
      toast(item ? "Recurring updated" : "Recurring added");
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save recurring item.");
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
        className="w-full max-w-lg rounded-card border border-border bg-white p-6 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl">
            {item ? "Edit Recurring" : "New Recurring"}
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
            placeholder="e.g. Netflix / Salary"
            value={form.title}
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
            />
            <Input
              label="Next date"
              name="nextDate"
              type="date"
              required
              value={form.nextDate}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
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
            <Dropdown
              label="Frequency"
              value={form.frequency}
              onChange={(v) => setForm({ ...form, frequency: v })}
              options={[
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" },
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
              rows={2}
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
              {item ? "Save changes" : "Add recurring"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecurringFormModal;
