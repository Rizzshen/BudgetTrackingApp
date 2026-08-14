import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Signup = () => {
  const { user, signup } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signup(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to sign up. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sidebar">
            <Leaf className="h-6 w-6 text-sage-light" />
          </span>
          <h1 className="font-display text-3xl">Create your account</h1>
          <p className="text-sm text-ink-muted">
            Small choices today, big freedom tomorrow.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-card border border-border bg-white p-8 shadow-card"
        >
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
              {error}
            </p>
          )}
          <Input
            label="Name"
            type="text"
            name="name"
            required
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            required
            minLength={6}
            placeholder="At least 6 characters"
            value={form.password}
            onChange={handleChange}
          />
          <Button type="submit" loading={submitting} className="w-full">
            Sign up
          </Button>
          <p className="text-center text-sm text-ink-muted">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-sage-dark hover:underline"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
