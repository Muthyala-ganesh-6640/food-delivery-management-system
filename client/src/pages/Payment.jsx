import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { createPaymentOrder, verifyPayment } from '../services/paymentService';

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    if (orderId) {
      initiatePayment();
    }
  }, [orderId]);

  const initiatePayment = async () => {
    try {
      setLoading(true);
      const res = await createPaymentOrder(orderId);
      if (res.data) {
        setPaymentData(res.data);
        openRazorpaySDK(res.data);
      }
    } catch (err) {
      setError(err.message || 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  const openRazorpaySDK = (data) => {
    const options = {
      key: data.keyId || 'rzp_test_foodexpress123',
      amount: data.amount,
      currency: data.currency || 'INR',
      name: 'FoodExpress Platform',
      description: 'Food Order Payment',
      order_id: data.razorpayOrderId,
      handler: async (response) => {
        try {
          const verifyRes = await verifyPayment({
            orderId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (verifyRes.success) {
            navigate(`/orders/${orderId}?status=success`);
          }
        } catch (err) {
          setError(err.message || 'Payment verification failed');
        }
      },
      prefill: {
        name: 'FoodExpress Customer',
        email: 'customer@foodexpress.com',
      },
      theme: {
        color: '#FF5200',
      },
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // Fallback mock payment trigger for local offline testing
      setTimeout(async () => {
        try {
          const verifyRes = await verifyPayment({
            orderId,
            razorpayOrderId: data.razorpayOrderId,
            razorpayPaymentId: 'pay_mock_' + Date.now(),
            razorpaySignature: 'mock_signature_valid',
          });
          if (verifyRes.success) {
            navigate(`/orders/${orderId}?status=success`);
          }
        } catch (e) {
          setError(e.message);
        }
      }, 1000);
    }
  };

  if (loading) return <Loader text="Connecting to Razorpay secure gateway..." />;

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-brand-orange">
        <Lock className="w-10 h-10" />
      </div>

      <h2 className="text-2xl font-black text-slate-900">Razorpay Payment Gateway</h2>

      {error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl">
          <AlertCircle className="w-5 h-5 mx-auto mb-2 text-rose-600" />
          <p>{error}</p>
        </div>
      ) : (
        <p className="text-xs text-slate-500">
          Complete your payment in the Razorpay popup modal to confirm your food order.
        </p>
      )}

      <Button onClick={initiatePayment} fullWidth>
        Re-open Payment Gateway
      </Button>
    </div>
  );
};

export default Payment;
