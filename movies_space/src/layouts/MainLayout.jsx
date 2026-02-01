import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useAppStore } from '../store/useAppStore';

const MainLayout = () => {
  const { theme } = useAppStore();

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="bg-black text-white min-h-screen flex flex-col">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

          {/* Content - Premium background */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-black via-gray-900 to-black">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
