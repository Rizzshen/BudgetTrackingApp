import { useState } from "react";
import { X } from "lucide-react";
import { contributeToGoal } from "../../api/goals";
import { formatCurrency } from "../../lib/constants";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { toast } from "../../store/toastStore";

const ContributeModal = ({ goal, onClose, onSaved }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await contributeToGoal(goal._id, parseFloat(amount));
      toast(`Added to “${goal.name}”`);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to contribute.");
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
          <h2 className="font-display text-xl">Add money</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-ink-muted hover:bg-border/60 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-4 text-sm text-ink-muted">
          <span className="font-semibold text-ink">
            {formatCurrency(goal.saved)}
          </span>{" "}
          saved of {formatCurrency(goal.target)} — every bit counts.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
              {error}
            </p>
          )}
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="e.g. 50"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Add money
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributeModal;
