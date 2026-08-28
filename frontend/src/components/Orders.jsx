import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, MapPin, CreditCard, Loader2 } from 'lucide-react';
import { loadRazorpayScript } from '../App';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/user/${user._id}`);
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?._id) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user?._id]);

  const getStatusIcon = (status, currentStatus) => {
    const statuses = ['processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(currentStatus);
    const stepIndex = statuses.indexOf(status);
    
    if (stepIndex < currentIndex || currentStatus === 'delivered') return <CheckCircle size={16} className="text-emerald-400" />;
    if (stepIndex === currentIndex) return <Clock size={16} className="text-indigo-400 animate-pulse" />;
    return <div className="w-4 h-4 rounded-full border-2 border-gray-600" />;
  };
  
  const getStatusColor = (status, currentStatus) => {
    const statuses = ['processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(currentStatus);
    const stepIndex = statuses.indexOf(status);
    
    if (stepIndex <= currentIndex) return "text-white";
    return "text-gray-500";
  };

  const getLineColor = (status, currentStatus) => {
    const statuses = ['processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(currentStatus);
    const stepIndex = statuses.indexOf(status);
    
    if (stepIndex < currentIndex) return "bg-emerald-400";
    if (stepIndex === currentIndex) return "bg-gradient-to-r from-emerald-400 to-gray-600";
    return "bg-gray-600";
  };

  const handlePayLater = async (order) => {
    setProcessingId(order._id);
    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Please check your connection.');
      setProcessingId(null);
      return;
    }

    const options = {
      key: 'rzp_test_TTKPTDs2KlXZPH', // Test key
      amount: order.totalAmount * 100, // amount in paise
      currency: "INR",
      name: 'Agentic Commerce',
      description: `Payment for Order ${order._id}`,
      order_id: order.razorpayOrderId,
      handler: async function (response) {
        try {
          const verifyRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId: order._id
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert('Payment successful!');
            // Refetch orders
            const ordersRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/user/${user._id}`);
            const data = await ordersRes.json();
            setOrders(data);
          } else {
            alert('Payment verification failed.');
          }
        } catch (err) {
          console.error('Verification error', err);
        } finally {
          setProcessingId(null);
        }
      },
      prefill: { name: user?.name || 'Guest User', email: user?.email || 'guest@example.com', contact: '9999999999' },
      theme: { color: '#6366f1' },
      modal: {
        ondismiss: () => setProcessingId(null)
      }
    };
    
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Orders</h1>
        <p className="text-gray-400">Track your recent purchases and view shipping details.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-neutral-900 border border-white/5 rounded-3xl p-12 text-center shadow-xl">
          <Package size={64} className="mx-auto text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No orders found</h2>
          <p className="text-gray-400">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, idx) => {
            // Map created/paid to processing for UI simplicity
            const displayStatus = ['created', 'paid'].includes(order.status) ? 'processing' : order.status;
            
            return (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden shadow-xl"
              >
                <div className="bg-black/40 p-4 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order ID</p>
                    <p className="text-sm font-mono text-indigo-300">{order._id}</p>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</p>
                      <p className="text-sm text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total</p>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-bold text-white">${order.totalAmount.toLocaleString()}</p>
                        {(order.status === 'created' || order.status === 'failed') && (
                          <button 
                            onClick={() => handlePayLater(order)}
                            disabled={processingId === order._id}
                            className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all shadow-[0_0_10px_rgba(99,102,241,0.3)] flex items-center gap-1"
                          >
                            {processingId === order._id ? <Loader2 size={12} className="animate-spin" /> : <CreditCard size={12} />}
                            Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  {/* Tracking Timeline */}
                  <div className="mb-8">
                    <p className="text-sm font-medium text-white mb-6 flex items-center gap-2">
                      <Truck size={16} className="text-indigo-400" />
                      Tracking Status
                    </p>
                    <div className="flex items-center justify-between relative px-4">
                      {/* Lines */}
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 flex px-6">
                        <div className={`h-full w-1/2 ${getLineColor('processing', displayStatus)} transition-colors duration-500`}></div>
                        <div className={`h-full w-1/2 ${getLineColor('shipped', displayStatus)} transition-colors duration-500`}></div>
                      </div>
                      
                      {/* Steps */}
                      <div className="relative z-10 flex flex-col items-center gap-2 bg-neutral-900 px-2">
                        <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center">
                          {getStatusIcon('processing', displayStatus)}
                        </div>
                        <span className={`text-xs font-medium ${getStatusColor('processing', displayStatus)}`}>Processing</span>
                      </div>
                      
                      <div className="relative z-10 flex flex-col items-center gap-2 bg-neutral-900 px-2">
                        <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center">
                          {getStatusIcon('shipped', displayStatus)}
                        </div>
                        <span className={`text-xs font-medium ${getStatusColor('shipped', displayStatus)}`}>Shipped</span>
                      </div>
                      
                      <div className="relative z-10 flex flex-col items-center gap-2 bg-neutral-900 px-2">
                        <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center">
                          {getStatusIcon('delivered', displayStatus)}
                        </div>
                        <span className={`text-xs font-medium ${getStatusColor('delivered', displayStatus)}`}>Delivered</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <MapPin size={14} /> Shipping Address
                      </p>
                      <p className="text-sm text-gray-300">
                        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                      </p>
                    </div>
                  )}
                  
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
