import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@temple.org');
  const [password, setPassword] = useState('Admin@Temple108!');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: unknown) {
      const errObj = err as Error;
      setError(errObj.message || 'Login failed. Please verify admin credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border-2 border-[#E8DFD8] shadow-xl overflow-hidden">
        {/* Brown Header */}
        <div className="bg-[#5C3A21] p-8 text-white text-center border-b border-[#4A2E1A]">
          <div className="w-16 h-16 rounded-2xl bg-white text-[#5C3A21] mx-auto flex items-center justify-center font-serif text-3xl font-bold shadow-md mb-3">
            ॐ
          </div>
          <span className="text-xs uppercase tracking-widest text-[#E8DFD8] font-semibold block">
            Temple Administration Console
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
            Sign In to Sanctum Portal
          </h2>
          <p className="text-xs text-[#E8DFD8] mt-1">
            Brown & White Executive Management Suite
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5 text-xs text-[#2D1E12]">
          {error && (
            <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="login-email" className="block font-medium text-[#5C3A21] mb-1">
              Administrator Email
            </label>
            <div className="relative">
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@temple.org"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#E8DFD8] focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none text-sm text-[#2D1E12]"
              />
              <Mail className="w-4 h-4 text-[#8B5A2B] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block font-medium text-[#5C3A21] mb-1">
              Master Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#E8DFD8] focus:ring-2 focus:ring-[#8B5A2B] focus:outline-none text-sm text-[#2D1E12]"
              />
              <Lock className="w-4 h-4 text-[#8B5A2B] absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-[#5C3A21] hover:bg-[#4A2E1A] text-white font-serif text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#C59B27]" />
            <span>{isLoading ? 'Authenticating...' : 'Sign In as Administrator'}</span>
          </button>

          {/* Quick Demo Credentials Info */}
          <div className="p-3.5 rounded-lg bg-[#FDFBF7] border border-[#E8DFD8] text-[#8B5A2B] text-[11px] space-y-1">
            <p className="font-semibold text-[#5C3A21] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              Default Administrator Credentials:
            </p>
            <p>
              Email: <code className="bg-white px-1.5 py-0.5 rounded border border-[#E8DFD8] font-mono text-[#5C3A21]">admin@temple.org</code>
            </p>
            <p>
              Password: <code className="bg-white px-1.5 py-0.5 rounded border border-[#E8DFD8] font-mono text-[#5C3A21]">Admin@Temple108!</code>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
