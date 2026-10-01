import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  X,
  Truck,
  DollarSign
} from 'lucide-react';
import api from '../../../api/api';
import usePageTitle from '../../../Shared/usePageTitle';
import LoadingSpinner from '../../../Shared/LoadingSpinner';

export default function AdminAllOrders() {
  usePageTitle('Admin All Orders');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // View Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (statusFilter !== 'all') queryParams.set('status', statusFilter);
      if (search) queryParams.set('search', search);

      const res = await api.get(`/orders?${queryParams.toString()}`);
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else if (res.data?.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-heading">
          All Orders & Production Pipelines
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Factory-wide overview of all wholesale bookings, buyer commitments, and fulfillment stages
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, product, or buyer..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-hidden"
          >
            <option value="all">All Orders</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved / In Production</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12">
            <LoadingSpinner text="Fetching all orders..." />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No orders found matching criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40 text-xs uppercase font-extrabold text-gray-400 tracking-wider">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Buyer / User</th>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Quantity</th>
                  <th className="py-4 px-6">Total Value</th>
                  <th className="py-4 px-6">Status</th>
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

                    {/* Buyer User */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={ord.userPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                          alt={ord.userName}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200 dark:ring-slate-700"
                        />
                        <div className="truncate max-w-[150px]">
                          <strong className="block text-xs font-bold text-gray-900 dark:text-white truncate">{ord.userName || ord.userEmail}</strong>
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
                      {ord.quantity} pcs
                    </td>

                    {/* Total Price */}
                    <td className="py-4 px-6 font-extrabold text-emerald-600 dark:text-emerald-400">
                      ৳{Number(ord.totalPrice || 0).toLocaleString()}
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
                        {ord.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                        {ord.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openOrderDetails(ord)}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-gray-700 dark:text-gray-300 hover:text-emerald-600 font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Info
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VIEW ORDER DETAILS & TRACKING HISTORY MODAL */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-gray-200 dark:border-slate-800 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                  Order Details & Factory Tracking
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  Order #{String(selectedOrder._id).toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overview Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-slate-800/60 rounded-2xl text-xs">
              <div>
                <span className="text-gray-400 font-bold block">Buyer Name</span>
                <strong className="text-gray-800 dark:text-gray-200">{selectedOrder.userName || selectedOrder.userEmail}</strong>
              </div>
              <div>
                <span className="text-gray-400 font-bold block">Product</span>
                <strong className="text-gray-800 dark:text-gray-200 truncate block">{selectedOrder.productTitle}</strong>
              </div>
              <div>
                <span className="text-gray-400 font-bold block">Order Volume</span>
                <strong className="text-gray-800 dark:text-gray-200">{selectedOrder.quantity} units (৳{Number(selectedOrder.totalPrice || 0).toLocaleString()})</strong>
              </div>
              <div>
                <span className="text-gray-400 font-bold block">Payment Mode</span>
                <strong className="text-emerald-600 dark:text-emerald-400">{selectedOrder.paymentOption} ({selectedOrder.paymentStatus})</strong>
              </div>
              <div>
                <span className="text-gray-400 font-bold block">Contact</span>
                <strong className="text-gray-800 dark:text-gray-200">{selectedOrder.contactNumber}</strong>
              </div>
              <div>
                <span className="text-gray-400 font-bold block">Order Date</span>
                <strong className="text-gray-800 dark:text-gray-200">{new Date(selectedOrder.createdAt).toLocaleDateString()}</strong>
              </div>
            </div>

            {/* Delivery Address & Notes */}
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <span className="text-gray-400 font-bold block">Delivery Destination</span>
                <p className="text-gray-800 dark:text-gray-200 mt-0.5">{selectedOrder.deliveryAddress}</p>
              </div>
              {selectedOrder.notes && (
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                  <span className="text-gray-400 font-bold block">Buyer Packaging Instructions</span>
                  <p className="text-gray-800 dark:text-gray-200 mt-0.5">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            {/* Production Tracking Timeline */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white font-heading flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-500" />
                Live Production Tracking Milestones
              </h4>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500/30">
                {selectedOrder.tracking?.map((step, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <span className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-600 ring-4 ring-emerald-100 dark:ring-emerald-950" />
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold text-gray-900 dark:text-white">{step.step}</strong>
                      <span className="text-[10px] text-gray-400">{new Date(step.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{step.note}</p>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                      <MapPin className="w-2.5 h-2.5" /> {step.location}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-gray-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-gray-800"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
