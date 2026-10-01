import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  Truck, 
  MapPin, 
  Scissors, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Package, 
  ArrowLeft,
  Navigation,
  Factory,
  MessageSquare,
  Send,
  UserCheck,
  Sparkles
} from 'lucide-react';
import api from '../../../api/api';
import usePageTitle from '../../../Shared/usePageTitle';
import LoadingSpinner from '../../../Shared/LoadingSpinner';

export default function TrackOrder() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyerKnockNote, setBuyerKnockNote] = useState('');
  const [sendingNote, setSendingNote] = useState(false);

  usePageTitle('Live Order Tracking');

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      console.error('Failed to load tracking details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleSendKnockNote = async (e) => {
    e.preventDefault();
    if (!buyerKnockNote.trim()) return;

    setSendingNote(true);
    try {
      const payload = {
        step: 'Buyer Inquiry / Customization Knock',
        location: 'Buyer Account Portal',
        note: buyerKnockNote.trim(),
        timestamp: new Date().toISOString()
      };

      const res = await api.post(`/orders/${orderId}/tracking`, payload);
      if (res.data?.success) {
        setBuyerKnockNote('');
        Swal.fire({
          icon: 'success',
          title: 'Knock Note Logged to Timeline!',
          text: 'Your production note has been recorded and sent to the manager.',
          timer: 2000,
          showConfirmButton: false
        });
        fetchOrder();
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    } finally {
      setSendingNote(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving real-time production telemetry..." />;
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 space-y-4">
        <h2 className="text-xl font-bold">Order Tracking Not Found</h2>
        <Link to="/dashboard/my-orders" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold">
          Return to My Orders
        </Link>
      </div>
    );
  }

  const trackingSteps = order.tracking || [];
  const latestStepIndex = trackingSteps.length - 1;

  // Visual Production Progress Stage Map Steps
  const standardStages = [
    { title: 'Order Registered', icon: <Package className="w-4 h-4" /> },
    { title: 'Cutting Completed', icon: <Scissors className="w-4 h-4" /> },
    { title: 'Sewing Started', icon: <Layers className="w-4 h-4" /> },
    { title: 'Finishing & QC', icon: <ShieldCheck className="w-4 h-4" /> },
    { title: 'Packed & Dispatched', icon: <Truck className="w-4 h-4" /> }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            to="/dashboard/my-orders"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Orders
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-heading">
            Live Production & Shipping Tracker
          </h1>
          <p className="text-xs text-gray-500 font-mono">
            Tracking ID: #{String(order._id).toUpperCase()} • Status: <strong className="text-emerald-600">{order.status}</strong>
          </p>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
          <img
            src={order.productImage || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=100&q=80"}
            alt={order.productTitle}
            className="w-12 h-12 rounded-xl object-cover ring-1 ring-gray-200 dark:ring-slate-700"
          />
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1 max-w-[180px]">
              {order.productTitle}
            </h4>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-extrabold">
              {order.quantity} units • ৳{Number(order.totalPrice || 0).toLocaleString()} BDT
            </span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE FACTORY PROGRESS JOURNEY BAR */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 dark:text-white font-heading flex items-center gap-2">
            <Factory className="w-5 h-5 text-emerald-500" />
            Manufacturing Stage Progression
          </h3>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-full">
            Read-Only Telemetry
          </span>
        </div>

        {/* Progress Stations Indicator */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-2">
          {standardStages.map((stage, idx) => {
            const isCompleted = trackingSteps.some(s => s.step.toLowerCase().includes(stage.title.split(' ')[0].toLowerCase())) || (idx === 0);
            return (
              <div key={idx} className="flex flex-col items-center text-center space-y-2">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-400'
                  }`}
                >
                  {stage.icon}
                </div>
                <span className={`text-xs font-bold ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                  {stage.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* TWO COLUMN VIEW: TIMELINE ON LEFT, INTERACTIVE LOCATION MAP ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Chronological Steps Timeline */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-500" />
            Chronological Factory Milestones
          </h3>

          <div className="relative pl-8 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-500/30">
            {trackingSteps.map((step, idx) => {
              const isLatest = idx === latestStepIndex;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative p-4 rounded-2xl transition-all ${
                    isLatest
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-2 border-emerald-500 shadow-md shadow-emerald-500/10'
                      : 'bg-gray-50/70 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800'
                  }`}
                >
                  {/* Status node dot */}
                  <span
                    className={`absolute -left-[39px] top-5 w-5 h-5 rounded-full flex items-center justify-center ${
                      isLatest
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-200 dark:ring-emerald-900 animate-pulse'
                        : 'bg-slate-400 text-white ring-4 ring-gray-100 dark:ring-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                  </span>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <strong className="text-sm font-bold text-gray-900 dark:text-white">
                      {step.step}
                    </strong>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {new Date(step.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                    {step.note}
                  </p>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{step.location}</span>
                  </div>

                  {isLatest && (
                    <span className="inline-block mt-2 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-600 text-white tracking-wider">
                      ★ Current Active Stage
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Location Map & Delivery Specs */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Interactive Visual Map Station Box */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white font-heading flex items-center gap-2">
              <Navigation className="w-4 h-4 text-teal-500" />
              Live Geographical Location Map
            </h3>

            {/* Visual Simulated Interactive GPS / Radar Map */}
            <div className="relative rounded-2xl overflow-hidden h-64 bg-slate-950 border border-slate-800 flex items-center justify-center p-4">
              {/* Radar Grid Graphic */}
              <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              
              {/* Central Map Marker */}
              <div className="relative z-10 text-center space-y-2">
                <div className="relative inline-block">
                  <span className="w-12 h-12 rounded-full bg-emerald-500/30 flex items-center justify-center animate-ping absolute inset-0" />
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-500/50 relative z-10">
                    <MapPin className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    {trackingSteps[latestStepIndex]?.location || 'Savar DEPZ Plant'}
                  </h4>
                  <p className="text-[10px] text-emerald-400 font-mono">
                    Lat: 23.8583° N • Lon: 90.2667° E
                  </p>
                </div>
              </div>

              {/* Map Footer badge */}
              <div className="absolute bottom-3 left-3 right-3 p-2 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/50 flex items-center justify-between text-[10px] text-slate-300">
                <span>Dispatch Carrier: <strong>Garments Express Logistics</strong></span>
                <span className="text-emerald-400 font-bold">● GPS Verified</span>
              </div>
            </div>

            {/* Destination Address Info */}
            <div className="p-4 bg-gray-50 dark:bg-slate-800/60 rounded-2xl space-y-1.5 text-xs">
              <span className="text-gray-400 font-bold block uppercase text-[10px]">Buyer Delivery Address</span>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{order.deliveryAddress}</p>
              <p className="text-gray-400">Recipient Contact: {order.contactNumber}</p>
            </div>
          </div>

          {/* 💬 KNOCK PRODUCTION MANAGER SECTION */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-emerald-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white font-heading">
                    Knock Production Manager
                  </h3>
                  <p className="text-[10px] text-gray-400">Direct factory line inquiries & customization notes</p>
                </div>
              </div>
            </div>

            {/* Assigned Manager Card */}
            <div className="p-3.5 bg-gray-50 dark:bg-slate-800/60 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80"
                  alt="Production Head"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-xs">
                    Tariqul Production Head
                  </h4>
                  <span className="text-[10px] text-gray-400 block">
                    Assigned Floor Supervisor
                  </span>
                </div>
              </div>

              {/* Action Buttons: In-App Chat & WhatsApp */}
              <div className="flex items-center gap-2">
                <Link
                  to={`/dashboard/chat?email=manager@garmentstracker.com&orderId=${order._id}`}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>In-App Chat</span>
                </Link>
                <button
                  onClick={() => {
                    const wpText = encodeURIComponent(
                      `👋 *Hello Production Manager,*\n\n` +
                      `I am the buyer for Order *#${String(order._id).slice(-6)}* (${order.productTitle}, ${order.quantity} pcs).\n\n` +
                      `Could you please share an update or assist with our production schedule?\n\n` +
                      `🔗 *Tracking ID:* ${typeof window !== 'undefined' ? window.location.origin : 'https://garments-tracker-app.web.app'}/dashboard/track-order/${order._id}`
                    );
                    window.open(`https://wa.me/?text=${wpText}`, '_blank');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {/* In-App Production Knock Form */}
            <form onSubmit={handleSendKnockNote} className="space-y-2 pt-1">
              <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block">
                Post Live Instruction Note to Floor:
              </label>
              <div className="relative">
                <textarea
                  rows="2"
                  value={buyerKnockNote}
                  onChange={(e) => setBuyerKnockNote(e.target.value)}
                  placeholder="e.g. Please verify collar button quality before dispatch..."
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                disabled={sendingNote || !buyerKnockNote.trim()}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{sendingNote ? 'Submitting Note...' : 'Send Note to Manager'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
