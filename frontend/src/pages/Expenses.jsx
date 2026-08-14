import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Pencil, Plus, Trash2, Download } from "lucide-react";
import { deleteExpense, getExpenses } from "../api/expenses";
import { CATEGORIES, formatCurrency, formatDate } from "../lib/constants";
import Button from "../components/ui/Button";
import Dropdown from "../components/ui/Dropdown";
import Input from "../components/ui/Input";
import ExpenseFormModal from "../components/expenses/ExpenseFormModal";
import { toast } from "../store/toastStore";
import { ExpensesSkeleton } from "../components/ui/Skeletons";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    type: "",
    startDate: "",
    endDate: "",
  });
  const [modal, setModal] = useState({ open: false, expense: null });
  const [confirmId, setConfirmId] = useState(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.type) params.type = filters.type;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      const { data } = await getExpenses(params);
      setExpenses(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const hasFilters = Object.values(filters).some(Boolean);
  const clearFilters = () =>
    setFilters({ category: "", type: "", startDate: "", endDate: "" });

  const armDelete = (id) => {
    setConfirmId(id);
    setTimeout(() => {
      setConfirmId((cur) => (cur === id ? null : cur));
    }, 2500);
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      setConfirmId(null);
      fetchExpenses();
      toast("Entry deleted");
    } catch (err) {
      toast(err.response?.data?.message || "Failed to delete.", "error");
    }
  };

  const sorted = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
  const totals = sorted.reduce(
    (acc, e) => {
      if (e.type === "income") acc.income += e.amount;
      else acc.expense += e.amount;
      return acc;
    },
    { income: 0, expense: 0 },
  );
  const exportCsv = () => {
    const header = ["Title", "Category", "Type", "Amount", "Date", "Notes"];
    const rows = sorted.map((e) => [
      e.title,
      e.category,
      e.type,
      e.amount,
      e.date.slice(0, 10),
      e.notes || "",
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Exported CSV");
  };

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Expenses</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Track every dollar in and out.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={exportCsv}
            disabled={sorted.length === 0}
          >
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button onClick={() => setModal({ open: true, expense: null })}>
            <Plus className="h-4 w-4" /> Add Expense
          </Button>
        </div>
      </header>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Dropdown
          className="w-44"
          value={filters.category}
          onChange={(v) => setFilters({ ...filters, category: v })}
          options={[
            { value: "", label: "All categories" },
            ...CATEGORIES.map((c) => ({ value: c, label: c })),
          ]}
        />
        <Dropdown
          className="w-36"
          value={filters.type}
          onChange={(v) => setFilters({ ...filters, type: v })}
          options={[
            { value: "", label: "All types" },
            { value: "expense", label: "Expense" },
            { value: "income", label: "Income" },
          ]}
        />
        <Input
          type="date"
          className="w-40"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
        />
        <ArrowRight className="h-4 w-4 text-ink-muted" />
        <Input
          type="date"
          className="w-40"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />
        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* List */}
      <div className="rounded-card border border-border bg-white shadow-card">
        {loading ? (
          <ExpensesSkeleton />
        ) : sorted.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-display text-lg">
              {hasFilters ? "Nothing matches your filters" : "No entries yet"}
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              {hasFilters
                ? "Try adjusting or clearing the filters."
                : "Add your first expense or income to get started."}
            </p>
            {hasFilters && (
              <Button variant="ghost" onClick={clearFilters} className="mt-3">
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {sorted.map((e) => (
              <li key={e._id} className="flex items-center gap-4 px-6 py-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {e.title}
                  </p>
                  <p className="truncate text-xs text-ink-muted">
                    {formatDate(e.date)}
                    {e.notes ? ` · ${e.notes}` : ""}
                  </p>
                </div>
                <span className="rounded-full bg-sage-light px-3 py-1 text-xs font-medium text-sage-dark">
                  {e.category}
                </span>
                <p
                  className={`w-28 text-right text-sm font-semibold ${
                    e.type === "income" ? "text-sage-dark" : "text-ink"
                  }`}
                >
                  {e.type === "income" ? "+" : "−"}
                  {formatCurrency(e.amount)}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setModal({ open: true, expense: e })}
                    title="Edit"
                    className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-border/60 hover:text-ink"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  {confirmId === e._id ? (
                    <button
                      onClick={() => handleDelete(e._id)}
                      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                    >
                      Sure?
                    </button>
                  ) : (
                    <button
                      onClick={() => armDelete(e._id)}
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
        )}
        {!loading && sorted.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-border bg-cream/50 px-6 py-3 text-xs text-ink-muted">
            <span>
              {sorted.length} {sorted.length === 1 ? "entry" : "entries"}
            </span>
            <span>
              Income{" "}
              <span className="font-semibold text-sage-dark">
                +{formatCurrency(totals.income)}
              </span>
            </span>
            <span>
              Expenses{" "}
              <span className="font-semibold text-ink">
                −{formatCurrency(totals.expense)}
              </span>
            </span>
            <span>
              Net{" "}
              <span
                className={`font-semibold ${
                  totals.income - totals.expense < 0
                    ? "text-red-600"
                    : "text-sage-dark"
                }`}
              >
                {formatCurrency(totals.income - totals.expense)}
              </span>
            </span>
          </div>
        )}
      </div>

      {modal.open && (
        <ExpenseFormModal
          key={modal.expense?._id ?? "new"}
          expense={modal.expense}
          onClose={() => setModal({ open: false, expense: null })}
          onSaved={fetchExpenses}
        />
      )}
    </div>
  );
};

export default Expenses;
