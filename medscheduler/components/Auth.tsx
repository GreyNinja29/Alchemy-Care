
import React, { useState } from 'react';
import { apiLogin, apiSignup } from '../services/api';
import type { User } from '../types';

interface AuthProps {
  onLogin: (user: User, token: string) => void;
}

type AuthMode = 'login' | 'signup';

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response =
        mode === 'login'
          ? await apiLogin({ email, password })
          : await apiSignup({ userName, email, password });
      onLogin({ userName: response.userName }, response.jwtToken);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setEmail('');
    setPassword('');
    setUserName('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div>
            <h1 className="text-3xl font-bold text-center text-slate-800">MedScheduler</h1>
            <p className="mt-2 text-center text-sm text-gray-600">
                Welcome! Please {mode} to continue.
            </p>
        </div>
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => switchMode('login')}
            className={`w-1/2 py-4 text-sm font-medium text-center transition-colors duration-300 ${
              mode === 'login'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => switchMode('signup')}
            className={`w-1/2 py-4 text-sm font-medium text-center transition-colors duration-300 ${
              mode === 'signup'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="relative">
                <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
                    placeholder=" "
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <label
                    htmlFor="username"
                    className="absolute left-4 top-3 text-gray-500 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600"
                    style={{pointerEvents: 'none'}}
                >
                    Username
                </label>
            </div>
          )}
          <div className="relative">
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
                htmlFor="email-address"
                className="absolute left-4 top-3 text-gray-500 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600"
                style={{pointerEvents: 'none'}}
            >
                Email address
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
            />
            <label
                htmlFor="password"
                className="absolute left-4 top-3 text-gray-500 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600"
                style={{pointerEvents: 'none'}}
            >
                Password
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-solid rounded-full animate-spin border-t-transparent"></div>
              ) : (
                mode === 'login' ? 'Login' : 'Create Account'
              )}
            </button>
          </div>
           <div className="text-center">
                <p className="text-sm text-gray-500">or continue with</p>
                <a href="http://localhost:8080/oauth2/authorize/google" className="inline-flex items-center justify-center w-full px-4 py-3 mt-4 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.1 6.25C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v8.51h13.01c-.54 2.77-2.03 5.15-4.34 6.78l6.85 6.85c3.98-3.66 6.42-8.98 6.42-15.14z"></path>
                        <path fill="#FBBC05" d="M10.66 28.71c-.53-1.62-.83-3.34-.83-5.17s.3-3.55.83-5.17l-8.1-6.25C.92 15.11 0 19.35 0 24c0 4.65.92 8.89 2.56 12.78l8.1-6.07z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-6.85-6.85c-2.15 1.45-4.92 2.3-8.04 2.3-6.26 0-11.57-4.22-13.47-9.91l-8.1 6.25C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                    Google
                </a>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
