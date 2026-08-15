import { Flame } from "lucide-react";

// Helper to avoid UTC timezone bugs with toISOString()
const toLocalDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const StreakCard = ({ dailyData = [] }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const spendMap = new Map(dailyData.map((d) => [d.date, d.total]));

  // 1. Calculate current no-spend streak (counting backwards from today/yesterday)
  let streak = 0;
  let cursor = new Date(today);
  while (true) {
    const dateStr = toLocalDateStr(cursor);
    if ((spendMap.get(dateStr) || 0) === 0) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
    if (streak > 365) break; // safety cap
  }

  // 2. Calculate current week status (Monday to Sunday)
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon...
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = toLocalDateStr(d);
    const spent = (spendMap.get(dateStr) || 0) > 0;
    weekDays.push({
      day: ["M", "T", "W", "T", "F", "S", "S"][i],
      spent,
      isFuture: d > today,
    });
  }

  return (
    <div className="flex h-full flex-col justify-between rounded-card border border-border bg-white p-5 shadow-card">
      <div>
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-sage-dark" />
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            No-Spend Streak
          </p>
        </div>
        {/* Changed outer <p> to <div> so we can nest a <p> inside */}
        <div className="mt-3">
          <p className="font-display text-4xl text-sage-dark">
            {streak}{" "}
            <span className="font-sans text-base text-ink-muted">days</span>
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            {streak === 0
              ? "Fresh start — make today a no-spend day!"
              : "Keep the chain going!"}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium text-ink-muted">This week</p>
        <div className="flex items-center justify-between">
          {weekDays.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  d.isFuture
                    ? "bg-cream text-ink-muted/40"
                    : d.spent
                      ? "bg-red-50 text-red-500"
                      : "bg-sage-light text-sage-dark"
                }`}
              >
                {d.isFuture ? "–" : d.spent ? "✕" : "✓"}
              </div>
              <span className="text-[10px] font-medium text-ink-muted">
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StreakCard;
