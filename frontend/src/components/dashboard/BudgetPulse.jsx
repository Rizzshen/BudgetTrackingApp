import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBudgets } from "../../api/budgets";
import { formatCurrency } from "../../lib/constants";

const BudgetPulse = () => {
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    getBudgets()
      .then(({ data }) => setBudgets(data))
      .catch(() => {});
  }, []);

  const top = [...budgets]
    .sort((a, b) => b.spent / b.limit - a.spent / a.limit)
    .slice(0, 3);

  return (
    <div className="flex h-full flex-col rounded-card border border-border bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg">Budget Pulse</h2>
        <Link to="/budgets" className="text-xs font-medium text-sage-dark hover:underline">
          Manage →
        </Link>
      </div>

      {top.length === 0 ? (
        <p className="mt-3 text-sm text-ink-muted">
          No budgets set yet. Create one and your pulse shows up here.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {top.map((b) => {
            const pct = (b.spent / b.limit) * 100;
            return (
              <li key={b._id}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-ink">{b.category}</span>
                  <span className={pct >= 100 ? "font-medium text-red-600" : "text-ink-muted"}>
                    {formatCurrency(b.spent)} / {formatCurrency(b.limit)}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-border">
                  <div
                    className={`h-full rounded-full ${
                      pct >= 100 ? "bg-red-600" : pct >= 80 ? "bg-sage" : "bg-sage-dark"
                    }`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default BudgetPulse;