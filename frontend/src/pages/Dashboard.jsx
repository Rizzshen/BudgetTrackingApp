import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownRight, ArrowUpRight, Leaf, Scale } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getAnalyticsDaily, getAnalyticsSummary } from "../api/expenses";
import { useAuthStore } from "../store/authStore";
import { CHART_COLORS, formatCurrency, formatMonth } from "../lib/constants";
import Dropdown from "../components/ui/Dropdown";
import { DashboardSkeleton } from "../components/ui/Skeletons";
import Heatmap from "../components/dashboard/Heatmap";
import StreakCard from "../components/dashboard/StreakCard";
import BudgetPulse from "../components/dashboard/BudgetPulse";
import GoalSpotlight from "../components/dashboard/GoalSpotlight";

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
  const [dailyData, setDailyData] = useState([]);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [summaryRes, dailyRes] = await Promise.all([
        getAnalyticsSummary({ months }),
        getAnalyticsDaily({ days: 120 }),
      ]);
      setSummary(summaryRes.data);
      setDailyData(dailyRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [months]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

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
  const balance = summary?.balance ?? 0;

  if (loading) return <DashboardSkeleton />;

  return (
    <div>
      {/* Hero */}
      <header className="relative mb-6 rounded-card bg-sidebar px-8 py-7 text-cream shadow-card">
        <Leaf className="pointer-events-none absolute -right-8 -top-10 h-44 w-44 rotate-12 text-cream/5" />
        <Leaf className="pointer-events-none absolute -bottom-12 right-28 h-36 w-36 -rotate-45 text-cream/5" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-sage-light/80">
              Welcome back
            </p>
            <h1 className="mt-1 font-display text-3xl">
              Hello, {user?.name?.split(" ")[0]}
            </h1>
            <p className="mt-2 text-sm text-cream/70">
              {balance >= 0
                ? `You're ${formatCurrency(balance)} ahead this period.`
                : `You're ${formatCurrency(Math.abs(balance))} behind this period.`}{" "}
              Small choices today, big freedom tomorrow.
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
        </div>
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
          value={formatCurrency(balance)}
          icon={Scale}
          valueClass={balance < 0 ? "text-red-600" : "text-sage-dark"}
        />
      </div>

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
        <>
          {/* Trend + donut */}
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="rounded-card border border-border bg-white p-6 shadow-card lg:col-span-3">
              <h2 className="font-display text-lg">Monthly Trend</h2>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={trendData}
                    margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
                  >
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
                      cursor={{ fill: "rgba(92, 122, 86, 0.08)" }}
                      formatter={(value) => [formatCurrency(value), "Spent"]}
                    />
                    <Bar
                      dataKey="total"
                      fill="#5c7a56"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={48}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

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
                          backgroundColor:
                            CHART_COLORS[i % CHART_COLORS.length],
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

          {/* Heatmap + streak */}
          <div className="mt-6 grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <Heatmap dailyData={dailyData} />
            </div>
            <div className="lg:col-span-2">
              <StreakCard dailyData={dailyData} />
            </div>
          </div>
        </>
      )}

      {/* Budgets + goals — always visible so new users see the CTAs */}
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <BudgetPulse />
        </div>
        <div className="lg:col-span-2">
          <GoalSpotlight />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
