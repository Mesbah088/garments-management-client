import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { AuthContext } from '../AuthProvider/authProvider';
import { useTheme } from '../AuthProvider/ThemeContext';
import { 
  Scissors, 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Sun, 
  Moon, 
  ShoppingBag, 
  Layers,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { user, dbUser, logOut } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logOut();
    navigate('/');
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  // Determine role dashboard target
  const getDashboardLink = () => {
    if (dbUser?.role === 'admin') return '/dashboard';
    if (dbUser?.role === 'manager') return '/dashboard/manage-products';
    return '/dashboard/my-orders';
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 shadow-xs'
        : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-slate-800'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-lg text-base font-semibold transition-colors ${
      isActive
        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
        : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:bg-slate-800'
    }`;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-gray-200 dark:border-slate-800 shadow-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group"
            onClick={closeMenus}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Scissors className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-1 font-heading">
                Garments<span className="text-emerald-600 dark:text-emerald-400">Tracker</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500">
                Production & Order System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-3">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/allproduct" className={navLinkClass}>
              All-Product
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About Us
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>

            {user && (
              <NavLink to={getDashboardLink()} className={navLinkClass}>
                <span className="flex items-center gap-1.5">
                  <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                  Dashboard
                </span>
              </NavLink>
            )}
          </div>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors focus:outline-hidden"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-slate-700" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400" />
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-all border border-gray-200 dark:border-slate-700"
                >
                  <img
                    src={user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                    alt={user.displayName || "User"}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500"
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-100 max-w-[120px] truncate leading-tight">
                      {user.displayName || user.email?.split('@')[0]}
                    </p>
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded-sm bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                      {dbUser?.role || 'Buyer'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {user.displayName || "Garments Member"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                          Role: {dbUser?.role ? dbUser.role.toUpperCase() : 'BUYER'}
                        </span>
                        {dbUser?.status === 'suspended' && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">
                            Suspended
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to={getDashboardLink()}
                        onClick={closeMenus}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-600"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                        Dashboard
                      </Link>

                      <Link
                        to="/dashboard/profile"
                        onClick={closeMenus}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-600"
                      >
                        <User className="w-4 h-4 text-emerald-500" />
                        My Profile
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-medium text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger & Theme Switch */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <NavLink to="/" onClick={closeMenus} className={mobileNavLinkClass}>
            Home
          </NavLink>
          <NavLink to="/allproduct" onClick={closeMenus} className={mobileNavLinkClass}>
            All-Product
          </NavLink>
          <NavLink to="/about" onClick={closeMenus} className={mobileNavLinkClass}>
            About Us
          </NavLink>
          <NavLink to="/contact" onClick={closeMenus} className={mobileNavLinkClass}>
            Contact
          </NavLink>

          {user ? (
            <div className="pt-3 border-t border-gray-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-slate-800/60 rounded-xl">
                <img
                  src={user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                  alt={user.displayName || "User"}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500"
                />
                <div className="truncate">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {user.displayName || user.email}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                    {dbUser?.role || 'Buyer'}
                  </p>
                </div>
              </div>

              <Link
                to={getDashboardLink()}
                onClick={closeMenus}
                className="flex items-center gap-2 px-4 py-2.5 text-base font-semibold text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg"
              >
                <LayoutDashboard className="w-5 h-5 text-emerald-500" />
                Dashboard
              </Link>

              <Link
                to="/dashboard/profile"
                onClick={closeMenus}
                className="flex items-center gap-2 px-4 py-2.5 text-base font-semibold text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg"
              >
                <User className="w-5 h-5 text-emerald-500" />
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-base font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg text-left"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={closeMenus}
                className="w-full text-center py-2.5 text-base font-semibold text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-slate-700 rounded-xl"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenus}
                className="w-full text-center py-2.5 text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
