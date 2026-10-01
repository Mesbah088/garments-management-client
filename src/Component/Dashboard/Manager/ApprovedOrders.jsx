import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import { 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Plus, 
  Clock, 
  Layers, 
  X, 
  Calendar,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { AuthContext } from '../../../AuthProvider/authProvider';
import api from '../../../api/api';
import usePageTitle from '../../../Shared/usePageTitle';
import LoadingSpinner from '../../../Shared/LoadingSpinner';

export default function ApprovedOrders() {
  usePageTitle('Approved Orders & Live Tracking');

  const { dbUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tracking modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isAddTrackingOpen, setIsAddTrackingOpen] = useState(false);
  const [isViewTrackingOpen, setIsViewTrackingOpen] = useState(false);
  const [trackingStage, setTrackingStage] = useState('Cutting Completed');
  const [trackingLocation, setTrackingLocation] = useState('Plant Floor 2, Savar DEPZ');
  const [trackingNote, setTrackingNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const isSuspended = dbUser?.status === 'suspended';

  const trackingStages = [
    'Cutting Completed',
    'Sewing Started',
    'Finishing',
    'QC Checked',
    'Packed',
    'Shipped',
    'Out for Delivery'
  ];

  const fetchApprovedOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders?status=Approved');
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else if (res.data?.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch approved orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedOrders();
  }, []);

  const openAddTracking = (order) => {
    setSelectedOrder(order);
    setTrackingStage('Cutting Completed');
    setTrackingLocation('Plant Floor 2, Gazipur / Savar');
    setTrackingNote(`Production update: ${trackingStage} for ${order.quantity} units.`);
    setIsAddTrackingOpen(true);
  };

  const openViewTracking = (order) => {
    setSelectedOrder(order);
    setIsViewTrackingOpen(true);
  };

  const handleAddTrackingSubmit = async (e) => {
    e.preventDefault();
    if (isSuspended) {
      Swal.fire({
        icon: 'error',
        title: 'Action Denied',
        text: 'Suspended managers cannot update tracking milestones.'
      });
      return;
    }

    setUpdating(true);
    try {
      const payload = {
        step: trackingStage,
        location: trackingLocation,
        note: trackingNote || `Milestone reached: ${trackingStage}`,
        timestamp: new Date().toISOString()
      };

      const res = await api.post(`/orders/${selectedOrder._id}/tracking`, payload);
      if (res.data?.success) {
        setIsAddTrackingOpen(false);
        const wpMsg = encodeURIComponent(
          `🏭 *GarmentsTracker Production Milestone Update!*\n\n` +
          `📋 *Order ID:* #${String(selectedOrder._id).slice(-6)}\n` +
          `👕 *Product:* ${selectedOrder.productTitle}\n` +
          `📍 *New Milestone:* ${trackingStage}\n` +
          `🏢 *Location:* ${trackingLocation}\n` +
          `📝 *Note:* ${trackingNote || 'Standard QA inspection passed.'}\n` +
          `🔗 *Live Tracking:* http://localhost:5173/dashboard/track-order/${selectedOrder._id}`
        );

        Swal.fire({
          icon: 'success',
          title: 'Tracking Stage Logged!',
          html: `<p class="text-sm text-gray-600 dark:text-gray-300 mb-2">Stage <strong>${trackingStage}</strong> recorded successfully.</p><p class="text-xs text-gray-500 dark:text-gray-400">Would you like to send an instant <strong>WhatsApp Progress Alert</strong> to the Admin & Buyer?</p>`,
          showCancelButton: true,
          confirmButtonText: '📲 Send WhatsApp Alert',
          cancelButtonText: 'Close',
          confirmButtonColor: '#25D366',
          cancelButtonColor: '#64748b'
        }).then((result) => {
          if (result.isConfirmed) {
            window.open(`https://wa.me/?text=${wpMsg}`, '_blank');
          }
        });
        fetchApprovedOrders();
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-heading">
          Approved Orders & Factory Tracking
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Monitor active production floor pipelines and append live tracking milestones for global buyers
        </p>
      </div>

      {isSuspended && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <strong className="block font-bold text-sm">Account Suspended</strong>
            <span>Your manager account is restricted from submitting production milestone updates.</span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12">
            <LoadingSpinner text="Fetching approved production orders..." />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <CheckCircle2 className="w-12 h-12 mx-auto opacity-40 text-emerald-500" />
            <p className="text-sm font-bold">No active approved orders currently.</p>
            <p className="text-xs text-gray-500">Approve pending orders to start scheduling factory tracking steps.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40 text-xs uppercase font-extrabold text-gray-400 tracking-wider">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">User / Buyer</th>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Quantity</th>
                  <th className="py-4 px-6">Approved Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-gray-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    
                    {/* Order ID */}
                    <td className="py-4 px-6 font-mono font-bold text-xs text-gray-900 dark:text-gray-100">
                      #{String(ord._id).slice(-8).toUpperCase()}
                    </td>

                    {/* Buyer */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={ord.userPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                          alt="Buyer"
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200 dark:ring-slate-700"
                        />
                        <div className="truncate max-w-[150px]">
                          <strong className="block text-xs font-bold text-gray-900 dark:text-white truncate">{ord.userName}</strong>
                          <span className="text-[10px] text-gray-400 truncate block">{ord.userEmail}</span>
                        </div>
                      </div>
                    </td>

                    {/* Product */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {ord.productImage && (
                          <img src={ord.productImage} alt={ord.productTitle} className="w-8 h-8 rounded-lg object-cover" />
                        )}
                        <span className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1 max-w-[180px]">
                          {ord.productTitle}
                        </span>
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="py-4 px-6 font-bold text-gray-900 dark:text-white">
                      {ord.quantity} pcs (৳{Number(ord.totalPrice || 0).toLocaleString()})
                    </td>

                    {/* Approved Date */}
                    <td className="py-4 px-6 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      {ord.approvedAt ? new Date(ord.approvedAt).toLocaleDateString() : new Date(ord.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* In-App Live Chat with Buyer */}
                        <Link
                          to={`/dashboard/chat?email=${encodeURIComponent(ord.userEmail)}&orderId=${ord._id}`}
                          className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 transition-colors"
                          title="In-App Live Chat with Buyer"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => openViewTracking(ord)}
                          className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          View Tracking ({ord.tracking?.length || 0})
                        </button>

                        <button
                          disabled={isSuspended}
                          onClick={() => openAddTracking(ord)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs disabled:opacity-40"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Tracking
                        </button>

                        <button
                          onClick={() => {
                            const latestTrack = ord.tracking?.[ord.tracking.length - 1] || {};
                            const wpMsg = encodeURIComponent(
                              `🏭 *GarmentsTracker Production Status Alert*\n\n` +
                              `📋 *Order ID:* #${String(ord._id).slice(-6)}\n` +
                              `👕 *Product:* ${ord.productTitle}\n` +
                              `📦 *Quantity:* ${ord.quantity} units (৳${Number(ord.totalPrice || 0).toLocaleString()} BDT)\n` +
                              `📍 *Latest Milestone:* ${latestTrack.step || 'Production Scheduled'}\n` +
                              `🏢 *Location:* ${latestTrack.location || 'Factory Floor'}\n` +
                              `🔗 *Live Tracking:* http://localhost:5173/dashboard/track-order/${ord._id}`
                            );
                            window.open(`https://wa.me/?text=${wpMsg}`, '_blank');
                          }}
                          title="Send WhatsApp Alert to Admin & Buyer"
                          className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD TRACKING UPDATE MODAL */}
      {isAddTrackingOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-gray-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
                  Add Tracking Update
                </h3>
                <p className="text-xs text-gray-400">
                  Order #{String(selectedOrder._id).slice(-8).toUpperCase()} • {selectedOrder.productTitle}
                </p>
              </div>
              <button onClick={() => setIsAddTrackingOpen(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTrackingSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Production / Dispatch Stage *</label>
                <select
                  value={trackingStage}
                  onChange={(e) => {
                    setTrackingStage(e.target.value);
                    setTrackingNote(`Milestone update: ${e.target.value} completed for order.`);
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {trackingStages.map((stg, i) => (
                    <option key={i} value={stg}>{stg}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Location *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={trackingLocation}
                    onChange={(e) => setTrackingLocation(e.target.value)}
                    required
                    placeholder="e.g. Cutting Bay 4 / QC Laboratory / SAVAR Terminal"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Milestone Notes / Details</label>
                <textarea
                  rows="3"
                  value={trackingNote}
                  onChange={(e) => setTrackingNote(e.target.value)}
                  placeholder="e.g. 100% seam density verified. Packaging in export polybags."
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTrackingOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  {updating ? 'Appending Milestone...' : 'Save Tracking Milestone'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* VIEW TRACKING TIMELINE MODAL */}
      {isViewTrackingOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-gray-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
                  Product Movement Timeline
                </h3>
                <p className="text-xs text-gray-400">
                  Order #{String(selectedOrder._id).slice(-8).toUpperCase()} • {selectedOrder.quantity} units
                </p>
              </div>
              <button onClick={() => setIsViewTrackingOpen(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500/30">
              {selectedOrder.tracking?.map((step, idx) => {
                const isLatest = idx === selectedOrder.tracking.length - 1;
                return (
                  <div key={idx} className={`relative p-3 rounded-2xl transition-all ${isLatest ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800' : 'bg-gray-50/60 dark:bg-slate-800/40'}`}>
                    <span className={`absolute -left-[30px] top-4 w-3.5 h-3.5 rounded-full ${isLatest ? 'bg-emerald-500 ring-4 ring-emerald-300 dark:ring-emerald-900 animate-pulse' : 'bg-slate-400 ring-4 ring-gray-100 dark:ring-slate-800'}`} />
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold text-gray-900 dark:text-white">{step.step}</strong>
                      <span className="text-[10px] text-gray-400">{new Date(step.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{step.note}</p>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold mt-1">
                      <MapPin className="w-2.5 h-2.5" /> {step.location}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsViewTrackingOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-slate-800 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
