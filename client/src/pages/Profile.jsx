import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Phone, Mail, Camera, ShieldCheck } from 'lucide-react';
import Button from '../components/Button';
import { updateUser } from '../redux/slices/authSlice';
import API from '../services/api';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const res = await API.put('/users/profile', { name, phone, profileImage });
      if (res.data) {
        dispatch(updateUser(res.data));
        setMsg('Profile updated successfully!');
      }
    } catch (err) {
      setMsg(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Account Profile</h1>
        <p className="text-xs text-slate-500">Manage your personal information & preferences</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-rose-100 shadow-md mb-3">
            <img
              src={profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="px-3 py-1 bg-rose-50 text-brand-orange text-xs font-black rounded-full uppercase tracking-wider">
            {user?.role} Account
          </span>
        </div>

        {msg && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl text-center">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email (Read Only)</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Profile Image URL</label>
            <input
              type="text"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-orange"
            />
          </div>

          <Button type="submit" fullWidth loading={loading}>
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
