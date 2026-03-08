import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {AuthContext} from '../AuthProvider/authProvider'
import { Heart, Menu, X, User, LogOut, Plus, List, MessageCircle } from 'lucide-react';

export default function Navbar() {

   const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);


    const handleLogout = () => {
    logOut();
    navigate('/');
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };


    const closeMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };
  return (
    <nav className="bg-white shadow  max-w-7xl mx-auto top-0 z-50">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="flex justify-between items-center h-16">
                      {/* Logo */}
                      <Link 
                      to="/"
                       className="flex items-center space-x-2"
                           onClick={closeMenus}
                      >
                         <div className="bg-emerald-500 p-2 rounded-lg group-hover:bg-emerald-600 transition-colors">
                               <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">GarmentsTracker</span>
                      </Link>
                        
                     <div className="hidden md:flex items-center space-x-8">
                            <Link 
              to="/" 
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Home
            </Link>
                <Link 
              to="/allproduct" 
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
             All-Product
            </Link>
                <Link 
              to="/about" 
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
             About Us
            </Link>
                <Link 
              to="/contact" 
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Contact
            </Link>

                {user ? (
              <>
                <Link 
                  to="/add-food" 
                  className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Food</span>
                </Link>
                
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors focus:outline-none"
                  >
                    <div className="bg-emerald-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <Link 
                        to="/manage-foods" 
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={closeMenus}
                      >
                        <List className="h-4 w-4" />
                        <span>Manage Foods</span>
                      </Link>
                      <Link 
                        to="/food-requests" 
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={closeMenus}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Food Requests</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                >
                  Register
                </Link>
              </div>
            )}
 </div>
  {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-emerald-600 transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
 </div>
  {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4 px-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2"
                onClick={closeMenus}
              >
                Home
              </Link>
              <Link 
                to="/allproduct" 
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2"
                onClick={closeMenus}
              >
                All Product
              </Link>
                 <Link 
                to="/about" 
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2"
                onClick={closeMenus}
              >
                About us
              </Link>
                 <Link 
                to="/contact" 
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2"
                onClick={closeMenus}
              >
             Contact
              </Link>

              {user ? (
                <>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <div className="bg-emerald-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <Link 
                    to="/add-food" 
                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center space-x-2"
                    onClick={closeMenus}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Food</span>
                  </Link>
                  <Link 
                    to="/manage-foods" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors py-2"
                    onClick={closeMenus}
                  >
                    <List className="h-4 w-4" />
                    <span>Manage Foods</span>
                  </Link>
                  <Link 
                    to="/food-requests" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors py-2"
                    onClick={closeMenus}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Food Requests</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors text-left py-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2"
                    onClick={closeMenus}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors font-medium text-center"
                    onClick={closeMenus}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

          </div>
    </nav>
  );
}

