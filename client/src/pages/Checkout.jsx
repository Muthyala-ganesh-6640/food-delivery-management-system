import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, CreditCard, Banknote, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import API from '../services/api';
import { createOrder } from '../services/orderService';
import { clearCartState } from '../redux/slices/cartSlice';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { items, restaurant, subtotal, deliveryFee, tax, discount, coupon, total } = useSelector(
    (state) => state.cart
  );

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state for new address
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    houseNo: '',
    street: '',
    area: '',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '',
    landmark: '',
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await API.get('/users/addresses');
      if (res.data && res.data.length > 0) {
        setAddresses(res.data);
        const def = res.data.find((a) => a.isDefault) || res.data[0];
        setSelectedAddress(def);
      } else {
        setShowNewAddress(true);
      }
    } catch (err) {
      console.error('Fetch addresses error:', err);
    }
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/users/addresses', newAddr);
      if (res.data) {
        setAddresses([...addresses, res.data]);
        setSelectedAddress(res.data);
        setShowNewAddress(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress && !showNewAddress) {
      setError('Please select or add a delivery address');
      return;
    }

    const addrToUse = selectedAddress || {
      name: user?.name,
      phone: user?.phone,
      ...newAddr,
    };

    setLoading(true);
    setError('');

    try {
      const formattedItems = items.map((i) => ({
        food: i.food?._id || i.food,
        name: i.food?.name || i.name,
        image: i.food?.image || '',
        price: i.price,
        quantity: i.quantity,
        specialInstructions: i.specialInstructions || '',
      }));

      const res = await createOrder({
        restaurantId: restaurant._id || restaurant,
        items: formattedItems,
        address: addrToUse,
        paymentMethod,
        couponCode: coupon,
        specialInstructions,
      });

      if (res.data) {
        dispatch(clearCartState());

        if (paymentMethod === 'RAZORPAY') {
          navigate(`/payment?orderId=${res.data._id}`);
        } else {
          navigate(`/orders/${res.data._id}`);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-black text-slate-900 mb-8">Checkout</h1>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Info */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm mb-3">Customer Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Name</span>
                <span className="font-bold text-slate-800">{user?.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Phone</span>
                <span className="font-bold text-slate-800">{user?.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Email</span>
                <span className="font-bold text-slate-800">{user?.email}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address Selector */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-orange" />
                <span>Select Delivery Address</span>
              </h3>
              <button
                onClick={() => setShowNewAddress(!showNewAddress)}
                className="text-xs font-bold text-brand-orange hover:underline"
              >
                {showNewAddress ? 'Cancel' : '+ Add New Address'}
              </button>
            </div>

            {showNewAddress ? (
              <form onSubmit={handleAddNewAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <input
                  type="text"
                  placeholder="House / Flat No."
                  required
                  value={newAddr.houseNo}
                  onChange={(e) => setNewAddr({ ...newAddr, houseNo: e.target.value })}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  required
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  placeholder="Area / Locality"
                  required
                  value={newAddr.area}
                  onChange={(e) => setNewAddr({ ...newAddr, area: e.target.value })}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  required
                  value={newAddr.pincode}
                  onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  placeholder="Landmark (Optional)"
                  value={newAddr.landmark}
                  onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="submit"
                  className="sm:col-span-2 bg-slate-900 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-slate-800"
                >
                  Save Address
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedAddress?._id === addr._id
                        ? 'border-brand-orange bg-rose-50/50 ring-2 ring-brand-orange/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase text-brand-orange bg-rose-100 px-2 py-0.5 rounded mb-2 inline-block">
                      {addr.type || 'Home'}
                    </span>
                    <p className="text-xs font-bold text-slate-800">{addr.houseNo}, {addr.street}</p>
                    <p className="text-xs text-slate-500">{addr.area}, {addr.city} - {addr.pincode}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Payment Method</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPaymentMethod('RAZORPAY')}
                className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'RAZORPAY'
                    ? 'border-brand-orange bg-rose-50/50 ring-2 ring-brand-orange/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Online Payment (Razorpay)</h4>
                  <p className="text-[11px] text-slate-400">Cards, UPI, NetBanking, Wallets</p>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-brand-orange bg-rose-50/50 ring-2 ring-brand-orange/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Cash on Delivery</h4>
                  <p className="text-[11px] text-slate-400">Pay cash when rider arrives</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit space-y-4">
          <h3 className="font-bold text-slate-800 text-sm pb-3 border-b border-slate-100">
            Order Items ({items.length})
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map((i) => (
              <div key={i._id} className="flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium">
                  {i.quantity}x {i.food?.name || i.name}
                </span>
                <span className="font-bold text-slate-900">₹{i.price * i.quantity}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs font-medium text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & Charges</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount</span>
                <span>- ₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-slate-100 text-base font-extrabold text-slate-900">
              <span>Total Payable</span>
              <span className="text-brand-orange">₹{total}</span>
            </div>
          </div>

          <Button
            fullWidth
            size="lg"
            loading={loading}
            onClick={handlePlaceOrder}
          >
            <span>{paymentMethod === 'RAZORPAY' ? 'Proceed to Pay' : 'Confirm Order'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
