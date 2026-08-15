import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Wallet } from "lucide-react";
import { deleteBudget, getBudgets } from "../api/budgets";
import { CATEGORIES, formatCurrency } from "../lib/constants";
import Button from "../components/ui/Button";
import BudgetFormModal from "../components/budgets/BudgetsFormModal";
import { toast } from "../store/toastStore";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({ open: false, budget: null });
  const [confirmId, setConfirmId] = useState(null);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getBudgets();
      setBudgets(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load budgets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const availableCategories = CATEGORIES.filter(
    (c) => !budgets.some((b) => b.category === c),
  );

  const armDelete = (id) => {
    setConfirmId(id);
    setTimeout(() => setConfirmId((cur) => (cur === id ? null : cur)), 2500);
  };

  const handleDelete = async (category) => {
    try {
      await deleteBudget(category);
      setConfirmId(null);
      fetchBudgets();
      toast("Budget removed");
    } catch (err) {
      toast(err.response?.data?.message || "Failed to delete budget.", "error");
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
            <div className="h-5 w-24 animate-pulse rounded bg-border/70" />
            <div className="mt-4 h-4 w-32 animate-pulse rounded bg-border/70" />
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
          <h1 className="font-display text-3xl">Budgets</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Monthly limits per category.
          </p>
        </div>
        <Button
          onClick={() => setModal({ open: true, budget: null })}
          disabled={availableCategories.length === 0}
        >
          <Plus className="h-4 w-4" /> Set Budget
        </Button>
      </header>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}

      {budgets.length === 0 ? (
        <div className="rounded-card border border-border bg-white p-10 text-center shadow-card">
          <Wallet className="mx-auto h-8 w-8 text-sage" />
          <h2 className="mt-3 font-display text-lg">No budgets yet</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Set a monthly limit per category and keep yourself honest.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map((b) => {
            const pct = (b.spent / b.limit) * 100;
            const remaining = b.limit - b.spent;
            return (
              <div
                key={b._id}
                className="rounded-card border border-border bg-white p-5 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base">{b.category}</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setModal({ open: true, budget: b })}
                      title="Edit"
                      className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-border/60 hover:text-ink"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {confirmId === b._id ? (
                      <button
                        onClick={() => handleDelete(b.category)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                      >
                        Sure?
                      </button>
                    ) : (
                      <button
                        onClick={() => armDelete(b._id)}
                        title="Delete"
                        className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-sm text-ink-muted">
                  <span
                    className={`font-semibold ${pct >= 100 ? "text-red-600" : "text-ink"}`}
                  >
                    {formatCurrency(b.spent)}
                  </span>{" "}
                  of {formatCurrency(b.limit)}
                </p>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
                  <div
                    className={`h-full rounded-full ${
                      pct >= 100
                        ? "bg-red-600"
                        : pct >= 80
                          ? "bg-sage"
                          : "bg-sage-dark"
                    }`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>

                <p
                  className={`mt-2 text-xs ${remaining < 0 ? "font-medium text-red-600" : "text-ink-muted"}`}
                >
                  {remaining >= 0
                    ? `${formatCurrency(remaining)} left this month`
                    : `Over by ${formatCurrency(-remaining)}`}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {modal.open && (
        <BudgetFormModal
          key={modal.budget?.category ?? "new"}
          budget={modal.budget}
          availableCategories={availableCategories}
          onClose={() => setModal({ open: false, budget: null })}
          onSaved={fetchBudgets}
        />
      )}
    </div>
  );
};

export default Budgets;
