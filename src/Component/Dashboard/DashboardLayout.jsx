import React, { useContext, useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router';
import { AuthContext } from '../../AuthProvider/authProvider';
import { useTheme } from '../../AuthProvider/ThemeContext';
import {
  Scissors,
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  PlusCircle,
  Clock,
  CheckCircle,
  Truck,
  UserCheck,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, dbUser, logOut } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  const role = dbUser?.role || 'buyer';
  const isSuspended = dbUser?.status === 'suspended';

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
      isActive
        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-semibold'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
    }`;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header Brand */}
          <div className="h-18 px-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Scissors className="w-4 h-4 text-white transform -rotate-45" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-gray-900 dark:text-white font-heading">
                  Garments<span className="text-emerald-500">Tracker</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                  {role.toUpperCase()} WORKSPACE
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-4 mx-3 mt-4 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-200/70 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={user?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                alt={user?.displayName || "User"}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {user?.displayName || user?.email?.split('@')[0]}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {role}
                  </span>
                  {isSuspended ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                      <ShieldAlert className="w-2.5 h-2.5" /> Suspended
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      ● Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Menu Items */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-280px)]">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Dashboard Navigation
            </div>

            {/* ADMIN ONLY LINKS */}
            {role === 'admin' && (
              <>
                <NavLink to="/dashboard" end className={linkClasses} onClick={() => setSidebarOpen(false)}>
                  <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                  Analytics Overview
                </NavLink>
                <NavLink to="/dashboard/manage-users" className={linkClasses} onClick={() => setSidebarOpen(false)}>
                  <Users className="w-4 h-4 text-blue-500" />
                  Manage Users
                </NavLink>
                <NavLink to="/dashboard/all-products" className={linkClasses} onClick={() => setSidebarOpen(false)}>
                  <Package className="w-4 h-4 text-amber-500" />
                  All Products
                </NavLink>
                <NavLink to="/dashboard/all-orders" className={linkClasses} onClick={() => setSidebarOpen(false)}>
                  <ShoppingBag className="w-4 h-4 text-purple-500" />
                  All Orders
                </NavLink>
              </>
            )}

            {/* MANAGER ONLY LINKS */}
            {role === 'manager' && (
              <>
                <NavLink to="/dashboard/add-product" className={linkClasses} onClick={() => setSidebarOpen(false)}>
                  <PlusCircle className="w-4 h-4 text-emerald-500" />
                  Add Product
                </NavLink>
                <NavLink to="/dashboard/manage-products" className={linkClasses} onClick={() => setSidebarOpen(false)}>
                  <Package className="w-4 h-4 text-blue-500" />
                  Manage Products
                </NavLink>
                <NavLink to="/dashboard/pending-orders" className={linkClasses} onClick={() => setSidebarOpen(false)}>
                  <Clock className="w-4 h-4 text-amber-500" />
                  Pending Orders
                </NavLink>
                <NavLink to="/dashboard/approved-orders" className={linkClasses} onClick={() => setSidebarOpen(false)}>
                  <CheckCircle className="w-4 h-4 text-teal-500" />
                  Approved Orders & Tracking
                </NavLink>
              </>
            )}

            {/* BUYER / USER ONLY LINKS */}
            {role === 'buyer' && (
              <>
                <NavLink to="/dashboard/my-orders" className={linkClasses} onClick={() => setSidebarOpen(false)}>
                  <ShoppingBag className="w-4 h-4 text-emerald-500" />
                  My Orders
                </NavLink>
              </>
            )}

            {/* COMMON LINKS */}
            <div className="pt-4 px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Account & Utilities
            </div>

            <NavLink to="/dashboard/profile" className={linkClasses} onClick={() => setSidebarOpen(false)}>
              <UserCheck className="w-4 h-4 text-indigo-500" />
              My Profile
            </NavLink>

            <Link
              to="/allproduct"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-emerald-600 transition-colors"
            >
              <span className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-emerald-500" />
                Browse Catalog
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </Link>
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
          >
            Return to Public Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-18 px-6 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white font-heading capitalize">
                Garments Workflow Control
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                Real-time manufacturing tracking & inventory operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme switch */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              title={`Toggle ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon className="w-5 h-5 text-slate-700" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </button>

            {/* Profile Avatar */}
            <Link to="/dashboard/profile" className="flex items-center gap-2 p-1 rounded-full ring-2 ring-emerald-500/50 hover:ring-emerald-500">
              <img
                src={user?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                alt={user?.displayName || "Profile"}
                className="w-8 h-8 rounded-full object-cover"
              />
            </Link>
          </div>
        </header>

        {/* Dashboard Routed Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
