import { useCallback, useEffect, useState } from "react";
import { Pause, Pencil, Play, Plus, Repeat, Trash2 } from "lucide-react";
import {
  deleteRecurring,
  getRecurring,
  updateRecurring,
} from "../api/recurring";
import { formatCurrency, formatDate } from "../lib/constants";
import Button from "../components/ui/Button";
import RecurringFormModal from "../components/recurring/RecurringFormModal";
import { toast } from "../store/toastStore";

const nextLabel = (iso) => {
  const days = Math.ceil((new Date(iso) - new Date()) / 86400000);
  if (days < 0) return `was due ${-days}d ago`;
  if (days === 0) return "due today";
  return `in ${days}d`;
};

const Recurring = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({ open: false, item: null });
  const [confirmId, setConfirmId] = useState(null);

  const fetchRecurring = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getRecurring();
      setItems(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load recurring items.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecurring();
  }, [fetchRecurring]);

  const toggleActive = async (item) => {
    try {
      await updateRecurring(item._id, { active: !item.active });
      toast(item.active ? `Paused “${item.title}”` : `Resumed “${item.title}”`);
      fetchRecurring();
    } catch (err) {
      toast(err.response?.data?.message || "Failed to update.", "error");
    }
  };

  const armDelete = (id) => {
    setConfirmId(id);
    setTimeout(() => setConfirmId((cur) => (cur === id ? null : cur)), 2500);
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecurring(id);
      setConfirmId(null);
      fetchRecurring();
      toast("Recurring item removed");
    } catch (err) {
      toast(err.response?.data?.message || "Failed to delete.", "error");
    }
  };

  if (loading) {
    return (
      <div className="rounded-card border border-border bg-white shadow-card">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-border px-6 py-4 last:border-b-0"
          >
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 animate-pulse rounded bg-border/70" />
              <div className="h-3 w-1/4 animate-pulse rounded bg-border/70" />
            </div>
            <div className="h-4 w-24 animate-pulse rounded bg-border/70" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Recurring</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Subscriptions, salary, rent — on autopilot.
          </p>
        </div>
        <Button onClick={() => setModal({ open: true, item: null })}>
          <Plus className="h-4 w-4" /> New Recurring
        </Button>
      </header>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}

      {items.length === 0 ? (
        <div className="rounded-card border border-border bg-white p-10 text-center shadow-card">
          <Repeat className="mx-auto h-8 w-8 text-sage" />
          <h2 className="mt-3 font-display text-lg">Nothing recurring yet</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Add subscriptions or salary and they'll be logged automatically.
          </p>
        </div>
      ) : (
        <div className="rounded-card border border-border bg-white shadow-card">
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li
                key={item._id}
                className={`flex items-center gap-4 px-6 py-4 ${!item.active ? "opacity-60" : ""}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 truncate text-sm font-medium text-ink">
                    {item.title}
                    {!item.active && (
                      <span className="rounded-full bg-border/70 px-2 py-0.5 text-[10px] font-medium text-ink-muted">
                        Paused
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-ink-muted">
                    {item.frequency === "weekly" ? "Weekly" : "Monthly"} · next{" "}
                    {formatDate(item.nextDate)} ({nextLabel(item.nextDate)})
                  </p>
                </div>
                <span className="rounded-full bg-sage-light px-3 py-1 text-xs font-medium text-sage-dark">
                  {item.category}
                </span>
                <p
                  className={`w-28 text-right text-sm font-semibold ${
                    item.type === "income" ? "text-sage-dark" : "text-ink"
                  }`}
                >
                  {item.type === "income" ? "+" : "−"}
                  {formatCurrency(item.amount)}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => toggleActive(item)}
                    title={item.active ? "Pause" : "Resume"}
                    className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-border/60 hover:text-ink"
                  >
                    {item.active ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setModal({ open: true, item })}
                    title="Edit"
                    className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-border/60 hover:text-ink"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  {confirmId === item._id ? (
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                    >
                      Sure?
                    </button>
                  ) : (
                    <button
                      onClick={() => armDelete(item._id)}
                      title="Delete"
                      className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {modal.open && (
        <RecurringFormModal
          key={modal.item?._id ?? "new"}
          item={modal.item}
          onClose={() => setModal({ open: false, item: null })}
          onSaved={fetchRecurring}
        />
      )}
    </div>
  );
};

export default Recurring;
