import { formatCurrency } from "../../lib/constants";

const toLocalDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getHeatmapColor = (amount, maxSpend) => {
  if (amount === 0) return "bg-border/60";
  const ratio = amount / maxSpend;
  if (ratio < 0.25) return "bg-sage-light";
  if (ratio < 0.5) return "bg-sage";
  if (ratio < 0.8) return "bg-sage-dark";
  return "bg-sidebar"; // very dark green for huge spends
};

const Heatmap = ({ dailyData = [] }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const spendMap = new Map(dailyData.map((d) => [d.date, d.total]));
  const maxSpend = Math.max(1, ...dailyData.map((d) => d.total)); // avoid div by 0

  // Show last 16 full weeks
  const weeksToShow = 16;
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - weeksToShow * 7 + 1);
  // Align start date to Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const grid = [];
  let cursor = new Date(startDate);

  const now = new Date();
  const monthRows = dailyData.filter((d) => {
    const [y, m] = d.date.split("-").map(Number);
    return y === now.getFullYear() && m === now.getMonth() + 1;
  });
  const monthTotal = monthRows.reduce((s, d) => s + d.total, 0);

  while (cursor <= today || grid.length < weeksToShow) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const dateStr = toLocalDateStr(cursor);
      const amount = spendMap.get(dateStr) || 0;
      week.push({
        date: dateStr,
        amount,
        isFuture: cursor > today,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    grid.push(week);
    if (grid.length >= 17) break;
  }

  return (
    <div className="rounded-card border border-border bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg">Spending Heatmap</h2>
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-ink-muted">
          <span>Less</span>
          <div className="h-3 w-3 rounded-sm bg-border/60"></div>
          <div className="h-3 w-3 rounded-sm bg-sage-light"></div>
          <div className="h-3 w-3 rounded-sm bg-sage"></div>
          <div className="h-3 w-3 rounded-sm bg-sage-dark"></div>
          <div className="h-3 w-3 rounded-sm bg-sidebar"></div>
          <span>More</span>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {grid.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-1">
            {week.map((day, dIdx) => (
              <div
                key={dIdx}
                title={`${day.date}: ${formatCurrency(day.amount)}`}
                className={`h-3.5 w-3.5 rounded-[3px] transition-colors ${
                  day.isFuture
                    ? "bg-transparent"
                    : getHeatmapColor(day.amount, maxSpend)
                }`}
              />
            ))}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-ink-muted">
        This month:{" "}
        <span className="font-semibold text-ink">
          {formatCurrency(monthTotal)}
        </span>
        {" · "}
        {monthRows.length} spending {monthRows.length === 1 ? "day" : "days"}
      </p>
    </div>
  );
};

export default Heatmap;
