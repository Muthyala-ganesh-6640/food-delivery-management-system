import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Key, Lock } from 'lucide-react';
import Button from '../components/Button';
import { resetPassword } from '../services/authService';

const ResetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await resetPassword({ email, resetToken, newPassword });
      if (res.success) {
        setMsg('Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900">Reset Password</h2>
          <p className="text-xs text-slate-500 mt-1">Enter your OTP and new password</p>
        </div>

        {error && <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl">{error}</div>}
        {msg && <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl">{msg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Reset OTP Token</label>
            <input
              type="text"
              required
              placeholder="6-digit OTP"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">New Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <Button type="submit" fullWidth loading={loading}>
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
