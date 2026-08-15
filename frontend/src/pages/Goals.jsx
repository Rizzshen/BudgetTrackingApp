import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Target, Trash2 } from "lucide-react";
import { deleteGoal, getGoals } from "../api/goals";
import { formatCurrency } from "../lib/constants";
import Button from "../components/ui/Button";
import GoalFormModal from "../components/goals/GoalFormModal";
import ContributeModal from "../components/goals/ContributeModal";
import { toast } from "../store/toastStore";

const deadlineInfo = (iso) => {
  const days = Math.ceil((new Date(iso) - new Date()) / 86400000);
  if (days < 0)
    return { label: `${-days} days overdue`, cls: "font-medium text-red-600" };
  if (days === 0)
    return { label: "Due today", cls: "font-medium text-sage-dark" };
  return { label: `${days} days left`, cls: "text-ink-muted" };
};

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formModal, setFormModal] = useState({ open: false, goal: null });
  const [contributeModal, setContributeModal] = useState({
    open: false,
    goal: null,
  });
  const [confirmId, setConfirmId] = useState(null);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getGoals();
      setGoals(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load goals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const armDelete = (id) => {
    setConfirmId(id);
    setTimeout(() => setConfirmId((cur) => (cur === id ? null : cur)), 2500);
  };

  const handleDelete = async (id) => {
    try {
      await deleteGoal(id);
      setConfirmId(null);
      fetchGoals();
      toast("Goal removed");
    } catch (err) {
      toast(err.response?.data?.message || "Failed to delete goal.", "error");
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-card border border-border bg-white p-5 shadow-card"
          >
            <div className="h-5 w-32 animate-pulse rounded bg-border/70" />
            <div className="mt-4 h-4 w-24 animate-pulse rounded bg-border/70" />
            <div className="mt-3 h-2 w-full animate-pulse rounded-full bg-border/70" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Goals</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Small choices today, big freedom tomorrow.
          </p>
        </div>
        <Button onClick={() => setFormModal({ open: true, goal: null })}>
          <Plus className="h-4 w-4" /> New Goal
        </Button>
      </header>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}

      {goals.length === 0 ? (
        <div className="rounded-card border border-border bg-white p-10 text-center shadow-card">
          <Target className="mx-auto h-8 w-8 text-sage" />
          <h2 className="mt-3 font-display text-lg">No goals yet</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Create your first savings goal and start chipping away at it.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((g) => {
            const pct = Math.min((g.saved / g.target) * 100, 100);
            const reached = g.saved >= g.target;
            const dl = g.deadline ? deadlineInfo(g.deadline) : null;
            return (
              <div
                key={g._id}
                className="flex flex-col rounded-card border border-border bg-white p-5 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base">{g.name}</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setFormModal({ open: true, goal: g })}
                      title="Edit"
                      className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-border/60 hover:text-ink"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {confirmId === g._id ? (
                      <button
                        onClick={() => handleDelete(g._id)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                      >
                        Sure?
                      </button>
                    ) : (
                      <button
                        onClick={() => armDelete(g._id)}
                        title="Delete"
                        className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-sm text-ink-muted">
                  <span className="font-semibold text-ink">
                    {formatCurrency(g.saved)}
                  </span>{" "}
                  of {formatCurrency(g.target)}
                </p>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-sage-dark"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-xs">
                  <span
                    className={
                      reached ? "font-medium text-sage-dark" : "text-ink-muted"
                    }
                  >
                    {reached
                      ? "Goal reached!"
                      : `${Math.round((g.saved / g.target) * 100)}%`}
                  </span>
                  {dl && <span className={dl.cls}>{dl.label}</span>}
                </div>

                <Button
                  variant="secondary"
                  className="mt-4 w-full"
                  onClick={() => setContributeModal({ open: true, goal: g })}
                >
                  Add money
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {formModal.open && (
        <GoalFormModal
          key={formModal.goal?._id ?? "new"}
          goal={formModal.goal}
          onClose={() => setFormModal({ open: false, goal: null })}
          onSaved={fetchGoals}
        />
      )}

      {contributeModal.open && (
        <ContributeModal
          key={contributeModal.goal?._id ?? "new"}
          goal={contributeModal.goal}
          onClose={() => setContributeModal({ open: false, goal: null })}
          onSaved={fetchGoals}
        />
      )}
    </div>
  );
};

export default Goals;
