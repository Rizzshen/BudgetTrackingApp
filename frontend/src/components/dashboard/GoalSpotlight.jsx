import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Target } from "lucide-react";
import { getGoals } from "../../api/goals";
import { formatCurrency } from "../../lib/constants";
import Button from "../ui/Button";
import ContributeModal from "../goals/ContributeModal";

const GoalSpotlight = () => {
  const [goals, setGoals] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchGoals = useCallback(async () => {
    try {
      const { data } = await getGoals();
      setGoals(data);
    } catch {
      /* non-fatal */
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const goal = [...goals].sort(
    (a, b) =>
      (a.deadline ? new Date(a.deadline) : Infinity) -
      (b.deadline ? new Date(b.deadline) : Infinity),
  )[0];

  return (
    <div className="flex h-full flex-col rounded-card border border-border bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg">Goal Spotlight</h2>
        <Link
          to="/goals"
          className="text-xs font-medium text-sage-dark hover:underline"
        >
          All goals →
        </Link>
      </div>

      {!goal ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-6 text-center">
          <Target className="h-6 w-6 text-sage" />
          <p className="text-sm text-ink-muted">
            No goals yet — create one and it'll shine here.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-4 text-sm font-medium text-ink">{goal.name}</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-sage-dark"
              style={{
                width: `${Math.min((goal.saved / goal.target) * 100, 100)}%`,
              }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-ink-muted">
            <span>
              <span className="font-semibold text-ink">
                {formatCurrency(goal.saved)}
              </span>{" "}
              of {formatCurrency(goal.target)}
            </span>
            <span>{Math.round((goal.saved / goal.target) * 100)}%</span>
          </div>
          <Button
            variant="secondary"
            className="mt-4 w-full"
            onClick={() => setOpen(true)}
          >
            Add money
          </Button>
        </>
      )}

      {open && goal && (
        <ContributeModal
          goal={goal}
          onClose={() => setOpen(false)}
          onSaved={fetchGoals}
        />
      )}
    </div>
  );
};

export default GoalSpotlight;
