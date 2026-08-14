import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowDownRight, ArrowUpRight, Scale } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getAnalyticsSummary } from "../api/expenses";
import { useAuthStore } from "../store/authStore";
import { CHART_COLORS, formatCurrency, formatMonth } from "../lib/constants";
import Dropdown from "../components/ui/Dropdown";
import {DashboardSkeleton} from "../components/ui/Skeletons";

const StatCard = ({ label, value, icon: Icon, valueClass = "" }) => (
  <div className="rounded-card border border-border bg-white p-6 shadow-card">
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-light text-sage-dark">
        <Icon className="h-4 w-4" />
      </span>
    </div>
    <p className={`mt-3 font-display text-3xl ${valueClass}`}>{value}</p>
  </div>
);

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [months, setMonths] = useState(6);
  const fetchSummary = useCallback(async () => {
    try {
      const { data } = await getAnalyticsSummary({ months });
      setSummary(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load summary.");
    } finally {
      setLoading(false);
    }
  }, [months]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await getAnalyticsSummary();
        setSummary(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load summary.");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const categoryData = (summary?.byCategory || []).map((c) => ({
    name: c._id,
    value: c.total,
  }));

  const trendData = (summary?.monthlyTrend || [])
    .slice()
    .sort((a, b) => a._id.year - b._id.year || a._id.month - b._id.month)
    .map((m) => ({
      name: formatMonth(m._id.year, m._id.month),
      total: m.total,
    }));

  const hasData = categoryData.length > 0;

  if (loading) return <DashboardSkeleton />;

  return (
    <div>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">
            Hello, {user?.name?.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Here's an overview of your finances.
          </p>
        </div>
        <Dropdown
          className="w-44"
          value={months}
          onChange={setMonths}
          options={[
            { value: 3, label: "Last 3 months" },
            { value: 6, label: "Last 6 months" },
            { value: 12, label: "Last 12 months" },
          ]}
        />
      </header>

      {error && (
        <p className="mb-6 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Stat cards */}
      <div className="mb-6 grid gap-6 sm:grid-cols-3">
        <StatCard
          label="Total Income"
          value={formatCurrency(summary?.totalIncome ?? 0)}
          icon={ArrowUpRight}
        />
        <StatCard
          label="Total Expense"
          value={formatCurrency(summary?.totalExpense ?? 0)}
          icon={ArrowDownRight}
        />
        <StatCard
          label="Balance"
          value={formatCurrency(summary?.balance ?? 0)}
          icon={Scale}
          valueClass={
            (summary?.balance ?? 0) < 0 ? "text-red-600" : "text-sage-dark"
          }
        />
      </div>

      {/* Charts / empty state */}
      {!hasData ? (
        <div className="rounded-card border border-border bg-white p-10 text-center shadow-card">
          <h2 className="font-display text-lg">No data yet</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Add your first expense to see your dashboard come to life.
          </p>
          <Link
            to="/expenses"
            className="mt-4 inline-block rounded-xl bg-sage-dark px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-sidebar"
          >
            Go to Expenses
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Monthly trend */}
          <div className="rounded-card border border-border bg-white p-6 shadow-card lg:col-span-3">
            <h2 className="font-display text-lg">Monthly Trend</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#5c7a56"
                        stopOpacity={0.35}
                      />
                      <stop offset="100%" stopColor="#5c7a56" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e7e5dc"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#6b7264", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#6b7264", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), "Spent"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#405b3d"
                    strokeWidth={2}
                    fill="url(#trendFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* By category */}
          <div className="rounded-card border border-border bg-white p-6 shadow-card lg:col-span-2">
            <h2 className="font-display text-lg">Spending by Category</h2>
            <div className="mt-4 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {categoryData.map((entry, i) => (
                      <Cell
                        key={entry.name}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-4 space-y-2">
              {categoryData.map((c, i) => (
                <li
                  key={c.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2 text-ink-muted">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                      }}
                    />
                    {c.name}
                  </span>
                  <span className="font-medium text-ink">
                    {formatCurrency(c.value)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
