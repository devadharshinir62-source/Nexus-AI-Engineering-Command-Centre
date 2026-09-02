import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <form className="w-full max-w-sm space-y-4 rounded bg-gray-800 p-6" onSubmit={handleSubmit}>
        <h2 className="text-center text-xl font-bold text-white">Login</h2>
        {error && <div className="text-center text-sm text-red-500">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-cyan-600 py-2 font-semibold text-white hover:bg-cyan-500"
        >
          Sign In
        </button>
        <div className="text-center text-sm text-gray-400">
          Don’t have an account? <a href="/register" className="text-cyan-400 hover:underline">Register</a>
        </div>
      </form>
    </div>
  );
};
