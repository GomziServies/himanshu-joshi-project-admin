import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ErrorNotice } from '../components/ErrorNotice';
import { Diya, Toran } from '../components/layout/Ornaments';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-sanctum">
      <img
        src="/salahkareshwar-shivling.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sanctum/40 to-sanctum" />
      <Toran className="relative" />

      <div className="relative flex flex-1 items-center justify-center px-4 pb-10">
        <div className="w-full max-w-sm overflow-hidden rounded-t-[11rem] rounded-b-2xl border border-brass-500 bg-ivory-50 shadow-2xl">
          <div className="jaali bg-sanctum px-6 pb-5 pt-9 text-center">
            <Diya className="mx-auto h-14 w-14" />
            <p lang="hi" className="mt-1 font-deva text-2xl leading-snug text-brass-300">सलाहकारेश्वर महादेव</p>
            <h1 className="mt-1 font-title text-xl text-ivory-50">Admin login</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            {error && <ErrorNotice message={error} />}

            <div>
              <label htmlFor="login-email" className="label">Email</label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="label">Password</label>
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full !py-2.5 text-lg">
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
