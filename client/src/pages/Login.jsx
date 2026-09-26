import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Mail, Lock, ArrowRight, ShieldCheck, UtensilsCrossed, Bike, User } from 'lucide-react';
import Button from '../components/Button';
import { setCredentials } from '../redux/slices/authSlice';
import { login } from '../services/authService';

const demoAccounts = [
  { role: 'CUSTOMER', email: 'customer1@foodexpress.com', label: 'Customer Demo' },
  { role: 'RESTAURANT', email: 'owner1@foodexpress.com', label: 'Restaurant Owner Demo' },
  { role: 'DELIVERY', email: 'delivery1@foodexpress.com', label: 'Rider Demo' },
  { role: 'ADMIN', email: 'admin@foodexpress.com', label: 'Admin Demo' },
];

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login({ email, password });
      if (res.data) {
        dispatch(setCredentials(res.data));

        // Role-based navigation
        const role = res.data.role;
        if (role === 'ADMIN') navigate('/admin/dashboard');
        else if (role === 'RESTAURANT') navigate('/restaurant/dashboard');
        else if (role === 'DELIVERY') navigate('/delivery/dashboard');
        else navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc) => {
    setEmail(acc.email);
    setPassword('password123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center text-white font-extrabold text-2xl mx-auto mb-3 shadow-md">
            F
          </div>
          <h2 className="text-2xl font-black text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500 mt-1">Sign in to your FoodExpress account</p>
        </div>

        {/* Demo Quick Fill Buttons */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            One-Click Demo Fill:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => fillDemo(acc)}
                className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 text-left truncate transition-colors"
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-orange"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <Link to="/forgot-password" className="text-xs font-bold text-brand-orange hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-orange"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading}>
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-orange hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
