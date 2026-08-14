import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { useToastStore } from "../../store/toastStore";

const Toaster = () => {
  const { toasts, dismiss } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex animate-toast-in items-start gap-3 rounded-xl bg-sidebar px-4 py-3 text-sm text-cream shadow-card"
        >
          {t.type === "error" ? (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sage-light" />
          )}
          <p className="flex-1">{t.message}</p>
          <button
            onClick={() => dismiss(t.id)}
            className="text-cream/60 transition-colors hover:text-cream"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toaster;