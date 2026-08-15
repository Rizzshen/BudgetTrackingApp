import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Leaf, LogOut, Receipt, Sparkles } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { Wallet, Target, Repeat } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/expenses", label: "Expenses", icon: Receipt, end: false },
  { to: "/insights", label: "Insights", icon: Sparkles, end: false },
  { to: "/budgets", label: "Budgets", icon: Wallet, end: false },
  { to: "/goals", label: "Goals", icon: Target, end: false },
  { to: "/recurring", label: "Recurring", icon: Repeat, end: false },
];

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-sidebar text-cream">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 pt-8 pb-10">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
          <Leaf className="h-5 w-5 text-sage-light" />
        </span>
        <div>
          <p className="font-display text-lg leading-tight">Budget Tracker</p>
          <p className="text-xs text-cream/60">Spend mindfully</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-cream text-sidebar shadow-card"
                  : "text-cream/70 hover:bg-white/10 hover:text-cream",
              ].join(" ")
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User card */}
      <div className="mx-3 mb-4 rounded-2xl bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-light font-display text-sm text-sidebar">
            {getInitials(user?.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-cream">
              {user?.name}
            </p>
            <p className="truncate text-xs text-cream/60">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="rounded-lg p-2 text-cream/60 transition-colors hover:bg-white/10 hover:text-cream"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
