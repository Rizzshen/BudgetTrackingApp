import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, RefreshCw, Sparkles } from "lucide-react";
import { getAiInsights } from "../api/expenses";
import Button from "../components/ui/Button";
import { InsightsSkeleton } from "../components/ui/Skeletons";

const Insights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAiInsights();
      setInsights(data);
    } catch (err) {
      setError({
        status: err.response?.status,
        message: err.response?.data?.message || "Failed to generate insights.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  // Filter out junk values like "None" from the AI response
  const concerns = (insights?.topConcerns || []).filter(
    (c) => c.toLowerCase() !== "none",
  );

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Insights</h1>
          <p className="mt-1 text-sm text-ink-muted">
            AI-powered guidance based on your spending.
          </p>
        </div>
        <Button variant="secondary" onClick={fetchInsights} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </header>

      {loading ? (
        <InsightsSkeleton />
      ) : error?.status === 400 ? (
        <div className="rounded-card border border-border bg-white p-10 text-center shadow-card">
          <h2 className="font-display text-lg">Not enough data yet</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Add a few expenses and come back for personalized AI insights.
          </p>
          <Link
            to="/expenses"
            className="mt-4 inline-block rounded-xl bg-sage-dark px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-sidebar"
          >
            Go to Expenses
          </Link>
        </div>
      ) : error ? (
        <div className="rounded-card border border-border bg-white p-10 text-center shadow-card">
          <AlertTriangle className="mx-auto h-6 w-6 text-red-600" />
          <h2 className="mt-3 font-display text-lg">Insights unavailable</h2>
          <p className="mt-1 text-sm text-ink-muted">{error.message}</p>
          <Button onClick={fetchInsights} className="mt-4">
            Try again
          </Button>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="rounded-card border border-border bg-white p-6 shadow-card">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-light text-sage-dark">
                <Sparkles className="h-5 w-5" />
              </span>
              <h2 className="font-display text-xl">Your spending story</h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              {insights.summary}
            </p>
            {concerns.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Focus areas:
                </span>
                {concerns.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-sage-dark px-3 py-1 text-xs font-medium text-cream"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Suggestions */}
          <h2 className="mb-4 mt-8 font-display text-xl">Suggestions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {insights.suggestions.map((s, i) => (
              <div
                key={s.title}
                className="rounded-card border border-border bg-white p-5 shadow-card"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage-light font-display text-sm text-sage-dark">
                    {i + 1}
                  </span>
                  <h3 className="font-display text-base">{s.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Insights;
