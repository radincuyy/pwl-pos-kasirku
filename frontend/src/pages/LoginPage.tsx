import React, { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";
import { loginUser, clearError } from "@/store/authSlice";

type FormErrors = {
  email?: string;
  password?: string;
};

export default function LoginPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (token) navigate("/", { replace: true });
  }, [token, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!email) e.email = "Email is required";
    else {
      const re = /^\S+@\S+\.\S+$/;
      if (!re.test(email)) e.email = "Please enter a valid email address";
    }

    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev?: React.FormEvent) => {
    ev?.preventDefault();
    if (!validate()) return;
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f1724] to-[#081226] p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-white">KasirKu</h1>
          <p className="text-sm text-gray-300 mt-2">Selamat datang — silakan masuk untuk melanjutkan</p>
        </div>

        <form onSubmit={onSubmit} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                if (error) dispatch(clearError());
              }}
              className="mt-1 block w-full rounded-md bg-white/6 border border-white/8 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && <p id="email-error" className="mt-1 text-sm text-rose-400">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                if (error) dispatch(clearError());
              }}
              className="mt-1 block w-full rounded-md bg-white/6 border border-white/8 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && <p id="password-error" className="mt-1 text-sm text-rose-400">{errors.password}</p>}
          </div>

          {error && <div className="text-sm text-rose-400">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors ${loading ? "bg-indigo-600/60" : "bg-indigo-600 hover:bg-indigo-500"}`}
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              )}
              <span>{loading ? "Signing in..." : "Sign in"}</span>
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center">Forgot password? Contact administrator.</p>
        </form>
      </div>
    </div>
  );
}
