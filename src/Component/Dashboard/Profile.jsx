import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  LogOut, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  Scissors
} from 'lucide-react';
import { AuthContext } from '../../AuthProvider/authProvider';
import usePageTitle from '../../Shared/usePageTitle';

export default function Profile() {
  usePageTitle('My Profile & Account Status');

  const { user, dbUser, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  const role = dbUser?.role || 'buyer';
  const status = dbUser?.status || 'approved';
  const isSuspended = status === 'suspended';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-heading">
          User Profile & Verification
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Account role authorizations, identity credentials, and factory access status
        </p>
      </div>

      {/* CHALLENGE POINT 4: Suspend Feedback Banner if User is Suspended */}
      {isSuspended && (
        <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-900 shadow-md space-y-3">
          <div className="flex items-center gap-2.5 text-rose-700 dark:text-rose-300">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <h3 className="text-base font-black font-heading uppercase tracking-wide">
              Account Suspended by Administrator
            </h3>
          </div>

          <div className="space-y-2 text-sm text-rose-900 dark:text-rose-200">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/60">
              <strong className="block text-xs font-bold text-rose-500 uppercase">Suspension Reason:</strong>
              <p className="mt-0.5">{dbUser?.suspendReason || "Account flagged by factory administration."}</p>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/60">
              <strong className="block text-xs font-bold text-rose-500 uppercase">Administrator Feedback & Resolution Steps:</strong>
              <p className="mt-0.5">{dbUser?.suspendFeedback || "Please contact compliance support to verify tax documentation."}</p>
            </div>
          </div>

          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
            {role === 'buyer'
              ? 'Notice: Suspended buyers cannot place new orders or bookings. Existing orders remain viewable.'
              : 'Notice: Suspended managers cannot add new products or approve/reject pending orders.'}
          </p>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-8">
        
        {/* Top Avatar Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100 dark:border-slate-800">
          <img
            src={user?.photoURL || dbUser?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
            alt="Profile Avatar"
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-emerald-500/30 shadow-md"
          />

          <div className="space-y-1.5 text-center sm:text-left">
            <h2 className="text-2xl font-black text-gray-950 dark:text-white font-heading">
              {user?.displayName || dbUser?.name || 'Garments System User'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {user?.email || dbUser?.email}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                Role: {role.toUpperCase()}
              </span>

              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                isSuspended 
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                  : 'bg-teal-100 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300'
              }`}>
                Status: {status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Credentials & Details Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-500" /> Full Display Name
            </span>
            <strong className="text-sm text-gray-900 dark:text-white font-bold block">
              {user?.displayName || dbUser?.name || 'N/A'}
            </strong>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-teal-500" /> Authorized Email
            </span>
            <strong className="text-sm text-gray-900 dark:text-white font-bold block truncate">
              {user?.email || dbUser?.email || 'N/A'}
            </strong>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-500" /> Security Access Level
            </span>
            <strong className="text-sm text-gray-900 dark:text-white font-bold block uppercase">
              {role === 'admin' ? 'Super Administrator' : role === 'manager' ? 'Plant Production Manager' : 'Verified Wholesale Buyer'}
            </strong>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-500" /> Account Created
            </span>
            <strong className="text-sm text-gray-900 dark:text-white font-bold block">
              {dbUser?.createdAt ? new Date(dbUser.createdAt).toLocaleDateString() : 'Active Session'}
            </strong>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout from GarmentsTracker
          </button>
        </div>

      </div>

    </div>
  );
}
