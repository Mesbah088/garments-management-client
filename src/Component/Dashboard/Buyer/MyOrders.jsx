import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import { 
  ShoppingBag, 
  Truck, 
  Eye, 
  Ban, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  CreditCard, 
  Banknote,
  MapPin,
  X,
  MessageSquare
} from 'lucide-react';
import { AuthContext } from '../../../AuthProvider/authProvider';
import api from '../../../api/api';
import usePageTitle from '../../../Shared/usePageTitle';
import LoadingSpinner from '../../../Shared/LoadingSpinner';

export default function MyOrders() {
  usePageTitle('My Orders');

  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // View modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const fetchMyOrders = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const res = await api.get(`/orders?email=${user.email}`);
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else if (res.data?.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load my orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, [user?.email]);

  const handleCancelOrder = async (order) => {
    const confirm = await Swal.fire({
      title: 'Cancel this order booking?',
      text: `Are you sure you want to cancel order #${String(order._id).slice(-8).toUpperCase()}? Product inventory will be released.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Cancel Order'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await api.patch(`/orders/${order._id}/cancel`, {});
        if (res.data?.success) {
          Swal.fire({
            icon: 'success',
            title: 'Order Cancelled',
            text: 'Your order was cancelled successfully.',
            timer: 2000,
            showConfirmButton: false
          });
          fetchMyOrders();
        }
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || err.message, 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-heading">
            My Production Bookings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Track your wholesale garments orders, view real-time stage progress, and manage pending bookings
          </p>
        </div>

        <Link
          to="/allproduct"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          Browse More Garments
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12">
            <LoadingSpinner text="Retrieving your orders..." />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <ShoppingBag className="w-12 h-12 mx-auto opacity-40 text-emerald-500" />
            <p className="text-base font-bold text-gray-700 dark:text-gray-300">You haven't placed any orders yet.</p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Explore our export-grade catalog to configure wholesale apparel orders with live tracking.
            </p>
            <Link
              to="/allproduct"
              className="inline-block mt-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40 text-xs uppercase font-extrabold text-gray-400 tracking-wider">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Quantity</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Payment</th>
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

                    {/* Product */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={ord.productImage || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=100&q=80"}
                          alt={ord.productTitle}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-gray-200 dark:ring-slate-700 shrink-0"
                        />
                        <div>
                          <strong className="block font-bold text-gray-900 dark:text-white line-clamp-1 max-w-[200px]">
                            {ord.productTitle}
                          </strong>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{ord.productCategory}</span>
                        </div>
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="py-4 px-6">
                      <strong className="font-bold text-gray-900 dark:text-white block">{ord.quantity} pcs</strong>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold">৳{Number(ord.totalPrice).toLocaleString()}</span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        ord.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : ord.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                          : ord.status === 'Cancelled'
                          ? 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                      }`}>
                        {ord.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                        {ord.status === 'Pending' && <Clock className="w-3 h-3" />}
                        {ord.status === 'Cancelled' && <Ban className="w-3 h-3" />}
                        {ord.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                        {ord.status}
                      </span>
                    </td>

                    {/* Payment */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                        {ord.paymentOption === 'PayFirst' ? <CreditCard className="w-3 h-3 text-emerald-500" /> : <Banknote className="w-3 h-3 text-teal-500" />}
                        {ord.paymentOption}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* In-App Live Chat Button */}
                        <Link
                          to={`/dashboard/chat?email=manager@garmentstracker.com&orderId=${ord._id}`}
                          className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 transition-colors"
                          title="In-App Live Chat with Manager"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Link>

                        {/* WhatsApp Knock Button */}
                        <button
                          onClick={() => {
                            const wpText = encodeURIComponent(
                              `👋 *Hello Production Manager,*\n\n` +
                              `I am the buyer for Order *#${String(ord._id).slice(-6)}* (${ord.productTitle}, ${ord.quantity} pcs).\n\n` +
                              `Could you please share an update or confirm my order customization instructions?\n\n` +
                              `🔗 *Order Details:* ${typeof window !== 'undefined' ? window.location.origin : 'https://garments-tracker-app.web.app'}/dashboard/track-order/${ord._id}`
                            );
                            window.open(`https://wa.me/?text=${wpText}`, '_blank');
                          }}
                          className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-[#25D366] hover:text-white text-emerald-600 dark:text-emerald-400 transition-colors"
                          title="Knock Manager on WhatsApp"
                        >
                          <Phone className="w-4 h-4" />
                        </button>

                        {/* Track Order Button */}
                        <Link
                          to={`/dashboard/track-order/${ord._id}`}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors inline-flex items-center gap-1.5"
                          title="View Live Tracking & Map"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          Track
                        </Link>

                        {/* View Button */}
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setIsViewOpen(true);
                          }}
                          className="p-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-600 dark:text-gray-300 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Cancel Button (ONLY visible if status === 'Pending') */}
                        {ord.status === 'Pending' && (
                          <button
                            onClick={() => handleCancelOrder(ord)}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors inline-flex items-center gap-1 border border-rose-200 dark:border-rose-900/50"
                            title="Cancel Order"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            Cancel
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
      </div>

      {/* VIEW ORDER DETAILS MODAL */}
      {isViewOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-gray-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
                  Order Booking Summary
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  #{String(selectedOrder._id).toUpperCase()}
                </p>
              </div>
              <button onClick={() => setIsViewOpen(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <strong className="block text-sm text-gray-900 dark:text-white">{selectedOrder.productTitle}</strong>
                <p className="text-emerald-600 font-semibold">{selectedOrder.quantity} units • ৳{Number(selectedOrder.totalPrice).toLocaleString()} BDT</p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-gray-400 font-bold block">Delivery Destination</span>
                <p className="mt-0.5">{selectedOrder.deliveryAddress}</p>
              </div>

              {selectedOrder.notes && (
                <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-gray-400 font-bold block">Notes / Custom Instructions</span>
                  <p className="mt-0.5">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <Link
                  to={`/dashboard/track-order/${selectedOrder._id}`}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5 shadow-2xs"
                >
                  <Truck className="w-3.5 h-3.5" /> Open Full Timeline
                </Link>

                <Link
                  to={`/dashboard/chat?email=manager@garmentstracker.com&orderId=${selectedOrder._id}`}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> In-App Chat
                </Link>

                <button
                  onClick={() => {
                    const wpText = encodeURIComponent(
                      `👋 *Hello Production Manager,*\n\n` +
                      `I am the buyer for Order *#${String(selectedOrder._id).slice(-6)}* (${selectedOrder.productTitle}, ${selectedOrder.quantity} pcs).\n\n` +
                      `Could you please share an update or assist with our production schedule?\n\n` +
                      `🔗 *Order Details:* ${typeof window !== 'undefined' ? window.location.origin : 'https://garments-tracker-app.web.app'}/dashboard/track-order/${selectedOrder._id}`
                    );
                    window.open(`https://wa.me/?text=${wpText}`, '_blank');
                  }}
                  className="px-3.5 py-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> Knock on WhatsApp
                </button>
              </div>

              <button
                onClick={() => setIsViewOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 text-xs font-bold transition-colors"
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
