import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Clock, CheckCircle2, XCircle, Eye, AlertCircle, X, MapPin } from 'lucide-react';
import { AuthContext } from '../../../AuthProvider/authProvider';
import api from '../../../api/api';
import usePageTitle from '../../../Shared/usePageTitle';
import LoadingSpinner from '../../../Shared/LoadingSpinner';

export default function PendingOrders() {
  usePageTitle('Pending Wholesale Orders');

  const { user, dbUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const isSuspended = dbUser?.status === 'suspended';

  const fetchPendingOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders?status=Pending');
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else if (res.data?.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load pending orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (isSuspended) {
      Swal.fire({
        icon: 'error',
        title: 'Action Prohibited',
        text: 'Suspended managers cannot approve or reject orders.'
      });
      return;
    }

    const actionText = newStatus === 'Approved' ? 'Approve & schedule production' : 'Reject';
    const confirm = await Swal.fire({
      title: `${actionText} Order?`,
      text: newStatus === 'Approved' 
        ? 'This will allocate factory cutting line and log approval timestamp.'
        : 'This will reject the buyer booking.',
      icon: newStatus === 'Approved' ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'Approved' ? '#059669' : '#e11d48',
      confirmButtonText: `Yes, ${newStatus} Order`
    });

    if (confirm.isConfirmed) {
      try {
        const res = await api.patch(`/orders/${orderId}/status`, {
          status: newStatus,
          managerEmail: user?.email
        });

        if (res.data?.success) {
          Swal.fire({
            icon: 'success',
            title: `Order ${newStatus}`,
            text: `Order status changed to ${newStatus} successfully!`,
            timer: 2000,
            showConfirmButton: false
          });
          fetchPendingOrders();
        }
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || err.message, 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-heading">
          Pending Production Orders
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Review incoming buyer orders, verify custom specifications, and authorize factory line schedules
        </p>
      </div>

      {isSuspended && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <strong className="block font-bold text-sm">Action Restricted</strong>
            <span>Your manager account is suspended. You cannot approve or reject pending orders.</span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12">
            <LoadingSpinner text="Fetching pending buyer orders..." />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <Clock className="w-12 h-12 mx-auto opacity-40 text-emerald-500" />
            <p className="text-sm font-bold">No pending orders awaiting review.</p>
            <p className="text-xs text-gray-500">All buyer bookings are currently processed and assigned to factory lines.</p>
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
                  <th className="py-4 px-6">Order Date</th>
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
                      {ord.quantity} pcs (${ord.totalPrice})
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-xs text-gray-500">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setIsViewOpen(true);
                          }}
                          className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-gray-600 dark:text-gray-300 hover:text-emerald-600 transition-colors"
                          title="View Order Specs"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          disabled={isSuspended}
                          onClick={() => handleUpdateStatus(ord._id, 'Approved')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs disabled:opacity-40"
                          title="Approve Order"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </button>

                        <button
                          disabled={isSuspended}
                          onClick={() => handleUpdateStatus(ord._id, 'Rejected')}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs disabled:opacity-40"
                          title="Reject Order"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
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

      {/* VIEW ORDER DETAILS MODAL */}
      {isViewOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-gray-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
                Pending Booking Details
              </h3>
              <button onClick={() => setIsViewOpen(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <strong className="block text-sm text-gray-900 dark:text-white">{selectedOrder.productTitle}</strong>
                <p className="text-gray-500">Buyer: {selectedOrder.userName} ({selectedOrder.userEmail})</p>
                <p className="text-gray-500">Contact: {selectedOrder.contactNumber}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-gray-400 font-bold block">Quantity</span>
                  <strong className="text-sm">{selectedOrder.quantity} units</strong>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-gray-400 font-bold block">Calculated Total</span>
                  <strong className="text-sm text-emerald-600 dark:text-emerald-400">${selectedOrder.totalPrice}</strong>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-gray-400 font-bold block">Delivery Address</span>
                <p className="mt-0.5">{selectedOrder.deliveryAddress}</p>
              </div>

              {selectedOrder.notes && (
                <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-gray-400 font-bold block">Special Notes</span>
                  <p className="mt-0.5">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsViewOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500"
              >
                Close
              </button>
              <button
                disabled={isSuspended}
                onClick={() => {
                  setIsViewOpen(false);
                  handleUpdateStatus(selectedOrder._id, 'Approved');
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 disabled:opacity-40"
              >
                Approve Production
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
