const Input = ({ label, className = "", ...props }) => {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      )}
      <input
        className={`w-full rounded-xl border border-border bg-cream/50 px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-muted/60 focus:border-sage focus:ring-2 focus:ring-sage/20 ${className}`}
        {...props}
      />
    </label>
  );
};

export default Input;