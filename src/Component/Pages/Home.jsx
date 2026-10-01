import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { 
  Scissors, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Truck, 
  Award, 
  Users, 
  TrendingUp, 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  Star,
  Sparkles,
  ShoppingBag,
  Clock
} from 'lucide-react';
import api from '../../api/api';
import usePageTitle from '../../Shared/usePageTitle';
import LoadingSpinner from '../../Shared/LoadingSpinner';
import AnimatedCounter from '../../Shared/AnimatedCounter';

export default function Home() {
  usePageTitle('Home | Smart Production & Order Tracker');
  
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Fetch 6 Products for Home with limit from MongoDB / API
  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const res = await api.get('/products?limit=6&showOnHome=true');
        if (Array.isArray(res.data)) {
          setFeaturedProducts(res.data);
        } else if (res.data?.products) {
          setFeaturedProducts(res.data.products.slice(0, 6));
        }
      } catch (err) {
        console.error('Error loading featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeProducts();
  }, []);

  // Customer Feedback Testimonials Data
  const reviews = [
    {
      name: "Marcus Vance",
      company: "Nordic Apparel Group (Sweden)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      comment: "GarmentsTracker revolutionized our overseas sourcing. We watched our 5,000-unit jacket order transition through laser cutting, sewing lines, and QC inspection in real-time. Delivery was 4 days ahead of schedule!"
    },
    {
      name: "Elena Rostova",
      company: "Apex Streetwear London (UK)",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      comment: "The transparency is unbelievable. Being able to see exact factory milestones and high-GSM fabric lab tests before final packing eliminated all sourcing anxiety for our European retail outlets."
    },
    {
      name: "David Chen",
      company: "Pacific Coast Retailers (USA)",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      comment: "The MOQ flexibility and immediate calculated booking prices make quotation and procurement seamless. Our favorite garment manufacturing partner."
    }
  ];

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Step by step workflow
  const workflowSteps = [
    {
      step: "01",
      title: "Select & Configure Order",
      desc: "Browse our export-grade catalog, choose fabrics, specs, and MOQ quantity with live automatic price calculation.",
      icon: <ShoppingBag className="w-6 h-6 text-emerald-500" />
    },
    {
      step: "02",
      title: "Manager Approval & CAD",
      desc: "Factory supervisors verify specs, allocate automated laser cutting patterns, and approve production batches.",
      icon: <CheckCircle2 className="w-6 h-6 text-teal-500" />
    },
    {
      step: "03",
      title: "Live Production Tracking",
      desc: "Track status across Cutting, Sewing, Finishing, and AQL 2.5 Quality Inspection with interactive updates.",
      icon: <Layers className="w-6 h-6 text-cyan-500" />
    },
    {
      step: "04",
      title: "Packaging & Global Dispatch",
      desc: "Final QC barcode scanning, polybag packing, customs clearance, and live freight carrier delivery tracking.",
      icon: <Truck className="w-6 h-6 text-indigo-500" />
    }
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* 1. HERO BANNER */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-b from-emerald-950/20 via-slate-900/5 to-transparent">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/15 dark:bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Next-Gen Smart Apparel Manufacturing Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-950 dark:text-white leading-[1.1] font-heading">
                Garments Order & <br />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  Live Production Tracker
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
                Connect global fashion buyers with factory production lines. Monitor real-time cutting, sewing, and QC milestones, manage custom MOQ batches, and accelerate international supply chains.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/allproduct"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Explore Products
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-800 dark:text-gray-200 font-bold text-sm border border-gray-200 dark:border-slate-800 shadow-sm transition-all"
                >
                  Factory Infrastructure
                </Link>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200/80 dark:border-slate-800/80 max-w-lg">
                <div>
                  <h4 className="text-2xl font-black text-gray-900 dark:text-white font-heading">
                    <AnimatedCounter end={150} suffix="K+" duration={2} />
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Garments</p>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-gray-900 dark:text-white font-heading">
                    <AnimatedCounter end={99.8} decimals={1} suffix="%" duration={2} />
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">AQL QC Standard</p>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-gray-900 dark:text-white font-heading">
                    <AnimatedCounter end={48} suffix=" Hrs" duration={1.5} />
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sample Turnaround</p>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Image Card with Floating Badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 aspect-4/3 lg:aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80"
                  alt="Modern Garments Factory Line"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-white/20 dark:border-slate-700/50 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Live Production Floor
                      </p>
                      <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
                        Line #4 • Denim Jacket Assembly
                      </h4>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Stat Badge */}
              <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 flex items-center gap-3 hidden sm:flex">
                <div className="p-2.5 bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-xl">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">ISO 9001 & BSCI</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">100% Export Compliant</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* LIVE MILESTONE NUMERICAL STATS BANNER (Scroll-triggered toggling & fixing) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl border border-emerald-500/20 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            <div className="space-y-1 text-center sm:text-left border-r border-emerald-800/30 last:border-0 pr-4">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-400 font-heading">
                <AnimatedCounter end={120} suffix="+" duration={2} />
              </div>
              <p className="text-xs sm:text-sm font-bold text-gray-300">Global Fashion Brands</p>
              <p className="text-[11px] text-gray-400">Export partners across 35 countries</p>
            </div>

            <div className="space-y-1 text-center sm:text-left border-r border-emerald-800/30 last:border-0 pr-4">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-teal-400 font-heading">
                <AnimatedCounter end={2.5} decimals={1} suffix="M+" duration={2.2} />
              </div>
              <p className="text-xs sm:text-sm font-bold text-gray-300">Garments Exported</p>
              <p className="text-[11px] text-gray-400">Shipped with zero QC rejection</p>
            </div>

            <div className="space-y-1 text-center sm:text-left border-r border-emerald-800/30 last:border-0 pr-4">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-cyan-400 font-heading">
                <AnimatedCounter end={8500} suffix="+" duration={2} />
              </div>
              <p className="text-xs sm:text-sm font-bold text-gray-300">Orders Delivered</p>
              <p className="text-[11px] text-gray-400">Across woven, knit & denim</p>
            </div>

            <div className="space-y-1 text-center sm:text-left pr-4">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-300 font-heading">
                <AnimatedCounter end={99.9} decimals={1} suffix="%" duration={2} />
              </div>
              <p className="text-xs sm:text-sm font-bold text-gray-300">On-Time Dispatch Rate</p>
              <p className="text-[11px] text-gray-400">Air & Sea freight tracked</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR PRODUCTS (6 cards from MongoDB with limit) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Scissors className="w-3.5 h-3.5" /> Featured Catalog
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-950 dark:text-white font-heading">
              Our Export Garment Line
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
              High-durability fabrics, precision stitching, and certified ethical apparel ready for wholesale ordering.
            </p>
          </div>

          <Link
            to="/allproduct"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching products from factory catalog..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-gray-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative aspect-4/3 overflow-hidden bg-gray-100 dark:bg-slate-800">
                    <img
                      src={product.images?.[0] || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80"}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-slate-950/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {product.category}
                    </div>
                    <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-md">
                      ৳{Number(product.price).toLocaleString()} / unit
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-heading">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-slate-800">
                      <span>Stock: <strong className="text-gray-800 dark:text-gray-200">{product.quantity} pcs</strong></span>
                      <span>Min Order: <strong className="text-gray-800 dark:text-gray-200">{product.minOrder} pcs</strong></span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="px-6 pb-6 pt-2">
                  <Link
                    to={`/product/${product._id}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-900 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 3. HOW IT WORKS (Step-by-Step) */}
      <section className="bg-emerald-950/10 dark:bg-slate-900/50 py-20 border-y border-emerald-900/10 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-3.5 py-1 rounded-full">
              Seamless Production Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-950 dark:text-white font-heading">
              How Our Smart Factory Works
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              From sample selection to barcode dispatch, our end-to-end production workflow gives buyers complete transparency at every stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-black text-gray-300 dark:text-slate-700 font-heading">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CUSTOMER FEEDBACK (Carousel) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-3.5 py-1 rounded-full">
            Buyer Trust & Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-950 dark:text-white font-heading">
            Trusted by Global Fashion Brands
          </h2>
        </div>

        <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-gray-200/80 dark:border-slate-800 shadow-xl">
          <div className="flex flex-col items-center text-center space-y-6">
            
            {/* Stars */}
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(reviews[currentReviewIndex].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>

            {/* Comment */}
            <p className="text-base sm:text-xl text-gray-700 dark:text-gray-200 font-medium italic max-w-2xl leading-relaxed">
              "{reviews[currentReviewIndex].comment}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4 pt-2">
              <img
                src={reviews[currentReviewIndex].avatar}
                alt={reviews[currentReviewIndex].name}
                className="w-14 h-14 rounded-full object-cover ring-4 ring-emerald-500/20"
              />
              <div className="text-left">
                <h4 className="text-base font-bold text-gray-900 dark:text-white">
                  {reviews[currentReviewIndex].name}
                </h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  {reviews[currentReviewIndex].company}
                </p>
              </div>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={prevReview}
                aria-label="Previous Testimonial"
                className="p-3 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1.5 px-3">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentReviewIndex(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      currentReviewIndex === i ? 'w-6 bg-emerald-600' : 'w-2 bg-gray-300 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextReview}
                aria-label="Next Testimonial"
                className="p-3 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 5. EXTRA SECTION 1: Factory Production Infrastructure & Capacity Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-full">
                Factory Infrastructure & Scale
              </span>
              
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-heading leading-tight">
                High-Capacity Smart Garments Machinery & Clean Energy
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Our LEED Platinum certified manufacturing facility in Gazipur operates 18 automated sewing lines, computer-assisted Gerber cutting tables, and a closed-loop biological water treatment plant.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="space-y-1">
                  <div className="text-2xl font-black text-emerald-400 font-heading">
                    <AnimatedCounter end={18} suffix="+" duration={1.8} /> Assembly Lines
                  </div>
                  <p className="text-xs text-slate-400">Automated sewing & overlock stitching</p>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black text-teal-400 font-heading">
                    <AnimatedCounter end={100} suffix="%" duration={2} /> Solar Powered
                  </div>
                  <p className="text-xs text-slate-400">Rooftop renewable photovoltaic arrays</p>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black text-cyan-400 font-heading">
                    <AnimatedCounter end={99.4} decimals={1} suffix="%" duration={1.8} /> CAD Efficiency
                  </div>
                  <p className="text-xs text-slate-400">Zero-waste computer pattern optimization</p>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black text-indigo-400 font-heading">
                    <AnimatedCounter end={3} suffix="-Step" duration={1.2} /> QC Gate
                  </div>
                  <p className="text-xs text-slate-400">Needle detection & AQL 2.5 defect audits</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
                  alt="Industrial Garments Assembly"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. EXTRA SECTION 2: Why Choose Us / B2B Advantages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-3.5 py-1 rounded-full">
            Manufacturer Guarantee
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-950 dark:text-white font-heading">
            Why Leading Retailers Partner With Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
              Flexible Low MOQ Tiering
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Launch small batch trial orders starting from 40 units before scaling into mass production runs of 50,000+ pieces.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
              100% Quality & Lab Tested
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              All fabrics undergo dimensional stability, colorfastness, crocking, and pilling resistance testing prior to bulk stitch.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
              Guaranteed On-Time Dispatch
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Real-time milestone alerts and freight forwarder tracking ensure your seasonal launches never miss store deadlines.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}