import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Mail, Lock, User, Phone, ArrowRight, UtensilsCrossed, Bike, ShieldCheck } from 'lucide-react';
import Button from '../components/Button';
import { setCredentials } from '../redux/slices/authSlice';
import { register } from '../services/authService';

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [role, setRole] = useState(searchParams.get('role') || 'CUSTOMER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await register({ name, email, phone, password, role });
      if (res.data) {
        dispatch(setCredentials(res.data));

        if (role === 'RESTAURANT') navigate('/restaurant/dashboard');
        else if (role === 'DELIVERY') navigate('/delivery/dashboard');
        else navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center text-white font-extrabold text-2xl mx-auto mb-3 shadow-md">
            F
          </div>
          <h2 className="text-2xl font-black text-slate-900">Create Account</h2>
          <p className="text-xs text-slate-500 mt-1">Join the FoodExpress platform</p>
        </div>

        {/* Role Selector */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2">Select Account Role</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'CUSTOMER', label: 'Customer', icon: User },
              { id: 'RESTAURANT', label: 'Owner', icon: UtensilsCrossed },
              { id: 'DELIVERY', label: 'Rider', icon: Bike },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRole(item.id)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                    role === item.id
                      ? 'border-brand-orange bg-rose-50 text-brand-orange shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-orange"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

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
            <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-orange"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-orange"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading}>
            <span>Register Account</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-orange hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
