
import React, { useState, useEffect, useCallback } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import type { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = useCallback((loggedInUser: User, jwtToken: string) => {
    localStorage.setItem('jwtToken', jwtToken);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setToken(jwtToken);
    setUser(loggedInUser);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {user && token ? (
        <>
          <Header userName={user.userName} onLogout={handleLogout} />
          <main className="p-4 sm:p-6 lg:p-8">
            <Dashboard token={token} />
          </main>
        </>
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
