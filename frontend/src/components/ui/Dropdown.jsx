import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

const Dropdown = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select…",
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const opts = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );
  const selected = opts.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-cream/50 px-4 py-2.5 text-sm text-ink transition focus:outline-none focus:ring-2 focus:ring-sage/20 ${
          open ? "border-sage" : "border-border"
        }`}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-ink-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="absolute z-30 mt-2 max-h-64 w-full min-w-max overflow-auto rounded-xl border border-border bg-white p-1.5 shadow-card">
          {opts.map((o) => {
            const active = o.value === value;
            return (
              <li key={o.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    active
                      ? "bg-sage-light font-medium text-sage-dark"
                      : "text-ink hover:bg-cream"
                  }`}
                >
                  {o.label}
                  {active && <Check className="h-4 w-4" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;