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

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 via-black to-black">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
