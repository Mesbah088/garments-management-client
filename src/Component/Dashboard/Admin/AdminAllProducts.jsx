import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { 
  Package, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  Plus, 
  ArrowUpDown,
  Layers,
  Sparkles
} from 'lucide-react';
import api from '../../../api/api';
import usePageTitle from '../../../Shared/usePageTitle';
import LoadingSpinner from '../../../Shared/LoadingSpinner';

export default function AdminAllProducts() {
  usePageTitle('Admin All Products Management');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Edit Modal
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else if (res.data?.products) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Toggle Show on Home
  const handleToggleHome = async (product) => {
    const updatedStatus = !product.showOnHome;
    try {
      const res = await api.patch(`/products/${product._id}/toggle-home`, {
        showOnHome: updatedStatus
      });

      if (res.data?.success) {
        setProducts(prev => prev.map(p => p._id === product._id ? { ...p, showOnHome: updatedStatus } : p));
        Swal.fire({
          icon: 'success',
          title: updatedStatus ? 'Added to Home Showcase' : 'Removed from Home Showcase',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  // Delete product with confirmation modal
  const handleDeleteProduct = async (product) => {
    const result = await Swal.fire({
      title: `Delete "${product.title}"?`,
      text: 'This apparel line and its inventory records will be removed from the catalog.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete product'
    });

    if (result.isConfirmed) {
      try {
        const res = await api.delete(`/products/${product._id}`);
        if (res.data?.success) {
          Swal.fire('Deleted!', 'Product removed successfully.', 'success');
          fetchProducts();
        }
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  };

  // Open Edit Modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || '',
      description: product.description || '',
      category: product.category || 'Shirt',
      price: product.price || 0,
      quantity: product.quantity || 0,
      minOrder: product.minOrder || 50,
      image1: product.images?.[0] || '',
      demoVideo: product.demoVideo || '',
      paymentOptions: product.paymentOptions || ['Cash on Delivery', 'PayFirst'],
      showOnHome: product.showOnHome || false
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        minOrder: parseInt(formData.minOrder),
        images: [formData.image1].filter(Boolean),
        demoVideo: formData.demoVideo,
        paymentOptions: formData.paymentOptions,
        showOnHome: formData.showOnHome
      };

      const res = await api.put(`/products/${editingProduct._id}`, payload);
      if (res.data?.success) {
        setIsEditModalOpen(false);
        Swal.fire({
          icon: 'success',
          title: 'Product Updated',
          text: 'Garment specs updated successfully.',
          timer: 2000,
          showConfirmButton: false
        });
        fetchProducts();
      }
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-heading">
            All Products Catalog Control
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Edit apparel items, manage inventory allocations, and select Home page highlights
          </p>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12">
            <LoadingSpinner text="Retrieving catalog..." />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No products found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40 text-xs uppercase font-extrabold text-gray-400 tracking-wider">
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-6">Product Name</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Created By</th>
                  <th className="py-4 px-6 text-center">Show on Home</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm">
                {filteredProducts.map((prod) => (
                  <tr key={prod._id} className="hover:bg-gray-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    
                    {/* Image */}
                    <td className="py-4 px-6">
                      <img
                        src={prod.images?.[0] || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=100&q=80"}
                        alt={prod.title}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-gray-200 dark:ring-slate-700"
                      />
                    </td>

                    {/* Name */}
                    <td className="py-4 px-6">
                      <strong className="font-bold text-gray-900 dark:text-white block">{prod.title}</strong>
                      <span className="text-xs text-gray-400">Stock: {prod.quantity} pcs | MOQ: {prod.minOrder}</span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6 font-bold text-emerald-600 dark:text-emerald-400">
                      ৳{Number(prod.price).toLocaleString()}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
                        {prod.category}
                      </span>
                    </td>

                    {/* Created By */}
                    <td className="py-4 px-6 text-xs text-gray-500 truncate max-w-[150px]">
                      {prod.createdBy || "Factory Admin"}
                    </td>

                    {/* Show on Home Toggle */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleHome(prod)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden ${
                          prod.showOnHome ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-slate-700'
                        }`}
                        title="Toggle Show on Home Page"
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            prod.showOnHome ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-gray-600 dark:text-gray-300 hover:text-emerald-600 transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod)}
                          className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-gray-600 dark:text-gray-300 hover:text-rose-600 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* EDIT PRODUCT MODAL */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-gray-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
                Edit Garment Specifications
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Product Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden"
                  >
                    <option value="Shirt">Shirt</option>
                    <option value="Pant">Pant</option>
                    <option value="Jacket">Jacket</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Price (৳ BDT) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Available Stock *</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Min Order (MOQ) *</label>
                  <input
                    type="number"
                    value={formData.minOrder}
                    onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Image URL</label>
                <input
                  type="url"
                  value={formData.image1}
                  onChange={(e) => setFormData({ ...formData, image1: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Demo Video Link (Optional)</label>
                <input
                  type="url"
                  value={formData.demoVideo}
                  onChange={(e) => setFormData({ ...formData, demoVideo: e.target.value })}
                  placeholder="https://youtube.com/..."
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Description *</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  {saving ? 'Saving...' : 'Update Product'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
