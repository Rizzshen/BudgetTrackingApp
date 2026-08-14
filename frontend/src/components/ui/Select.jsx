const Select = ({ label, className = "", children, ...props }) => {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </span>
      )}
      <select
        className={`w-full appearance-none rounded-xl border border-border bg-cream/50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/20 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
};

export default Select;
