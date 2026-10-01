import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router';
import { 
  DollarSign, 
  TrendingUp, 
  Layers, 
  Package, 
  CheckCircle, 
  Clock, 
  PieChart as PieIcon, 
  BarChart3, 
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Zap,
  MessageSquare,
  Phone,
  Users,
  Mail,
  Briefcase
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
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
import { AuthContext } from '../../../AuthProvider/authProvider';
import usePageTitle from '../../../Shared/usePageTitle';
import LoadingSpinner from '../../../Shared/LoadingSpinner';
import AnimatedCounter from '../../../Shared/AnimatedCounter';

const COLORS = ['#10B981', '#06B6D4', '#6366F1', '#F59E0B', '#EC4899'];

export default function ManagerAnalytics() {
  usePageTitle('Production & Investment Financials');
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState(null);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManagerStats = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/stats/manager?email=${user?.email || ''}`);
        setStats(res.data);

        // Fetch managers for Floor Directory
        const contactsRes = await api.get(`/chat/contacts?email=${encodeURIComponent(user?.email || '')}&role=manager`);
        if (contactsRes.data) {
          setManagers(contactsRes.data.filter(c => c.role === 'manager' || c.role === 'admin'));
        }
      } catch (err) {
        console.error('Error loading manager analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchManagerStats();
  }, [user]);

  if (loading) {
    return <LoadingSpinner text="Compiling floor investments and revenue analytics..." />;
  }

  const kpis = [
    {
      title: 'Total Gross Revenue',
      value: <AnimatedCounter end={stats?.totalRevenue || 0} prefix="৳" duration={1.8} />,
      subtext: 'Accumulated order bookings',
      icon: <DollarSign className="w-5 h-5 text-emerald-500" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      border: 'border-emerald-200 dark:border-emerald-800'
    },
    {
      title: 'Total Production Investment',
      value: <AnimatedCounter end={stats?.totalInvestment || 0} prefix="৳" duration={1.8} />,
      subtext: 'Material, CMT labor & overheads',
      icon: <Layers className="w-5 h-5 text-teal-500" />,
      bg: 'bg-teal-50 dark:bg-teal-950/50',
      border: 'border-teal-200 dark:border-teal-800'
    },
    {
      title: 'Net Production Profit',
      value: <AnimatedCounter end={stats?.netProfit || 0} prefix="৳" duration={1.8} />,
      subtext: `Gross Margin: ${stats?.profitMargin || 0}%`,
      icon: <TrendingUp className="w-5 h-5 text-indigo-500" />,
      bg: 'bg-indigo-50 dark:bg-indigo-950/50',
      border: 'border-indigo-200 dark:border-indigo-800'
    },
    {
      title: 'Return on Investment (ROI)',
      value: <AnimatedCounter end={stats?.roiPercentage || 0} decimals={1} suffix="%" duration={1.6} />,
      subtext: 'Capital efficiency ratio',
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      bg: 'bg-amber-50 dark:bg-amber-950/50',
      border: 'border-amber-200 dark:border-amber-800'
    }
  ];

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Production Floor Financial Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-heading">
            Investment & Revenue Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Real-time tracking of manufacturing investments, material costs, gross revenues, and margins
          </p>
        </div>
      </div>

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border ${kpi.border} shadow-2xs flex items-center justify-between transition-all hover:shadow-md`}
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block">
                {kpi.title}
              </span>
              <h3 className="text-2xl font-black text-gray-950 dark:text-white font-heading">
                {kpi.value}
              </h3>
              <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">
                {kpi.subtext}
              </p>
            </div>
            <div className={`p-3.5 rounded-2xl ${kpi.bg}`}>
              {kpi.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section: Revenue vs Investment Timeline & Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Revenue vs Investment Area Chart */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
                Revenue vs. Production Investment Flow
              </h3>
              <p className="text-xs text-gray-400">Throughput velocity comparison across the last 14 days</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
              Live Feed
            </span>
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.timelineData || []}>
                <defs>
                  <linearGradient id="managerRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="managerInvGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0}/>
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
                <Area type="monotone" dataKey="revenue" name="Gross Revenue (৳ BDT)" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#managerRevGrad)" />
                <Area type="monotone" dataKey="investment" name="Production Cost (৳ BDT)" stroke="#06B6D4" strokeWidth={2.5} fillOpacity={1} fill="url(#managerInvGrad)" />
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
            <p className="text-xs text-gray-400">Expense split across floor operations</p>
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

      {/* Category Profitability & Margin Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
              Product Category Unit Economics & Profitability
            </h3>
            <p className="text-xs text-gray-400">Production cost vs Wholesale price breakdown per garment category</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-300 font-bold uppercase tracking-wider text-[11px] border-b border-gray-100 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-4 py-3.5">Avg Production Cost (Inv/Unit)</th>
                <th className="px-4 py-3.5">Avg Wholesale Price</th>
                <th className="px-4 py-3.5">Gross Margin %</th>
                <th className="px-4 py-3.5">Units Output</th>
                <th className="px-4 py-3.5 text-right">Total Net Profit</th>
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

      {/* ========================================================= */}
      {/* 🏭 FLOOR PRODUCTION MANAGERS & TEAM DIRECTORY */}
      {/* ========================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
                Floor Supervisors & Department Managers
              </h3>
              <p className="text-xs text-gray-400">
                Direct in-app messaging and coordination across cutting, sewing, and quality inspection units
              </p>
            </div>
          </div>

          <Link
            to="/dashboard/chat"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open Live Chat Hub</span>
          </Link>
        </div>

        {/* Managers Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {managers.map((mgr) => {
            const isMe = mgr.email?.toLowerCase() === user?.email?.toLowerCase();
            return (
              <div
                key={mgr._id || mgr.email}
                className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-200/80 dark:border-slate-700/80 flex flex-col justify-between gap-4 hover:border-emerald-500/50 transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={mgr.photoURL || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80"}
                      alt={mgr.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/40"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {mgr.name} {isMe && <span className="text-[10px] text-emerald-500">(You)</span>}
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 block truncate mt-0.5">
                      {mgr.department || 'Production Department'}
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                      <Mail className="w-3 h-3 shrink-0" />
                      <span className="truncate">{mgr.email}</span>
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200/60 dark:border-slate-700/60">
                  <Link
                    to={`/dashboard/chat?email=${encodeURIComponent(mgr.email)}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </Link>

                  <a
                    href={`https://wa.me/8801700000000?text=${encodeURIComponent(
                      `Hello ${mgr.name}, messaging regarding factory floor operations and schedule.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs"
                    title="Knock on WhatsApp"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
