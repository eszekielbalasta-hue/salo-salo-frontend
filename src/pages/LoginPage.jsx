import { useState, useCallback } from "react";
import API from "../api/apiClient";

const VALIDATION = {
  USERNAME: { MIN_LENGTH: 3, MAX_LENGTH: 20, PATTERN: /^[a-zA-Z0-9_]+$/ },
  PASSWORD: { MIN_LENGTH: 6, MAX_LENGTH: 128 },
};

export default function LoginPage({ onLogin, onSwitch }) {
  const [form, setForm]       = useState({ username: "", password: "" });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError]     = useState("");
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
      default: break;
    }
    return fieldErrors;
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    Object.keys(form).forEach((field) => {
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
    setTouched({ username: true, password: true });
    const { isValid, newErrors } = validateForm();
    setErrors(newErrors);
    if (!isValid) return;
    setLoading(true); setError("");
    try {
      const res = await API.post("/api/auth/login", {
        username: form.username.trim(),
        password: form.password,
      });
      const { token, username, role } = res.data;
      if (!token || !username || !role) throw new Error("Invalid response from server");
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);
      onLogin({ token, username, role });
      setForm({ username: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed. Please try again.");
      setForm((prev) => ({ ...prev, password: "" }));
    } finally { setLoading(false); }
  }, [form, validateForm, onLogin]);

  const getFieldState = (field) => {
    if (errors[field]?.length > 0) return "error";
    if (touched[field] && !errors[field] && form[field]) return "success";
    return "idle";
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🍽</div>
        <h1 className="auth-title">Salo-Salo</h1>
        <p className="auth-subtitle">◆ Filipino Fine Dining ◆</p>
        <div className="auth-divider"></div>
        <h2 className="auth-heading">Welcome Back</h2>
        <p className="auth-sub">Sign in to manage your restaurant</p>

        {error && <p className="error-msg">⚠ &nbsp;{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Username {getFieldState("username") === "success" && <span className="field-ok"> ✓</span>}</label>
            <input type="text" value={form.username} onChange={handleChange("username")} onBlur={handleBlur("username")}
              placeholder="Enter your username"
              className={getFieldState("username") === "error" ? "input-error" : getFieldState("username") === "success" ? "input-success" : ""}
              autoComplete="username" disabled={loading} />
            {errors.username?.map((e, i) => <span key={i} className="field-error">◆ {e}</span>)}
          </div>

          <div className="form-group">
            <label>Password {getFieldState("password") === "success" && <span className="field-ok"> ✓</span>}</label>
            <input type="password" value={form.password} onChange={handleChange("password")} onBlur={handleBlur("password")}
              placeholder="Enter your password"
              className={getFieldState("password") === "error" ? "input-error" : getFieldState("password") === "success" ? "input-success" : ""}
              autoComplete="current-password" disabled={loading} />
            {errors.password?.map((e, i) => <span key={i} className="field-error">◆ {e}</span>)}
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <span onClick={onSwitch} className="auth-link">Create one</span>
        </p>
      </div>
    </div>
  );
}