import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import { forgotPassword } from '../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMsg('');

    try {
      const res = await forgotPassword({ email });
      if (res.success) {
        setMsg(`OTP reset token sent: ${res.resetToken || '123456'}`);
      }
    } catch (err) {
      setError(err.message || 'Error sending reset OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900">Forgot Password</h2>
          <p className="text-xs text-slate-500 mt-1">Enter your registered email to receive an OTP</p>
        </div>

        {error && <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl">{error}</div>}
        {msg && <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl">{msg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-orange"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <Button type="submit" fullWidth loading={loading}>
            Send Reset OTP
          </Button>
        </form>

        <div className="text-center text-xs">
          <Link to="/reset-password" className="font-bold text-brand-orange hover:underline block mb-2">
            Have OTP? Reset Password here
          </Link>
          <Link to="/login" className="text-slate-400 hover:text-slate-600">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
