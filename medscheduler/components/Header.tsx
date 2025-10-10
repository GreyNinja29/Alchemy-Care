
import React from 'react';
import { Pill } from './icons';

interface HeaderProps {
  userName: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, onLogout }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Pill className="h-8 w-8 text-blue-600" />
            <span className="ml-3 text-xl font-bold text-slate-800">MedScheduler</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-700 mr-4 hidden sm:block">
              Welcome, <span className="font-semibold">{userName}</span>
            </span>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
