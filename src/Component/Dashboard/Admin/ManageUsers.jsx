import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { 
  Users, 
  Search, 
  Filter, 
  Edit3, 
  ShieldAlert, 
  CheckCircle, 
  Trash2, 
  X, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import api from '../../../api/api';
import usePageTitle from '../../../Shared/usePageTitle';
import LoadingSpinner from '../../../Shared/LoadingSpinner';

export default function ManageUsers() {
  usePageTitle('Manage User Roles & Access');

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Edit/Suspend Modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRole, setModalRole] = useState('buyer');
  const [modalStatus, setModalStatus] = useState('approved');
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendFeedback, setSuspendFeedback] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (roleFilter !== 'all') queryParams.set('role', roleFilter);
      if (statusFilter !== 'all') queryParams.set('status', statusFilter);
      queryParams.set('page', page);
      queryParams.set('limit', 8);

      const res = await api.get(`/users?${queryParams.toString()}`);
      if (res.data?.users) {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter, page]);

  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setModalRole(user.role || 'buyer');
    setModalStatus(user.status || 'approved');
    setSuspendReason(user.suspendReason || '');
    setSuspendFeedback(user.suspendFeedback || '');
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // Enforce Challenge 4 requirement: Suspend modal must collect reason and feedback
    if (modalStatus === 'suspended') {
      if (!suspendReason.trim() || !suspendFeedback.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Suspension Justification Required',
          text: 'You must provide both a Suspend Reason and explanatory Feedback for the user before applying suspension.'
        });
        return;
      }
    }

    setUpdating(true);
    try {
      const payload = {
        role: modalRole,
        status: modalStatus,
        suspendReason: modalStatus === 'suspended' ? suspendReason : null,
        suspendFeedback: modalStatus === 'suspended' ? suspendFeedback : null
      };

      const res = await api.patch(`/users/${selectedUser._id}/status`, payload);
      if (res.data?.success) {
        setIsModalOpen(false);
        Swal.fire({
          icon: 'success',
          title: 'User Profile Updated',
          text: `User ${selectedUser.name} updated to ${modalRole.toUpperCase()} with status ${modalStatus.toUpperCase()}`,
          timer: 2000,
          showConfirmButton: false
        });
        fetchUsers();
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.response?.data?.message || err.message
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async (user) => {
    const result = await Swal.fire({
      title: `Delete ${user.name}?`,
      text: 'This user and their system authorization will be permanently removed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete user'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/users/${user._id}`);
        Swal.fire('Deleted!', 'User has been removed.', 'success');
        fetchUsers();
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-heading">
          Manage Managers & Buyer Roles
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Administer permissions, approve new onboarding registrations, or suspend inactive accounts
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        {/* Filters */}
        <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-hidden"
            >
              <option value="all">All Roles</option>
              <option value="buyer">Buyers</option>
              <option value="manager">Managers</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-hidden"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12">
            <LoadingSpinner text="Loading system user registry..." />
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No users found matching current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40 text-xs uppercase font-extrabold text-gray-400 tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    
                    {/* Name + Photo */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200 dark:ring-slate-700"
                        />
                        <div>
                          <strong className="font-bold text-gray-900 dark:text-white block">{u.name}</strong>
                          <span className="text-[10px] text-gray-400">ID: {String(u._id).slice(-6)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300 font-medium">
                      {u.email}
                    </td>

                    {/* Role */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300'
                          : u.role === 'manager'
                          ? 'bg-teal-100 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                      }`}>
                        {u.role || 'buyer'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                        u.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : u.status === 'suspended'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                      }`}>
                        {u.status === 'suspended' && <ShieldAlert className="w-3 h-3" />}
                        {u.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                        {u.status || 'pending'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openUpdateModal(u)}
                          className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/50 text-gray-700 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 font-semibold text-xs transition-colors flex items-center gap-1.5"
                          title="Manage Role & Suspension"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Update
                        </button>
                        
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} users)
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 dark:border-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 dark:border-slate-800 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* UPDATE / SUSPEND USER MODAL (Enforcing Challenge Point 4) */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-gray-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
                  Update Role & Account Status
                </h3>
                <p className="text-xs text-gray-500">
                  User: <strong>{selectedUser.name}</strong> ({selectedUser.email})
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-left">
              {/* Role select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Assign System Role</label>
                <select
                  value={modalRole}
                  onChange={(e) => setModalRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="buyer">Buyer (Places orders & tracks apparel)</option>
                  <option value="manager">Manager (Oversees factory lines & orders)</option>
                  <option value="admin">Administrator (Full operational control)</option>
                </select>
              </div>

              {/* Status select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Account Authorization Status</label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="approved">Approved (Active access)</option>
                  <option value="pending">Pending (Awaiting verification)</option>
                  <option value="suspended">Suspended (Enforce restrictions)</option>
                </select>
              </div>

              {/* CHALLENGE POINT 4: Mandatory Suspend Reason & Feedback fields if suspended */}
              {modalStatus === 'suspended' && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-3">
                  <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-bold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Suspension Requirement Details</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-rose-800 dark:text-rose-200">
                      Suspension Reason *
                    </label>
                    <input
                      type="text"
                      value={suspendReason}
                      onChange={(e) => setSuspendReason(e.target.value)}
                      placeholder="e.g. Unverified wholesale tax ID / Repeated MOQ breach"
                      required
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded-xl text-xs text-rose-950 dark:text-rose-100 placeholder-rose-300 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-rose-800 dark:text-rose-200">
                      Why Suspend Feedback (Visible to user on their profile) *
                    </label>
                    <textarea
                      rows="2"
                      value={suspendFeedback}
                      onChange={(e) => setSuspendFeedback(e.target.value)}
                      placeholder="e.g. Please upload your company certificate of incorporation to re-enable ordering privileges."
                      required
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded-xl text-xs text-rose-950 dark:text-rose-100 placeholder-rose-300 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  {updating ? 'Applying Changes...' : 'Save User Status'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
