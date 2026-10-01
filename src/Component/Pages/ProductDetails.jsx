import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { 
  Scissors, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  AlertCircle, 
  CheckCircle, 
  Layers, 
  Video, 
  X, 
  ArrowLeft,
  Lock,
  DollarSign,
  MessageSquare
} from 'lucide-react';
import { AuthContext } from '../../AuthProvider/authProvider';
import api from '../../api/api';
import usePageTitle from '../../Shared/usePageTitle';
import LoadingSpinner from '../../Shared/LoadingSpinner';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, dbUser } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPaymentStep, setIsPaymentStep] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  usePageTitle(product ? product.title : 'Product Details');

  // React Hook Form for booking
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm();

  const watchQuantity = watch('quantity', 0);
  const watchPaymentOption = watch('paymentOption', 'Cash on Delivery');

  // Fetch single product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        if (res.data?.images?.length > 0) {
          setSelectedImage(res.data.images[0]);
        }
        if (res.data?.minOrder) {
          setValue('quantity', res.data.minOrder);
        }
        if (res.data?.paymentOptions?.length > 0) {
          setValue('paymentOption', res.data.paymentOptions[0]);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
        Swal.fire({
          icon: 'error',
          title: 'Product Not Found',
          text: 'The requested product could not be loaded.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, setValue]);

  if (loading) {
    return <LoadingSpinner text="Retrieving detailed garment specs..." />;
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto my-16 p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 space-y-4">
        <h2 className="text-2xl font-bold">Product not available</h2>
        <Link to="/allproduct" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const role = dbUser?.role || 'buyer';
  const isSuspended = dbUser?.status === 'suspended';
  const isBuyer = role === 'buyer';
  const canBook = isBuyer && !isSuspended;

  // Auto-calculated order price
  const unitPrice = Number(product.price) || 0;
  const qtyNumber = parseInt(watchQuantity) || 0;
  const calculatedTotalPrice = (unitPrice * qtyNumber).toFixed(2);

  // Handle Form Submit
  const onBookingSubmit = async (data) => {
    const orderPayload = {
      userEmail: user?.email,
      userName: `${data.firstName} ${data.lastName}`,
      userPhoto: user?.photoURL || '',
      productId: product._id,
      productTitle: product.title,
      productCategory: product.category,
      productImage: selectedImage || product.images?.[0] || '',
      unitPrice: unitPrice,
      quantity: qtyNumber,
      paymentOption: data.paymentOption,
      firstName: data.firstName,
      lastName: data.lastName,
      contactNumber: data.contactNumber,
      deliveryAddress: data.deliveryAddress,
      notes: data.notes || '',
    };

    if (data.paymentOption === 'PayFirst') {
      setBookingData(orderPayload);
      setIsPaymentStep(true);
    } else {
      // Direct Cash on Delivery placement
      saveOrderToDatabase(orderPayload);
    }
  };

  const saveOrderToDatabase = async (payload) => {
    setSubmitting(true);
    try {
      const res = await api.post('/orders', payload);
      if (res.data?.success || res.data?.insertedId || res.data?.acknowledged || res.status === 200 || res.status === 201) {
        setIsBookingOpen(false);
        setIsPaymentStep(false);
        Swal.fire({
          icon: 'success',
          title: 'Order Placed Successfully!',
          text: `Your production booking for ${payload.quantity} units of "${product.title}" has been registered.`,
          confirmButtonColor: '#059669',
          confirmButtonText: 'View in My Orders'
        }).then(() => {
          navigate('/dashboard/my-orders');
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: err.response?.data?.message || err.message || 'Could not place order'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Back button */}
      <div>
        <Link
          to="/allproduct"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Image Gallery & Demo Video */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 shadow-md">
            <img
              src={selectedImage || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {product.category}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img
                      ? 'border-emerald-500 scale-95 shadow-md'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Demo Video Section if present */}
          {product.demoVideo && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-slate-900 border border-emerald-200/60 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Product Demo Video Available</h4>
                  <p className="text-xs text-gray-500">Watch fabric drape, stitch quality & fit test</p>
                </div>
              </div>
              <a
                href={product.demoVideo}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
              >
                Watch Video
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Information & Booking Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-md">
              {product.category} Production Line
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-950 dark:text-white font-heading">
              {product.title}
            </h1>
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400 font-heading">
                ৳{Number(product.price).toLocaleString()}
              </span>
              <span className="text-sm font-medium text-gray-400">BDT per piece (Wholesale FOB)</span>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 font-heading">
              Fabric Specifications & Description
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quick Production Details Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase text-gray-400 block">Available Quantity</span>
              <span className="text-lg font-black text-gray-900 dark:text-white">{product.quantity} pcs</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase text-gray-400 block">Minimum Order (MOQ)</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{product.minOrder} pcs</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase text-gray-400 block">Lead Time</span>
              <span className="text-lg font-black text-gray-900 dark:text-white">7 - 14 Days</span>
            </div>
          </div>

          {/* Accepted Payment Options */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block">
              Available Payment Methods:
            </span>
            <div className="flex flex-wrap gap-2">
              {product.paymentOptions?.map((opt, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200 shadow-2xs"
                >
                  {opt === 'PayFirst' ? <CreditCard className="w-3.5 h-3.5 text-emerald-500" /> : <Banknote className="w-3.5 h-3.5 text-teal-500" />}
                  {opt}
                </span>
              ))}
            </div>
          </div>

          {/* Order / Booking Action Area */}
          <div className="pt-2 space-y-3">
            {isSuspended ? (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <strong className="block font-bold text-sm">Account Suspended</strong>
                  <span>Your account is currently restricted from placing new bookings. Reason: {dbUser?.suspendReason || "Administrative restriction"}</span>
                </div>
              </div>
            ) : !isBuyer ? (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-amber-800 dark:text-amber-300">
                <Lock className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <strong className="block font-bold text-sm">Role Restriction</strong>
                  <span>Order booking is designated exclusively for Buyer accounts. You are currently logged in as a <strong>{role.toUpperCase()}</strong>.</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="flex-1 w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-base shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Book Production Order Now
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const wpText = encodeURIComponent(
                      `👋 *Hello Merchandiser / Manager,*\n\n` +
                      `I am interested in your apparel product: *${product.title}* (৳${Number(product.price).toLocaleString()} BDT/pc, MOQ ${product.minOrder} pcs).\n\n` +
                      `Could you please share fabric swatches / custom sample details?\n\n` +
                      `🔗 *Product URL:* ${window.location.href}`
                    );
                    window.open(`https://wa.me/?text=${wpText}`, '_blank');
                  }}
                  className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                  title="Direct WhatsApp Inquire with Merchandiser"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>WhatsApp Inquire</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* BOOKING ORDER MODAL / FORM */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-gray-100 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
                  {isPaymentStep ? 'Secure Payment Confirmation' : 'Garments Production Booking Form'}
                </h3>
                <p className="text-xs text-gray-500">
                  {isPaymentStep ? 'Complete digital deposit to authorize factory production' : 'Specify order volume, shipping address, and delivery notes'}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsBookingOpen(false);
                  setIsPaymentStep(false);
                }}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: BOOKING FORM */}
            {!isPaymentStep ? (
              <form onSubmit={handleSubmit(onBookingSubmit)} className="space-y-4">
                
                {/* Read-Only Fields Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-slate-800/60 rounded-2xl border border-gray-200/80 dark:border-slate-700/60 text-xs">
                  <div>
                    <span className="text-gray-400 font-bold block">Buyer Email</span>
                    <strong className="text-gray-800 dark:text-gray-200 truncate block">{user?.email}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block">Product Title</span>
                    <strong className="text-gray-800 dark:text-gray-200 truncate block">{product.title}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block">Unit Price (FOB BDT)</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-extrabold">৳{Number(unitPrice).toLocaleString()}</strong>
                  </div>
                </div>

                {/* Name inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">First Name *</label>
                    <input
                      type="text"
                      defaultValue={user?.displayName?.split(' ')[0] || ''}
                      {...register('firstName', { required: 'First name is required' })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      placeholder="e.g. John"
                    />
                    {errors.firstName && <p className="text-[11px] text-rose-500">{errors.firstName.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Last Name *</label>
                    <input
                      type="text"
                      defaultValue={user?.displayName?.split(' ')[1] || ''}
                      {...register('lastName', { required: 'Last name is required' })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      placeholder="e.g. Doe"
                    />
                    {errors.lastName && <p className="text-[11px] text-rose-500">{errors.lastName.message}</p>}
                  </div>
                </div>

                {/* Quantity and Auto-Calculated Total Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Order Quantity (Min: {product.minOrder}, Max: {product.quantity}) *
                    </label>
                    <input
                      type="number"
                      {...register('quantity', {
                        required: 'Quantity is required',
                        min: { value: product.minOrder, message: `Cannot be less than MOQ (${product.minOrder} pcs)` },
                        max: { value: product.quantity, message: `Cannot exceed available stock (${product.quantity} pcs)` }
                      })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                    {errors.quantity && <p className="text-[11px] text-rose-500">{errors.quantity.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Calculated Order Price (৳ BDT)
                    </label>
                    <div className="px-4 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                      ৳{Number(calculatedTotalPrice).toLocaleString()} BDT
                    </div>
                  </div>
                </div>

                {/* Contact and Payment Option */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Contact Number *</label>
                    <input
                      type="tel"
                      {...register('contactNumber', { required: 'Contact phone is required' })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      placeholder="+880 1711-000000"
                    />
                    {errors.contactNumber && <p className="text-[11px] text-rose-500">{errors.contactNumber.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Payment Option *</label>
                    <select
                      {...register('paymentOption')}
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      {product.paymentOptions?.map((opt, idx) => (
                        <option key={idx} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Delivery / Warehouse Address *</label>
                  <textarea
                    rows="2"
                    {...register('deliveryAddress', { required: 'Delivery address is required' })}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="Full street address, port, or warehouse delivery destination..."
                  />
                  {errors.deliveryAddress && <p className="text-[11px] text-rose-500">{errors.deliveryAddress.message}</p>}
                </div>

                {/* Additional Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Additional Instructions / Packaging Notes (Optional)</label>
                  <textarea
                    rows="2"
                    {...register('notes')}
                    className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="Custom neck labels, export carton packaging, hanger packs..."
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsBookingOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    {watchPaymentOption === 'PayFirst' ? 'Proceed to Online Payment' : 'Confirm Order Booking'}
                  </button>
                </div>
              </form>
            ) : (
              /* STEP 2: SIMULATED STRIPE / PAYFIRST PAYMENT GATEWAY */
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200 text-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Order Total:</span>
                    <strong className="text-xl font-black">৳{Number(calculatedTotalPrice).toLocaleString()} BDT</strong>
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Payment simulation via Stripe / PayFirst for {bookingData?.quantity} units.
                  </p>
                </div>

                <div className="space-y-4 p-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Card Number (Simulated)</label>
                    <div className="relative">
                      <input
                        type="text"
                        defaultValue="4242 •••• •••• 4242"
                        disabled
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl text-sm font-mono"
                      />
                      <CreditCard className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Expiry Date</label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        disabled
                        className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl text-sm font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300">CVC</label>
                      <input
                        type="text"
                        defaultValue="888"
                        disabled
                        className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setIsPaymentStep(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    Back to Form
                  </button>
                  <button
                    onClick={() => saveOrderToDatabase(bookingData)}
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    {submitting ? 'Processing Authorization...' : `Pay ৳${Number(calculatedTotalPrice).toLocaleString()} BDT & Confirm Order`}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
