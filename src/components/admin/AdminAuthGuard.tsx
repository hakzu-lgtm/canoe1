"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { validateLogin } from "@/constants/auth";
import { SITE_CONFIG } from "@/constants/navigation";

interface AuthContextValue {
  user: string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({ user: null, logout: () => {} });

export function useAdminAuth() {
  return useContext(AuthContext);
}

const SESSION_KEY = "admin_user";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) setUser(saved);
    setReady(true);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
    setLoginId("");
    setLoginPw("");
    setError("");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = loginId.trim();
    const trimmedPw = loginPw.trim();

    if (!trimmedId || !trimmedPw) {
      setError("아이디와 비밀번호를 입력하세요.");
      return;
    }

    if (validateLogin(trimmedId, trimmedPw)) {
      sessionStorage.setItem(SESSION_KEY, trimmedId);
      setUser(trimmedId);
      setError("");
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  // Prevent flash of content before sessionStorage is checked
  if (!ready) return null;

  // Authenticated - render admin content
  if (user) {
    return (
      <AuthContext.Provider value={{ user, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }

  // Not authenticated - render login form
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">{SITE_CONFIG.name}</h1>
          <p className="mt-1 text-sm text-gray-500">관리자 로그인</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label htmlFor="login-id" className="mb-1.5 block text-sm font-medium text-gray-700">
                아이디
              </label>
              <input
                id="login-id"
                type="text"
                value={loginId}
                onChange={(e) => { setLoginId(e.target.value); setError(""); }}
                placeholder="아이디를 입력하세요"
                autoComplete="username"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="login-pw" className="mb-1.5 block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                id="login-pw"
                type="password"
                value={loginPw}
                onChange={(e) => { setLoginPw(e.target.value); setError(""); }}
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
          )}

          <button
            type="submit"
            className="mt-5 w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
