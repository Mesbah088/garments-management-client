import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  UserCheck, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Layers,
  ArrowUpRight,
  Briefcase,
  User,
  Search,
  SlidersHorizontal,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ExternalLink,
  Eye,
  CheckCircle2,
  XCircle,
  X,
  Building,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import api from '../../../api/api';
import usePageTitle from '../../../Shared/usePageTitle';
import LoadingSpinner from '../../../Shared/LoadingSpinner';
import AnimatedCounter from '../../../Shared/AnimatedCounter';

const COLORS = ['#10B981', '#06B6D4', '#6366F1', '#F59E0B', '#EC4899'];

export default function AdminDashboard() {
  usePageTitle('Admin Analytics & Stakeholder Hub');

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('30days'); // 'today' | '7days' | '30days'
  
  // Stakeholder Directory State
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'managers' | 'buyers'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'approved' | 'pending' | 'suspended'
  const [selectedStakeholder, setSelectedStakeholder] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/stats/admin?filter=${timeFilter}`);
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeFilter]);

  if (loading) {
    return <LoadingSpinner text="Compiling manufacturing analytics and production trends..." />;
  }

  const statCards = [
    {
      title: 'Total Apparel Products',
      value: <AnimatedCounter end={stats?.totalProducts || 0} duration={1.5} />,
      icon: <Package className="w-5 h-5 text-emerald-500" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      border: 'border-emerald-200 dark:border-emerald-800'
    },
    {
      title: 'Total Factory Orders',
      value: <AnimatedCounter end={stats?.totalOrders || 0} duration={1.5} />,
      icon: <ShoppingBag className="w-5 h-5 text-teal-500" />,
      bg: 'bg-teal-50 dark:bg-teal-950/50',
      border: 'border-teal-200 dark:border-teal-800'
    },
    {
      title: 'Total System Users',
      value: <AnimatedCounter end={stats?.totalUsers || 0} duration={1.5} />,
      icon: <Users className="w-5 h-5 text-cyan-500" />,
      bg: 'bg-cyan-50 dark:bg-cyan-950/50',
      border: 'border-cyan-200 dark:border-cyan-800'
    },
    {
      title: 'Active Production Managers',
      value: <AnimatedCounter end={stats?.activeManagers || stats?.managerStats?.approved || 0} duration={1.5} />,
      icon: <UserCheck className="w-5 h-5 text-purple-500" />,
      bg: 'bg-purple-50 dark:bg-purple-950/50',
      border: 'border-purple-200 dark:border-purple-800'
    },
    {
      title: 'Registered Wholesale Buyers',
      value: <AnimatedCounter end={stats?.buyerStats?.total || stats?.buyers?.length || 0} duration={1.5} />,
      icon: <Briefcase className="w-5 h-5 text-blue-500" />,
      bg: 'bg-blue-50 dark:bg-blue-950/50',
      border: 'border-blue-200 dark:border-blue-800'
    },
    {
      title: 'Total Pipeline Revenue',
      value: <AnimatedCounter end={stats?.totalRevenue || 0} prefix="৳" duration={2} />,
      icon: <DollarSign className="w-5 h-5 text-rose-500" />,
      bg: 'bg-rose-50 dark:bg-rose-950/50',
      border: 'border-rose-200 dark:border-rose-800'
    }
  ];

  // Combined Stakeholders List for Filter & Search
  const allManagers = (stats?.managers || []).map(m => ({ ...m, userType: 'manager' }));
  const allBuyers = (stats?.buyers || []).map(b => ({ ...b, userType: 'buyer' }));
  const combinedStakeholders = [...allManagers, ...allBuyers];

  const filteredStakeholders = combinedStakeholders.filter((item) => {
    // Tab filter
    if (activeTab === 'managers' && item.userType !== 'manager') return false;
    if (activeTab === 'buyers' && item.userType !== 'buyer') return false;

    // Status filter
    if (statusFilter !== 'all' && (item.status || 'approved') !== statusFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name?.toLowerCase().includes(q);
      const matchEmail = item.email?.toLowerCase().includes(q);
      const matchRole = item.role?.toLowerCase().includes(q);
      return matchName || matchEmail || matchRole;
    }

    return true;
  });

  return (
    <div className="space-y-10">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Executive Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-heading">
            Factory Executive Analytics & Stakeholders
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Real-time throughput metrics, production manager allocations, and wholesale buyer order volumes
          </p>
        </div>

        {/* Time Filters */}
        <div className="inline-flex p-1 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-2xs">
          {['today', '7days', '30days'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                timeFilter === filter
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {filter === 'today' ? 'Today' : filter === '7days' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Top 6 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border ${card.border} shadow-2xs flex items-center justify-between transition-all hover:shadow-md`}
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block">
                {card.title}
              </span>
              <h3 className="text-2xl font-black text-gray-950 dark:text-white font-heading">
                {card.value}
              </h3>
            </div>
            <div className={`p-3.5 rounded-2xl ${card.bg}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 👔 & 🛍️ MANAGER & BUYER STAKEHOLDER DIRECTORY SECTION */}
      {/* ========================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white font-heading">
                Manager & Buyer Information Hub
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Live roster and production statistics of factory managers and registered wholesale buyers
            </p>
          </div>

          {/* Quick Action to Manage Users Page */}
          <Link
            to="/dashboard/manage-users"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-gray-700 dark:text-gray-300 font-bold text-xs transition-all shadow-2xs self-start lg:self-auto"
          >
            <span>Full User Management Access</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mini KPI Highlights for Stakeholders */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 block uppercase tracking-wider">
              Total Managers
            </span>
            <span className="text-xl font-black text-gray-900 dark:text-white font-heading">
              <AnimatedCounter end={stats?.managerStats?.total || stats?.managers?.length || 0} duration={1.5} />
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 block mt-0.5">
              <AnimatedCounter end={stats?.managerStats?.approved || 0} duration={1.2} /> active on floor
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block uppercase tracking-wider">
              Wholesale Buyers
            </span>
            <span className="text-xl font-black text-gray-900 dark:text-white font-heading">
              <AnimatedCounter end={stats?.buyerStats?.total || stats?.buyers?.length || 0} duration={1.5} />
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 block mt-0.5">
              <AnimatedCounter end={stats?.buyerStats?.approved || 0} duration={1.2} /> verified accounts
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase tracking-wider">
              Buyer Booking Value
            </span>
            <span className="text-xl font-black text-gray-900 dark:text-white font-heading">
              <AnimatedCounter end={stats?.buyerStats?.totalSpent || stats?.totalRevenue || 0} prefix="৳" duration={1.8} />
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 block mt-0.5">
              Accumulated order volume
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block uppercase tracking-wider">
              Assigned Products
            </span>
            <span className="text-xl font-black text-gray-900 dark:text-white font-heading">
              <AnimatedCounter end={stats?.totalProducts || 0} suffix=" Styles" duration={1.5} />
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 block mt-0.5">
              Active manager catalog
            </span>
          </div>
        </div>

        {/* Tab Switcher & Search / Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
          
          {/* Tab buttons */}
          <div className="inline-flex p-1 bg-gray-100 dark:bg-slate-800 rounded-2xl border border-gray-200/60 dark:border-slate-700/60">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>All ({combinedStakeholders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('managers')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'managers'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Production Managers ({allManagers.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('buyers')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'buyers'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Wholesale Buyers ({allBuyers.length})</span>
            </button>
          </div>

          {/* Search Bar & Status Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved / Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Stakeholder Table & Cards */}
        {filteredStakeholders.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-dashed border-gray-200 dark:border-slate-700 space-y-2">
            <Users className="w-8 h-8 text-gray-400 mx-auto" />
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">No stakeholders found</h4>
            <p className="text-xs text-gray-400">Try adjusting your search query or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-300 font-bold uppercase tracking-wider text-[11px] border-b border-gray-100 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">User & Contact</th>
                  <th className="px-4 py-3.5">Role / Designation</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Performance / Activity</th>
                  <th className="px-4 py-3.5">Member Since</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {filteredStakeholders.map((user) => {
                  const isManager = user.userType === 'manager' || user.role === 'manager';
                  const isSuspended = user.status === 'suspended';
                  const isPending = user.status === 'pending';

                  return (
                    <tr 
                      key={user._id || user.email}
                      className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* User Info & Avatar */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/20 shadow-2xs"
                          />
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white text-sm block">
                              {user.name}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1 text-[11px]">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-4 py-4">
                        {isManager ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            <UserCheck className="w-3 h-3" />
                            Production Manager
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            <Briefcase className="w-3 h-3" />
                            Wholesale Buyer
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        {isSuspended ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                            <XCircle className="w-3 h-3" />
                            Suspended
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            <Clock className="w-3 h-3" />
                            Pending Review
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </td>

                      {/* Performance/Activity Metric */}
                      <td className="px-4 py-4">
                        {isManager ? (
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {user.productsCount !== undefined ? `${user.productsCount} Products` : `${stats?.totalProducts || 0} Managed`}
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 block">
                              Catalog Supervisor
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white">
                              {user.ordersCount || 0} Orders Placed
                            </span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">
                              ৳{Number(user.totalSpent || 0).toLocaleString()} Total Value
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Join Date */}
                      <td className="px-4 py-4 text-gray-500 dark:text-gray-400">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Verified'}
                      </td>

                      {/* Quick Actions: Direct Chat / Knock & Profile Modal */}
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/dashboard/chat?email=${encodeURIComponent(user.email)}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 font-bold text-xs transition-all shadow-2xs"
                            title="Direct Live Chat / Knock"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Chat / Knock</span>
                          </Link>
                          <button
                            onClick={() => setSelectedStakeholder(user)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-gray-700 dark:text-gray-300 font-bold text-xs transition-all shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Info</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* 💰 FINANCIAL INTELLIGENCE: INVESTMENT & REVENUE VELOCITY */}
      {/* ========================================================= */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white font-heading">
                Investment, Revenue & Profitability Flow
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Capital expenditure, variable manufacturing costs, gross revenues, and ROI
              </p>
            </div>
          </div>
        </div>

        {/* 4 Financial Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block">
              Total Gross Revenue
            </span>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-heading mt-1">
              ৳{Number(stats?.totalRevenue || 0).toLocaleString()}
            </h3>
            <p className="text-[11px] font-semibold text-gray-400 mt-1">
              Avg Order: ৳{Number(stats?.avgOrderValue || 0).toLocaleString()}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 shadow-2xs">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block">
              Total Factory Investment
            </span>
            <h3 className="text-2xl font-black text-teal-600 dark:text-teal-400 font-heading mt-1">
              ৳{Number(stats?.totalInvestment || 0).toLocaleString()}
            </h3>
            <p className="text-[11px] font-semibold text-gray-400 mt-1">
              Fixed Capital: ৳{Number(stats?.fixedCapitalInvestment || 125000).toLocaleString()}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 shadow-2xs">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block">
              Net Commercial Profit
            </span>
            <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-heading mt-1">
              ৳{Number(stats?.netProfit || 0).toLocaleString()}
            </h3>
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 font-bold">
              Gross Margin: {stats?.profitMargin || 0}%
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 shadow-2xs">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block">
              Return on Investment (ROI)
            </span>
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 font-heading mt-1">
              {stats?.roiPercentage || 0}%
            </h3>
            <p className="text-[11px] font-semibold text-gray-400 mt-1">
              Capital efficiency index
            </p>
          </div>
        </div>

        {/* Financial Flow Area Chart & Cost Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Revenue vs Investment Flow Chart */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
                  Revenue vs. Production Investment Timeline
                </h3>
                <p className="text-xs text-gray-400">Comparison of booking revenues and manufacturing cost flows</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                Live Feed
              </span>
            </div>

            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.timelineData || []}>
                  <defs>
                    <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="adminInvGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="adminProfitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      borderColor: '#334155',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" name="Gross Revenue (৳ BDT)" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#adminRevGrad)" />
                  <Area type="monotone" dataKey="investment" name="Production Cost (৳ BDT)" stroke="#06B6D4" strokeWidth={2.5} fillOpacity={1} fill="url(#adminInvGrad)" />
                  <Area type="monotone" dataKey="profit" name="Net Profit (৳ BDT)" stroke="#6366F1" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#adminProfitGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Investment Cost Allocation Donut Chart */}
          <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
                Investment Cost Allocation
              </h3>
              <p className="text-xs text-gray-400">Expense distribution across floor operations</p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.costBreakdown || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(stats?.costBreakdown || []).map((entry, index) => (
                      <Cell key={`cost-cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      borderColor: '#334155',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Category Economics & Unit Margin Matrix */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
                Garment Category Margin & Unit Economics Matrix
              </h3>
              <p className="text-xs text-gray-400">Unit investment cost, wholesale price, and net commercial margins</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-300 font-bold uppercase tracking-wider text-[11px] border-b border-gray-100 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Style Category</th>
                  <th className="px-4 py-3.5">Avg Production Cost (Inv/pc)</th>
                  <th className="px-4 py-3.5">Avg Wholesale Price (Rev/pc)</th>
                  <th className="px-4 py-3.5">Gross Margin %</th>
                  <th className="px-4 py-3.5">Total Output</th>
                  <th className="px-4 py-3.5 text-right">Net Profit Generated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {(stats?.categoryProfitability || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                      {item.category}
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400">
                      ৳{Number(item.avgCost).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                      ৳{Number(item.avgPrice).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        {item.margin}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-400">
                      {item.units.toLocaleString()} pcs
                    </td>
                    <td className="px-4 py-4 text-right font-black text-indigo-600 dark:text-indigo-400">
                      ৳{Number(item.profit).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 📊 PRODUCTION OUTPUT & VOLUME ANALYTICS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Bar & Line Chart: Production & Order Volume */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
                Order Frequency & Production Volume
              </h3>
              <p className="text-xs text-gray-400">Order count and manufactured pieces timeline</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
              Live Feed
            </span>
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.timelineData || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    borderColor: '#334155',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend />
                <Bar dataKey="orders" name="Order Bookings" fill="#10B981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="units" name="Garment Pieces" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Category Distribution */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
              Category Distribution
            </h3>
            <p className="text-xs text-gray-400">Product ratio by garment style</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.categoryDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(stats?.categoryDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    borderColor: '#334155',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 🔍 QUICK STAKEHOLDER DETAILS MODAL */}
      {/* ========================================================= */}
      {selectedStakeholder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedStakeholder(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <img
                src={selectedStakeholder.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt={selectedStakeholder.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/30 shadow-md"
              />
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white font-heading">
                  {selectedStakeholder.name}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 block">
                  {selectedStakeholder.email}
                </span>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedStakeholder.role === 'manager' 
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' 
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                  }`}>
                    {selectedStakeholder.role === 'manager' ? 'Production Manager' : 'Wholesale Buyer'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedStakeholder.status === 'suspended'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}>
                    {selectedStakeholder.status || 'Active'}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Stats in Modal */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800">
              {selectedStakeholder.role === 'manager' ? (
                <>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Assigned Products</span>
                    <p className="text-base font-black text-gray-900 dark:text-white mt-0.5">
                      {selectedStakeholder.productsCount !== undefined ? selectedStakeholder.productsCount : stats?.totalProducts || 0} Styles
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Floor Authorization</span>
                    <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                      Verified Manager
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Total Placed Orders</span>
                    <p className="text-base font-black text-gray-900 dark:text-white mt-0.5">
                      {selectedStakeholder.ordersCount || 0} Orders
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Total Commercial Value</span>
                    <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                      ৳{Number(selectedStakeholder.totalSpent || 0).toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Suspension note if any */}
            {selectedStakeholder.status === 'suspended' && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs space-y-1">
                <span className="font-bold text-rose-700 dark:text-rose-400 block">Suspension Reason:</span>
                <p className="text-gray-700 dark:text-gray-300">{selectedStakeholder.suspendReason || 'Administrative suspension'}</p>
                {selectedStakeholder.suspendFeedback && (
                  <p className="text-gray-500 dark:text-gray-400 italic">Feedback: "{selectedStakeholder.suspendFeedback}"</p>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedStakeholder(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
              <Link
                to={`/dashboard/chat?email=${encodeURIComponent(selectedStakeholder.email)}`}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-xs flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Direct Chat / Knock</span>
              </Link>
              <Link
                to="/dashboard/manage-users"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>Edit Access in Manage Users</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
