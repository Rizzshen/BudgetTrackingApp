import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getExpenses, deleteExpense } from "../api/expenses";
import { CATEGORIES, CATEGORY_COLORS } from "../lib/constants";
import ExpenseFormModal from "../components/expenses/ExpenseFormModal";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    const params = category ? { category } : {};
    const data = await getExpenses(params);
    setExpenses(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [category]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this entry?")) return;
    await deleteExpense(id);
    load();
  };

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (exp) => {
    setEditing(exp);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl">Expenses</h1>
          <p className="text-ink-muted text-sm">Every entry, in one place.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-sage text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-sage/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add entry
        </button>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        <button
          onClick={() => setCategory("")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            category === "" ? "bg-sage text-white" : "bg-sage-light/50 text-ink-muted"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              category === c ? "bg-sage text-white" : "bg-sage-light/50 text-ink-muted"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-card shadow-card overflow-hidden">
        {loading ? (
          <p className="text-ink-muted text-sm p-6">Loading...</p>
        ) : expenses.length === 0 ? (
          <div className="text-center py-16 px-6">
            <p className="text-lg mb-1">Nothing here yet</p>
            <p className="text-ink-muted text-sm">
              Add your first entry to start tracking.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id} className="border-b border-ink/5 last:border-0">
                  <td className="px-6 py-4 w-2">
                    <span
                      className="block w-2 h-2 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[exp.category] }}
                    />
                  </td>
                  <td className="px-2 py-4">
                    <p className="font-medium">{exp.title}</p>
                    <p className="text-ink-muted text-xs">{exp.category}</p>
                  </td>
                  <td className="px-2 py-4 text-ink-muted text-xs whitespace-nowrap">
                    {new Date(exp.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td
                    className={`px-2 py-4 text-right font-medium whitespace-nowrap ${
                      exp.type === "income" ? "text-sage" : "text-ink"
                    }`}
                  >
                    {exp.type === "income" ? "+" : "-"}${exp.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => openEdit(exp)}
                        className="text-ink-muted hover:text-ink"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="text-ink-muted hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ExpenseFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={load}
        editing={editing}
      />
    </div>
  );
}