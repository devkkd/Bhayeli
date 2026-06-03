"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 1000);
      } else {
        setMessage({ type: 'error', text: data.message });
        setLoading(false);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
      setLoading(false);
    }
  };



  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#faf8f5] via-[#f5f0e8] to-[#ede7dd] overflow-hidden px-4 py-12">
      {/* Floating Light Accents - Subtle soft glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#1a1a2e]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#bfa15f]/15 blur-[120px] pointer-events-none" />

      {/* Subtle traditional grid texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1a1a2e03_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      <div className="w-full max-w-[420px] z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-white p-[3px] shadow-[0_8px_30px_rgb(26,26,46,0.06)] border border-[#e5dfd5] mb-4 transition-all duration-500 hover:scale-105">
            <img src="/image/logo.png" alt="Bhayeli Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <h1 className="text-3xl font-bold text-[#1a1a2e] tracking-wider font-philosopher">
            BHAYELI
          </h1>
          <div className="h-0.5 w-12 bg-[#bfa15f]/60 my-2 rounded-full" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold font-montserrat">
            Administration Portal
          </p>
        </div>

        {/* Login Box Container */}
        <div className="bg-white/70 border border-[#e5dfd5]/80 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(26,26,46,0.05)] p-8 transition-all duration-300">
          
          <h2 className="text-lg text-[#1a1a2e] font-bold mb-6 text-center font-philosopher uppercase tracking-wider">
            Sign In
          </h2>

          {/* Feedback Messages */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-xs leading-relaxed border ${
              message.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}>
              <div className="flex items-start gap-2.5">
                <span className="text-base mt-px">{message.type === 'success' ? '✓' : '⚠'}</span>
                <div>{message.text}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Username Input */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest font-montserrat">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  disabled={loading}
                  className="w-full bg-[#fdfdfc] border border-[#e5dfd5] rounded-xl px-4 py-3.5 text-xs text-[#1a1a2e] placeholder:text-gray-400 outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]/20 transition-all font-sans"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest font-montserrat">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  disabled={loading}
                  className="w-full bg-[#fdfdfc] border border-[#e5dfd5] rounded-xl pl-4 pr-11 py-3.5 text-xs text-[#1a1a2e] placeholder:text-gray-400 outline-none focus:border-[#1a1a2e] focus:ring-1 focus:ring-[#1a1a2e]/20 transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#1a1a2e] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 hover:bg-black hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Access Dashboard →</span>
              )}
            </button>
          </form>



        </div>

        {/* Footer Credits */}
        <p className="text-center text-[10px] text-gray-400 mt-8 tracking-widest font-sans">
          SECURE ENCRYPTION ENFORCED • BHAYELI ADMIN 2026
        </p>

      </div>
    </main>
  );
}
