import React, { useEffect, useState } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  UserCheck, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { 
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

const COLORS = ['#10B981', '#06B6D4', '#6366F1', '#F59E0B', '#EC4899'];

export default function AdminDashboard() {
  usePageTitle('Admin Analytics Dashboard');

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('30days'); // 'today' | '7days' | '30days'

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
      value: stats?.totalProducts || 0,
      icon: <Package className="w-5 h-5 text-emerald-500" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      border: 'border-emerald-200 dark:border-emerald-800'
    },
    {
      title: 'Total Factory Orders',
      value: stats?.totalOrders || 0,
      icon: <ShoppingBag className="w-5 h-5 text-teal-500" />,
      bg: 'bg-teal-50 dark:bg-teal-950/50',
      border: 'border-teal-200 dark:border-teal-800'
    },
    {
      title: 'Total System Users',
      value: stats?.totalUsers || 0,
      icon: <Users className="w-5 h-5 text-cyan-500" />,
      bg: 'bg-cyan-50 dark:bg-cyan-950/50',
      border: 'border-cyan-200 dark:border-cyan-800'
    },
    {
      title: 'Active Production Managers',
      value: stats?.activeManagers || 0,
      icon: <UserCheck className="w-5 h-5 text-purple-500" />,
      bg: 'bg-purple-50 dark:bg-purple-950/50',
      border: 'border-purple-200 dark:border-purple-800'
    },
    {
      title: 'Orders This Month',
      value: stats?.ordersThisMonth || 0,
      icon: <Calendar className="w-5 h-5 text-amber-500" />,
      bg: 'bg-amber-50 dark:bg-amber-950/50',
      border: 'border-amber-200 dark:border-amber-800'
    },
    {
      title: 'Total Pipeline Revenue',
      value: `$${Number(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: <DollarSign className="w-5 h-5 text-rose-500" />,
      bg: 'bg-rose-50 dark:bg-rose-950/50',
      border: 'border-rose-200 dark:border-rose-800'
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-heading">
            Factory Executive Analytics
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Real-time throughput metrics, order velocity, and category allocations
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
            className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border ${card.border} shadow-2xs flex items-center justify-between`}
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

      {/* Visual Analytics Charts Section (Bar, Line, Pie) */}
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

      {/* Line Chart: Revenue Flow */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
              Revenue Growth & Pipeline Velocity ($ USD)
            </h3>
            <p className="text-xs text-gray-400">Aggregated booking values over selected timeline</p>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats?.timelineData || []}>
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
              <Line
                type="monotone"
                dataKey="revenue"
                name="Total Value ($)"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
