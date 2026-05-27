import { useState, useCallback } from "react";
import axios from "axios";

const VALIDATION = {
  USERNAME: { MIN_LENGTH: 3, MAX_LENGTH: 20, PATTERN: /^[a-zA-Z0-9_]+$/ },
  PASSWORD: { MIN_LENGTH: 6, MAX_LENGTH: 128 },
};

const ROLES = [
  { value: "customer", label: "Customer", desc: "Browse menu & place orders" },
  { value: "staff",    label: "Staff",    desc: "Manage menu & orders" },
  { value: "admin",    label: "Admin",    desc: "Full access" },
];

export default function RegisterPage({ onSwitch }) {
  const [form, setForm]       = useState({ username: "", password: "", confirm: "", role: "customer" });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateField = useCallback((name, value) => {
    const fieldErrors = [];
    switch (name) {
      case "username": {
        const t = value.trim();
        if (!t) { fieldErrors.push("Username is required"); break; }
        if (t.length < VALIDATION.USERNAME.MIN_LENGTH) fieldErrors.push(`At least ${VALIDATION.USERNAME.MIN_LENGTH} characters`);
        if (t.length > VALIDATION.USERNAME.MAX_LENGTH) fieldErrors.push(`No more than ${VALIDATION.USERNAME.MAX_LENGTH} characters`);
        if (!VALIDATION.USERNAME.PATTERN.test(t)) fieldErrors.push("Letters, numbers, and underscores only");
        break;
      }
      case "password": {
        if (!value) { fieldErrors.push("Password is required"); break; }
        if (value.length < VALIDATION.PASSWORD.MIN_LENGTH) fieldErrors.push(`At least ${VALIDATION.PASSWORD.MIN_LENGTH} characters`);
        if (!/[A-Z]/.test(value)) fieldErrors.push("Must contain an uppercase letter");
        if (!/[a-z]/.test(value)) fieldErrors.push("Must contain a lowercase letter");
        if (!/[0-9]/.test(value)) fieldErrors.push("Must contain a number");
        break;
      }
      case "confirm": {
        if (!value) { fieldErrors.push("Please confirm your password"); break; }
        if (value !== form.password) fieldErrors.push("Passwords do not match");
        break;
      }
      default: break;
    }
    return fieldErrors;
  }, [form.password]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    ["username", "password", "confirm"].forEach((field) => {
      const fieldErrors = validateField(field, form[field]);
      if (fieldErrors.length > 0) { newErrors[field] = fieldErrors; isValid = false; }
    });
    return { isValid, newErrors };
  }, [form, validateField]);

  const handleChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const fieldErrors = touched[field] ? validateField(field, value) : [];
      return { ...prev, [field]: fieldErrors.length > 0 ? fieldErrors : undefined };
    });
    if (error) setError("");
  }, [error, touched, validateField]);

  const handleBlur = useCallback((field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => {
      const fieldErrors = validateField(field, form[field]);
      return { ...prev, [field]: fieldErrors.length > 0 ? fieldErrors : undefined };
    });
  }, [form, validateField]);

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault?.();
    setTouched({ username: true, password: true, confirm: true });
    const { isValid, newErrors } = validateForm();
    setErrors(newErrors);
    if (!isValid) return;
    setLoading(true); setError(""); setSuccess("");
    try {
      // Swapped out local endpoint for live production Render URL path
      await axios.post("https://salo-salo-backend.onrender.com/api/auth/register", {
        username: form.username.trim(),
        password: form.password,
        role: form.role,
      });
      setSuccess("Account created successfully! Redirecting to sign in...");
      setTimeout(() => onSwitch(), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  }, [form, validateForm, onSwitch]);

  const getFieldState = (field) => {
    if (errors[field]?.length > 0) return "error";
    if (touched[field] && !errors[field] && form[field]) return "success";
    return "idle";
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-logo">🍽</div>
        <h1 className="auth-title">Salo-Salo</h1>
        <p className="auth-subtitle">◆ Filipino Fine Dining ◆</p>
        <div className="auth-divider"></div>
        <h2 className="auth-heading">Create Account</h2>
        <p className="auth-sub">Join Salo-Salo and start your experience</p>

        {error   && <p className="error-msg">⚠ &nbsp;{error}</p>}
        {success && <p className="success-msg">✓ &nbsp;{success}</p>}

        {/* Role Selector */}
        <div className="role-selector">
          {ROLES.map((r) => (
            <div
              key={r.value}
              className={`role-card ${form.role === r.value ? "role-active" : ""}`}
              onClick={() => setForm((prev) => ({ ...prev, role: r.value }))}
            >
              <span className="role-label">{r.label}</span>
              <span className="role-desc">{r.desc}</span>
            </div>
          ))}
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>
              Username
              {getFieldState("username") === "success" && <span className="field-ok"> ✓</span>}
            </label>
            <input
              type="text"
              value={form.username}
              onChange={handleChange("username")}
              onBlur={handleBlur("username")}
              placeholder="Choose a username"
              className={getFieldState("username") === "error" ? "input-error" : getFieldState("username") === "success" ? "input-success" : ""}
              autoComplete="username"
              disabled={loading}
            />
            {errors.username?.map((e, i) => <span key={i} className="field-error">◆ {e}</span>)}
          </div>

          <div className="form-group">
            <label>
              Password
              {getFieldState("password") === "success" && <span className="field-ok"> ✓</span>}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              onBlur={handleBlur("password")}
              placeholder="Min. 6 chars, uppercase, lowercase, number"
              className={getFieldState("password") === "error" ? "input-error" : getFieldState("password") === "success" ? "input-success" : ""}
              autoComplete="new-password"
              disabled={loading}
            />
            {errors.password?.map((e, i) => <span key={i} className="field-error">◆ {e}</span>)}
          </div>

          <div className="form-group">
            <label>
              Confirm Password
              {getFieldState("confirm") === "success" && <span className="field-ok"> ✓</span>}
            </label>
            <input
              type="password"
              value={form.confirm}
              onChange={handleChange("confirm")}
              onBlur={handleBlur("confirm")}
              placeholder="Repeat your password"
              className={getFieldState("confirm") === "error" ? "input-error" : getFieldState("confirm") === "success" ? "input-success" : ""}
              autoComplete="new-password"
              disabled={loading}
            />
            {errors.confirm?.map((e, i) => <span key={i} className="field-error">◆ {e}</span>)}
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? "Creating account..." : `Create ${ROLES.find(r => r.value === form.role)?.label} Account`}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={onSwitch} className="auth-link">Sign in</span>
        </p>
      </div>
    </div>
  );
}