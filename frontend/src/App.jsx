import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Bot, Activity, Menu, X, Trash2, ArrowRight, Loader2, ChevronDown, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './components/Home';
import Chat from './components/Chat';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Orders from './components/Orders';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'address'
  const [shippingAddress, setShippingAddress] = useState({ street: '', city: '', postalCode: '' });
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  const buyNow = (product) => {
    setCart(prev => [...prev, product]);
    setCheckoutStep('address');
    setIsCartOpen(true);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const cartTotal = cart.reduce((total, product) => {
    const priceAmount = parseInt(product.price.replace(/[^0-9]/g, ''));
    return total + priceAmount;
  }, 0);

  const handleCartCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutStep('address');
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      alert("Please fill in all address fields");
      return;
    }
    
    setIsCheckingOut(true);
    
    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Please check your connection.');
      setIsCheckingOut(false);
      return;
    }

    try {
      const orderResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: cartTotal,
          products: cart.map(p => p.id),
          userId: user ? user._id : null,
          shippingAddress
        })
      });
      const orderData = await orderResponse.json();

      const options = {
        key: 'rzp_test_TTKPTDs2KlXZPH', // Test key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Agentic Commerce',
        description: `Purchase of ${cart.length} items`,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: orderData.dbOrderId
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              alert('Payment successful! Your order has been placed.');
              setCart([]);
              setIsCartOpen(false);
              setCheckoutStep('cart');
            } else {
              alert('Payment verification failed.');
            }
          } catch (err) {
            console.error('Verification error', err);
          }
        },
        prefill: { name: user?.name || 'Guest User', email: user?.email || 'guest@example.com', contact: '9999999999' },
        theme: { color: '#6366f1' },
        modal: {
          ondismiss: () => setIsCheckingOut(false)
        }
      };
      
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error('Checkout error', err);
      setIsCheckingOut(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
      <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-indigo-500/30">
        <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2 z-50">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                  A
                </div>
                <span className="font-semibold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Agentic Commerce
                </span>
              </Link>
              
              {/* Desktop Nav */}
              <div className="hidden md:flex gap-6 items-center text-sm font-medium text-gray-300">
                <Link to="/" className="hover:text-white transition-colors duration-200">Catalog</Link>
                <Link to="/chat" className="hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Bot size={16} className="text-indigo-400" />
                  AI Agent
                </Link>
                <Link to="/audit" className="hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Activity size={16} className="text-rose-400" />
                  Audit
                </Link>
                
                {user && (
                  <Link to="/orders" className="hover:text-white transition-colors duration-200 text-indigo-400">
                    My Orders
                  </Link>
                )}
                
                <div className="h-6 w-px bg-white/10 mx-2"></div>
                
                {user ? (
                  <div className="relative">
                    <button 
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      onBlur={() => setTimeout(() => setIsProfileDropdownOpen(false), 200)}
                      className="flex items-center gap-2 hover:bg-white/5 px-2 py-1.5 rounded-lg transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-xs border border-indigo-500/50">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="text-sm font-medium text-gray-200">
                        {user.name || 'User'}
                      </span>
                      <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {isProfileDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                        >
                          <div className="px-4 py-3 border-b border-white/10">
                            <p className="text-sm font-medium text-white truncate">{user.name || 'User'}</p>
                            <p className="text-xs text-gray-400 truncate mt-0.5">{user.email || ''}</p>
                          </div>
                          <div className="p-2">
                            <button 
                              onClick={handleLogout} 
                              className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <LogOut size={14} />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link to="/login" className="hover:text-white transition-colors duration-200">
                    <User size={18} />
                  </Link>
                )}
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative hover:text-white transition-colors duration-200 group ml-2"
                >
                  <ShoppingCart size={18} />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-neutral-900 group-hover:scale-110 transition-transform">
                      {cart.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center gap-4 z-50">
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative hover:text-white transition-colors duration-200"
                >
                  <ShoppingCart size={18} />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-neutral-900">
                      {cart.length}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-300 hover:text-white focus:outline-none"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Nav Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-16 left-0 w-full bg-neutral-900/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col gap-4 md:hidden shadow-2xl z-40"
              >
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/" className="text-gray-300 hover:text-white font-medium p-2 rounded-lg hover:bg-white/5">Catalog</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/chat" className="text-gray-300 hover:text-white font-medium flex items-center gap-2 p-2 rounded-lg hover:bg-white/5">
                  <Bot size={18} className="text-indigo-400" /> AI Agent
                </Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/audit" className="text-gray-300 hover:text-white font-medium flex items-center gap-2 p-2 rounded-lg hover:bg-white/5">
                  <Activity size={18} className="text-rose-400" /> Audit
                </Link>
                {user && (
                  <Link onClick={() => setIsMobileMenuOpen(false)} to="/orders" className="text-gray-300 hover:text-white font-medium p-2 rounded-lg hover:bg-white/5 text-indigo-400">
                    My Orders
                  </Link>
                )}
                
                <div className="h-px w-full bg-white/10 my-2"></div>
                
                {user ? (
                  <div className="mt-2 bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-medium text-white truncate">Hi, {user.name || 'User'}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{user.email || ''}</p>
                    </div>
                    <button 
                      onClick={handleLogout} 
                      className="w-full px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link onClick={() => setIsMobileMenuOpen(false)} to="/login" className="text-gray-300 hover:text-white font-medium flex items-center gap-2 p-2 rounded-lg hover:bg-white/5">
                    <User size={18} /> Login
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Cart Slide-over Modal */}
        <AnimatePresence>
          {isCartOpen && (
            <div className="fixed inset-0 z-[100] flex justify-end">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsCartOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              ></motion.div>
              
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full max-w-md bg-neutral-900 border-l border-white/10 h-full shadow-2xl flex flex-col"
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <ShoppingCart size={20} className="text-indigo-400" /> 
                    {checkoutStep === 'address' ? 'Shipping Details' : 'Your Cart'}
                  </h2>
                  <button 
                    onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); }}
                    className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {checkoutStep === 'cart' ? (
                  <>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                          <ShoppingCart size={48} className="mb-4 opacity-20" />
                          <p>Your cart is empty.</p>
                          <button 
                            onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); }}
                            className="mt-4 text-indigo-400 hover:text-indigo-300"
                          >
                            Browse Catalog
                          </button>
                        </div>
                      ) : (
                        cart.map((item, idx) => (
                          <div key={idx} className="flex gap-4 p-3 rounded-xl bg-black/40 border border-white/5 items-center">
                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-neutral-800" />
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-white leading-tight line-clamp-1">{item.name}</h4>
                              <p className="text-xs text-gray-400 mt-1">{item.tag}</p>
                              <p className="text-sm font-semibold text-indigo-400 mt-1">{item.price}</p>
                            </div>
                            <button 
                              onClick={() => removeFromCart(idx)}
                              className="p-2 text-gray-500 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {cart.length > 0 && (
                      <div className="p-6 border-t border-white/10 bg-black/40">
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-gray-400">Total</span>
                          <span className="text-2xl font-bold text-white">${cartTotal.toLocaleString()}</span>
                        </div>
                        <button 
                          onClick={handleCartCheckout}
                          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2"
                        >
                          Proceed to Shipping
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <form onSubmit={handleProceedToPayment} className="flex-1 flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Street Address</label>
                        <input 
                          type="text" 
                          required
                          value={shippingAddress.street}
                          onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                          placeholder="123 AI Boulevard"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
                        <input 
                          type="text" 
                          required
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                          placeholder="San Francisco"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Postal Code</label>
                        <input 
                          type="text" 
                          required
                          value={shippingAddress.postalCode}
                          onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                          placeholder="94105"
                        />
                      </div>
                    </div>
                    <div className="p-6 border-t border-white/10 bg-black/40 flex flex-col gap-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Amount to Pay</span>
                        <span className="text-xl font-bold text-white">${cartTotal.toLocaleString()}</span>
                      </div>
                      <button 
                        type="submit"
                        disabled={isCheckingOut}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-medium px-6 py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2"
                      >
                        {isCheckingOut ? <Loader2 size={18} className="animate-spin" /> : 'Pay Now'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setCheckoutStep('cart')}
                        className="w-full bg-transparent hover:bg-white/5 text-gray-400 font-medium px-6 py-3 rounded-xl transition-all flex items-center justify-center"
                      >
                        Back to Cart
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Home addToCart={addToCart} buyNow={buyNow} />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
              <Route path="/audit" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
