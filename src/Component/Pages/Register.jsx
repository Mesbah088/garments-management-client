import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { Scissors, User, Mail, Lock, Image, Shield, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { AuthContext } from '../../AuthProvider/authProvider';
import usePageTitle from '../../Shared/usePageTitle';

export default function Register() {
  usePageTitle('Register Account');

  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      role: 'buyer',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    }
  });

  const passwordVal = watch('password', '');
  const hasUpper = /[A-Z]/.test(passwordVal);
  const hasLower = /[a-z]/.test(passwordVal);
  const hasLength = passwordVal.length >= 6;

  const onSubmit = async (data) => {
    // Strict requirement validation check
    if (!hasUpper || !hasLower || !hasLength) {
      Swal.fire({
        icon: 'warning',
        title: 'Weak Password',
        text: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and be at least 6 characters long.'
      });
      return;
    }

    setLoading(true);
    try {
      await registerUser(data.name, data.email, data.photoURL, data.password, data.role);
      if (data.role === 'manager') {
        Swal.fire({
          icon: 'info',
          title: 'Manager Account Registered',
          html: `<p class="text-sm text-gray-600 dark:text-gray-300 mb-2">Welcome <strong>${data.name}</strong>!</p><p class="text-xs text-gray-500 dark:text-gray-400">Your Manager account has been created and is awaiting <strong>Admin Approval</strong> before you can add and publish apparel products to the catalog.</p>`,
          confirmButtonText: 'Go to Workspace',
          confirmButtonColor: '#059669'
        }).then(() => {
          navigate('/dashboard');
        });
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md">
              <Scissors className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-950 dark:text-white font-heading">
              Garments<span className="text-emerald-600 dark:text-emerald-400">Tracker</span>
            </span>
          </Link>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white font-heading">
            Create System Account
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Register as a Buyer for instant ordering, or as a Production Manager (Requires Admin Approval)
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-xl space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="e.g. Tariqul Islam"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              {errors.name && <p className="text-[11px] text-rose-500">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-500">{errors.email.message}</p>}
            </div>

            {/* Photo URL */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Photo URL</label>
              <div className="relative">
                <Image className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  {...register('photoURL')}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Role Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Account Role *</label>
              <div className="relative">
                <Shield className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  {...register('role', { required: 'Role is required' })}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="buyer">Wholesale Buyer (Instant Access - Order & Track Apparel)</option>
                  <option value="manager">Production Manager (Manage Products & Assembly - Requires Admin Approval)</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              {errors.password && <p className="text-[11px] text-rose-500">{errors.password.message}</p>}
            </div>

            {/* Password Rules Live Checklist */}
            <div className="p-3 bg-gray-50 dark:bg-slate-800/70 rounded-xl border border-gray-200/80 dark:border-slate-700 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Password Requirements</span>
              
              <div className="flex items-center gap-2">
                {hasUpper ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-gray-400" />
                )}
                <span className={hasUpper ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-gray-500"}>
                  At least one uppercase letter (A-Z)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {hasLower ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-gray-400" />
                )}
                <span className={hasLower ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-gray-500"}>
                  At least one lowercase letter (a-z)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {hasLength ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-gray-400" />
                )}
                <span className={hasLength ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-gray-500"}>
                  Minimum length of 6 characters
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Registering Account...' : 'Complete Registration'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Link to Login */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              Log in to your account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
