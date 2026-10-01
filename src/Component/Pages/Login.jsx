import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useForm } from 'react-hook-form';
import { 
  Scissors, 
  Mail, 
  Lock, 
  LogIn, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Briefcase, 
  ShoppingBag, 
  Zap, 
  Sparkles 
} from 'lucide-react';
import { AuthContext } from '../../AuthProvider/authProvider';
import usePageTitle from '../../Shared/usePageTitle';

export default function Login() {
  usePageTitle('Login');

  const { logInUser, googleLogin, demoLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await logInUser(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  // Instant 1-Click Demo Login
  const handleFastDemoLogin = async (role) => {
    setDemoLoading(true);
    try {
      await demoLogin(role);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setDemoLoading(false);
    }
  };

  // Prefill Form Fields
  const handlePrefill = (email, password) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
  };

  const demoAccounts = [
    {
      role: 'admin',
      title: 'Administrator',
      email: 'admin@garmentstracker.com',
      pass: 'Admin@123',
      badgeBg: 'bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300',
      icon: <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
    },
    {
      role: 'manager',
      title: 'Production Manager',
      email: 'manager@garmentstracker.com',
      pass: 'Manager@123',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300',
      icon: <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
    },
    {
      role: 'buyer',
      title: 'Wholesale Buyer',
      email: 'buyer@garmentstracker.com',
      pass: 'Buyer@123',
      badgeBg: 'bg-cyan-100 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300',
      icon: <ShoppingBag className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
    }
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Scissors className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-gray-950 dark:text-white font-heading">
              Garments<span className="text-emerald-600 dark:text-emerald-400">Tracker</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-heading">
            Sign In to Workspace
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to access your system dashboard
          </p>
        </div>

        {/* Quick Role Tester Bar */}
        <div className="p-3.5 bg-gray-50 dark:bg-slate-900/80 rounded-2xl border border-gray-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Zap className="w-3.5 h-3.5" /> Quick Role Auto-Fill
            </span>
            <span>Select to test</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => handlePrefill(acc.email, acc.pass)}
                className="py-1.5 px-2 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-gray-200 dark:border-slate-700 hover:border-emerald-500 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              >
                {acc.icon}
                <span className="truncate">{acc.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Login Form */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-xl space-y-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  {...register('email', { required: 'Email address is required' })}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-rose-500">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || demoLoading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Authenticating...' : 'Sign In with Email'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-xs text-gray-400 font-semibold absolute">
              OR CONTINUE WITH
            </span>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl text-xs sm:text-sm shadow-2xs transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.26C.46 8.2.01 10.05.01 12s.45 3.8 1.25 5.39l4.01-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.26 6.61l4.01 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Link to Register */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              Create an Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}