import React, { useState } from 'react';
import { useStore } from '../store';
import {
  Landmark,
  BadgeCheck,
  Lock,
  LogIn,
  School,
  Globe,
  Info,
  Mail
} from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStudent = useStore((s) => s.fetchStudent);
  const login = useStore((state) => state.login);

  const navigate = useNavigate();

  const SERVER = import.meta.env.VITE_SERVER;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${SERVER}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (data.success) {
      login(data.user, data.token);

if (data.user.mustChangePassword) {
  navigate("/change-password", {
    replace: true,
  });
} else {
  navigate("/", {
    replace: true,
  });
}
      } else {
        setError(data.message || 'Login failed');
      }

    } catch (err) {
      console.error(err);
      setError('Server error');
    }

    setLoading(false);
  };


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-100 mb-4 text-primary">
            <Landmark className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Kannur University SIS</h1>
          <p className="text-sm text-slate-500 mt-2">Student Information System Login</p>
        </div>

        <div className="bg-white border border-border-subtle rounded-xl shadow-sm overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* EMAIL */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    placeholder="e.g. user@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-slate-700" htmlFor="password">
                    Password
                  </label>
                  <Link className="text-xs text-primary hover:underline font-semibold" to="/forgot-password">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Logging in...' : 'Login to Dashboard'}</span>
                <LogIn className="w-5 h-5" />
              </button>

            </form>
          </div>

          <div className="px-8 py-4 bg-slate-50 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Info className="w-4 h-4 text-status-warning" />
              <span>Need login assistance?</span>
            </div>
            <a href="#" className="text-xs text-primary font-semibold hover:underline">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}