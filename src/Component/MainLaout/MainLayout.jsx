import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../Shared/Navbar';
import Footer from '../../Shared/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 selection:bg-emerald-500 selection:text-white transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;