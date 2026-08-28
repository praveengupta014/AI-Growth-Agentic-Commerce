import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { ArrowRight, Mail, Lock, User as UserIcon, Loader2, CheckCircle } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (isVerifying) {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Verification failed');
        localStorage.setItem('user', JSON.stringify(data));
        alert('Verification successful! You are now logged in.');
        window.location.href = '/';
      } else if (isLogin) {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        localStorage.setItem('user', JSON.stringify(data));
        alert('Login successful!');
        window.location.href = '/';
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        setIsVerifying(true);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pt-10 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
      >
        {/* Glow effect */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="p-8 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              {isVerifying ? 'Verify Email' : (isLogin ? 'Welcome Back' : 'Create Account')}
            </h1>
            <p className="text-gray-400 text-sm">
              {isVerifying ? `We sent a code to ${email}` : (isLogin ? 'Sign in to access your dashboard' : 'Join the future of agentic commerce')}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-xl text-center">
                {errorMsg}
              </div>
            )}
            
            {isVerifying ? (
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">One-Time Password (OTP)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <CheckCircle size={18} />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 ml-1">Check your email for the 6-digit code.</p>
              </div>
            ) : (
              <>
                {!isLogin && (
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <UserIcon size={18} />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                      />
                    </div>
                  </div>
                )}
            
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                </div>

                {isLogin && (
                  <div className="flex justify-end">
                    <a href="#" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                      Forgot Password?
                    </a>
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {isVerifying ? 'Verify OTP' : (isLogin ? 'Sign In' : 'Sign Up')}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {!isVerifying && (
            <>
              <div className="mt-8 relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative bg-neutral-900 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Or continue with
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  setIsLoading(true);
                  const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idToken: credentialResponse.credential })
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.message || 'Google Authentication failed');
                  localStorage.setItem('user', JSON.stringify(data));
                  alert('Google Login successful!');
                  window.location.href = '/';
                } catch (err) {
                  setErrorMsg(err.message);
                } finally {
                  setIsLoading(false);
                }
              }}
              onError={() => {
                setErrorMsg('Google Login Failed');
              }}
              theme="filled_black"
              shape="pill"
              text="continue_with"
              width="300"
            />
          </div>

              <div className="mt-8 text-center text-sm text-gray-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;