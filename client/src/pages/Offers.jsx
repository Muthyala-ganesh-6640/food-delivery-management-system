import React, { useState, useEffect } from 'react';
import { Tag, Copy, Check } from 'lucide-react';
import Loader from '../components/Loader';
import API from '../services/api';

const Offers = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await API.get('/coupons');
      if (res.data) setCoupons(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  if (loading) return <Loader text="Fetching latest deals & promo codes..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Offers & Promo Codes</h1>
        <p className="text-xs text-slate-500">Save big on your next food order</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div key={c._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-rose-50 text-brand-orange text-xs font-black px-3 py-1 rounded-full uppercase">
                  {c.discountType === 'PERCENTAGE' ? `${c.discountAmount}% OFF` : `₹${c.discountAmount} OFF`}
                </span>
                <span className="text-[11px] text-slate-400">
                  Exp: {new Date(c.expiryDate).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-1">Code: {c.code}</h3>
              <p className="text-xs text-slate-500">{c.description}</p>
              <p className="text-[11px] text-slate-400 mt-2">
                Min Order: ₹{c.minOrderValue}
              </p>
            </div>

            <button
              onClick={() => handleCopy(c.code)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-dashed border-brand-orange bg-rose-50/50 text-brand-orange text-xs font-bold hover:bg-rose-100 transition-colors"
            >
              {copiedCode === c.code ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Code {c.code}</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
