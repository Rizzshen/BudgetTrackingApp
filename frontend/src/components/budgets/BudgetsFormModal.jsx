import { useState } from "react";
import { X } from "lucide-react";
import { setBudget } from "../../api/budgets";
import Input from "../ui/Input";
import Dropdown from "../ui/Dropdown";
import Button from "../ui/Button";
import { toast } from "../../store/toastStore";

const BudgetFormModal = ({ budget, availableCategories, onClose, onSaved }) => {
  const [category, setCategory] = useState(
    budget?.category || availableCategories[0] || "",
  );
  const [limit, setLimit] = useState(budget ? String(budget.limit) : "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await setBudget(category, parseFloat(limit));
      toast("Budget saved");
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save budget.");
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
        className="w-full max-w-sm rounded-card border border-border bg-white p-6 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl">
            {budget ? `Edit ${budget.category}` : "Set a Budget"}
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

          {!budget && (
            <Dropdown
              label="Category"
              value={category}
              onChange={setCategory}
              options={availableCategories}
            />
          )}

          <Input
            label="Monthly limit"
            type="number"
            step="0.01"
            min="1"
            required
            placeholder="e.g. 300"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {budget ? "Save changes" : "Set budget"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetFormModal;
