export const CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Utilities",
  "Entertainment",
  "Health",
  "Shopping",
  "Education",
  "Other",
];

export const CHART_COLORS = [
  "#405b3d",
  "#5c7a56",
  "#74906d",
  "#8fa886",
  "#aabf9f",
  "#c5d4ba",
  "#6b7264",
  "#a8a291",
  "#dce5d3",
];

export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

export const formatMonth = (year, month) =>
  new Date(year, month - 1, 1).toLocaleDateString("en-US", { month: "short" });

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
