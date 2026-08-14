import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { CATEGORIES } from "../../lib/constants";
import { createExpense, updateExpense } from "../../api/expenses";

const empty = {
  title: "",
  amount: "",
  category: "Food",
  type: "expense",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
};

export default function ExpenseFormModal({ open, onClose, onSaved, editing }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title,
        amount: editing.amount,
        category: editing.category,
        type: editing.type,
        date: editing.date?.slice(0, 10),
        notes: editing.notes || "",
      });
    } else {
      setForm(empty);
    }
  }, [editing, open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (editing) {
        await updateExpense(editing._id, payload);
      } else {
        await createExpense(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-card shadow-card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl">{editing ? "Edit entry" : "Add entry"}</h2>
          <button onClick={onClose} className="text-ink-muted hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            {["expense", "income"].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setForm({ ...form, type: t })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  form.type === t
                    ? "bg-sage text-white"
                    : "bg-sage-light/50 text-ink-muted"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div>
            <label className="text-sm text-ink-muted mb-1 block">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-ink/10 focus:outline-none focus:ring-2 focus:ring-sage/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-ink-muted mb-1 block">Amount</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-ink/10 focus:outline-none focus:ring-2 focus:ring-sage/40"
              />
            </div>
            <div>
              <label className="text-sm text-ink-muted mb-1 block">Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-ink/10 focus:outline-none focus:ring-2 focus:ring-sage/40"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-ink-muted mb-1 block">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-ink/10 focus:outline-none focus:ring-2 focus:ring-sage/40 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-ink-muted mb-1 block">Notes (optional)</label>
            <input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-ink/10 focus:outline-none focus:ring-2 focus:ring-sage/40"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-sage text-white py-2.5 rounded-lg font-medium hover:bg-sage/90 transition-colors disabled:opacity-60"
          >
            {saving ? "Saving..." : editing ? "Save changes" : "Add entry"}
          </button>
        </form>
      </div>
    </div>
  );
}