import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { 
  PlusCircle, 
  Package, 
  Image as ImageIcon, 
  Video, 
  AlertCircle, 
  CheckCircle, 
  DollarSign, 
  Eye, 
  Trash2,
  Lock,
  Sparkles
} from 'lucide-react';
import { AuthContext } from '../../../AuthProvider/authProvider';
import api from '../../../api/api';
import usePageTitle from '../../../Shared/usePageTitle';

export default function AddProduct() {
  usePageTitle('Add Garment Product');

  const { user, dbUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [imageInput, setImageInput] = useState('');

  const isSuspended = dbUser?.status === 'suspended';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      category: 'Shirt',
      showOnHome: false,
      paymentOption1: true,
      paymentOption2: true,
      minOrder: 50,
      quantity: 1000
    }
  });

  const handleAddImageUrl = () => {
    if (imageInput.trim()) {
      setPreviewImages(prev => [...prev, imageInput.trim()]);
      setImageInput('');
    }
  };

  const removeImage = (idx) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = async (data) => {
    if (isSuspended) {
      Swal.fire({
        icon: 'error',
        title: 'Action Blocked',
        text: 'Suspended managers cannot create or publish new apparel products.'
      });
      return;
    }

    const finalImages = previewImages.length > 0 
      ? previewImages 
      : ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80"];

    const paymentOptions = [];
    if (data.paymentOption1) paymentOptions.push('Cash on Delivery');
    if (data.paymentOption2) paymentOptions.push('PayFirst');
    if (paymentOptions.length === 0) paymentOptions.push('Cash on Delivery');

    setSubmitting(true);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        category: data.category,
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity),
        minOrder: parseInt(data.minOrder),
        images: finalImages,
        demoVideo: data.demoVideo || '',
        paymentOptions: paymentOptions,
        showOnHome: Boolean(data.showOnHome),
        createdBy: user?.email || 'manager@garmentstracker.com'
      };

      const res = await api.post('/products', payload);
      if (res.data?.success) {
        Swal.fire({
          icon: 'success',
          title: 'Product Published!',
          text: `"${data.title}" added to inventory successfully!`,
          confirmButtonColor: '#059669'
        }).then(() => {
          navigate('/dashboard/manage-products');
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Publishing Failed',
        text: err.response?.data?.message || err.message
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-heading">
          Create New Garment Catalog Item
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Define fabric specifications, MOQ thresholds, payment models, and factory production media
        </p>
      </div>

      {/* Suspension Alert */}
      {isSuspended && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <strong className="block font-bold text-sm">Manager Account Suspended</strong>
            <span>Your publishing privileges are disabled due to suspension. Reason: {dbUser?.suspendReason || 'Policy check'}</span>
          </div>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Product Name / Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Product Name / Title *</label>
            <input
              type="text"
              disabled={isSuspended}
              {...register('title', { required: 'Product title is required' })}
              placeholder="e.g. 100% Cotton Heavyweight Flannel Shirt"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden disabled:opacity-50"
            />
            {errors.title && <p className="text-[11px] text-rose-500">{errors.title.message}</p>}
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Category *</label>
              <select
                disabled={isSuspended}
                {...register('category', { required: 'Category is required' })}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden disabled:opacity-50"
              >
                <option value="Shirt">Shirt</option>
                <option value="Pant">Pant</option>
                <option value="Jacket">Jacket</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Unit Price ($ USD) *</label>
              <input
                type="number"
                step="0.01"
                disabled={isSuspended}
                {...register('price', { required: 'Price is required', min: { value: 0.1, message: 'Price must be positive' } })}
                placeholder="24.50"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden disabled:opacity-50"
              />
              {errors.price && <p className="text-[11px] text-rose-500">{errors.price.message}</p>}
            </div>
          </div>

          {/* Available Quantity & MOQ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Available Stock Quantity *</label>
              <input
                type="number"
                disabled={isSuspended}
                {...register('quantity', { required: 'Quantity is required', min: { value: 1, message: 'Must be at least 1' } })}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden disabled:opacity-50"
              />
              {errors.quantity && <p className="text-[11px] text-rose-500">{errors.quantity.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Minimum Order Quantity (MOQ) *</label>
              <input
                type="number"
                disabled={isSuspended}
                {...register('minOrder', { required: 'MOQ is required', min: { value: 1, message: 'Must be at least 1' } })}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden disabled:opacity-50"
              />
              {errors.minOrder && <p className="text-[11px] text-rose-500">{errors.minOrder.message}</p>}
            </div>
          </div>

          {/* Product Description with AI Auto-Writer */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Product Description & Technical Specs *
              </label>
              <button
                type="button"
                disabled={isSuspended}
                onClick={() => {
                  const currentTitle = watch('title') || 'Apparel Garment';
                  const currentCat = watch('category') || 'Shirt';
                  let aiDesc = `Premium export-grade ${currentTitle.toLowerCase()}. Fabricated using 100% GOTS certified combed organic cotton with high-density double needle stitching. Pre-shrunk enzyme wash finish with dimensional stability and colorfastness compliant with international AQL 2.5 standards. Custom OEM private labeling supported.`;
                  if (currentCat === 'Jacket') {
                    aiDesc = `Heavyweight 14.5oz ring-spun denim jacket featuring triple-stitched felled seams, antique brass shank hardware, and reinforced pocket bar-tacks. Hand-finished with vintage stone enzyme wash. Export packaged in moisture-proof polybags.`;
                  } else if (currentCat === 'Pant') {
                    aiDesc = `Tailored 98/2 organic cotton-elastane stretch twill trousers with reinforced crotch gusset, pre-washed finish, and heavy-duty YKK brass zipper fly. Designed for all-day breathability and durability.`;
                  }
                  setValue('description', aiDesc);
                  Swal.fire({
                    icon: 'success',
                    title: '✨ AI Specs Generated!',
                    toast: true,
                    position: 'top-end',
                    timer: 1800,
                    showConfirmButton: false
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI Auto-Write Specs</span>
              </button>
            </div>
            <textarea
              rows="3"
              disabled={isSuspended}
              {...register('description', { required: 'Description is required' })}
              placeholder="Detail fabric composition (e.g., 95% Organic Cotton / 5% Elastane), stitch density, washing instructions..."
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden disabled:opacity-50"
            />
            {errors.description && <p className="text-[11px] text-rose-500">{errors.description.message}</p>}
          </div>

          {/* Multiple Image URLs with Live Previews */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-emerald-500" />
              Upload / Add Image URLs (Preview Before Uploading)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                disabled={isSuspended}
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="Paste HD image URL (https://...)"
                className="flex-1 px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden disabled:opacity-50"
              />
              <button
                type="button"
                disabled={isSuspended || !imageInput}
                onClick={handleAddImageUrl}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold disabled:opacity-40"
              >
                + Add Image
              </button>
            </div>

            {/* Previews */}
            {previewImages.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {previewImages.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-emerald-500/50 group">
                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute inset-0 bg-rose-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Demo Video Link (Optional) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <Video className="w-4 h-4 text-teal-500" />
              Demo Video Link (Optional)
            </label>
            <input
              type="url"
              disabled={isSuspended}
              {...register('demoVideo')}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden disabled:opacity-50"
            />
          </div>

          {/* Payment Options Selection */}
          <div className="space-y-2 p-4 bg-gray-50 dark:bg-slate-800/60 rounded-2xl border border-gray-200 dark:border-slate-700">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
              Supported Payment Options *
            </span>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isSuspended}
                  {...register('paymentOption1')}
                  className="checkbox checkbox-emerald checkbox-sm"
                />
                Cash on Delivery (COD)
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isSuspended}
                  {...register('paymentOption2')}
                  className="checkbox checkbox-emerald checkbox-sm"
                />
                PayFirst (Stripe / Digital Deposit)
              </label>
            </div>
          </div>

          {/* Show on Home Page */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="showOnHome"
              disabled={isSuspended}
              {...register('showOnHome')}
              className="checkbox checkbox-emerald checkbox-sm"
            />
            <label htmlFor="showOnHome" className="text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
              Show on Home Page "Our Products" Section (Default: false)
            </label>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting || isSuspended}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <PlusCircle className="w-5 h-5" />
              {submitting ? 'Creating Catalog Product...' : 'Publish Product to Catalog'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
