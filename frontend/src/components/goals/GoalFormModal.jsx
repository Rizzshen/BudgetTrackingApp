import { useState } from "react";
import { X } from "lucide-react";
import { createGoal, updateGoal } from "../../api/goals";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { toast } from "../../store/toastStore";

const GoalFormModal = ({ goal, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: goal?.name || "",
    target: goal ? String(goal.target) : "",
    deadline: goal?.deadline ? goal.deadline.slice(0, 10) : "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      name: form.name,
      target: parseFloat(form.target),
      deadline: form.deadline || undefined,
    };
    try {
      if (goal) await updateGoal(goal._id, payload);
      else await createGoal(payload);
      toast(goal ? "Goal updated" : "Goal created");
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save goal.");
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
            {goal ? "Edit Goal" : "New Goal"}
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
            label="Name"
            name="name"
            required
            placeholder="e.g. Emergency fund"
            value={form.name}
            onChange={handleChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Target"
              name="target"
              type="number"
              step="0.01"
              min="1"
              required
              placeholder="0.00"
              value={form.target}
              onChange={handleChange}
            />
            <Input
              label="Deadline"
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {goal ? "Save changes" : "Create goal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalFormModal;
