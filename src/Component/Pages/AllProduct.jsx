import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, ArrowRight, Sparkles, Package } from 'lucide-react';
import api from '../../api/api';
import usePageTitle from '../../Shared/usePageTitle';
import LoadingSpinner from '../../Shared/LoadingSpinner';

export default function AllProduct() {
  usePageTitle('All Products Catalog');
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const categories = ['All', 'Shirt', 'Pant', 'Jacket', 'Accessories'];

  // Fetch products with search, filter, sort, pagination
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.set('search', search);
        if (category && category !== 'All') queryParams.set('category', category);
        if (sort) queryParams.set('sort', sort);
        queryParams.set('page', page);
        queryParams.set('limit', 6);

        const res = await api.get(`/products?${queryParams.toString()}`);
        if (res.data?.products) {
          setProducts(res.data.products);
          setTotalPages(res.data.totalPages || 1);
          setTotalCount(res.data.total || res.data.products.length);
        } else if (Array.isArray(res.data)) {
          setProducts(res.data);
          setTotalPages(Math.ceil(res.data.length / 6) || 1);
          setTotalCount(res.data.length);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category, sort, page]);

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setPage(1);
    setSearchParams({ category: cat });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" /> Export Ready Collections
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-950 dark:text-white font-heading">
          All Garments & Apparel Catalog
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Browse certified production lines with guaranteed MOQ thresholds, live stock availability, and customizable private labeling.
        </p>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by garment title, fabric, category..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-6 flex items-center justify-end gap-3">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort By:
            </span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="newest">Newest Arrival</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
          <span className="text-xs font-bold text-gray-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                category.toLowerCase() === cat.toLowerCase()
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid (3-column layout) */}
      {loading ? (
        <LoadingSpinner text="Loading apparel inventory..." />
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-8 space-y-4">
          <Package className="w-16 h-16 text-gray-400 mx-auto" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 font-heading">
            No products found matching your search
          </h3>
          <p className="text-sm text-gray-500">
            Try adjusting your search query or selecting a different category filter.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setPage(1);
            }}
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
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
                    ${Number(product.price).toFixed(2)} / unit
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-3">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-heading">
                    {product.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="pt-3 grid grid-cols-2 gap-2 text-xs border-t border-gray-100 dark:border-slate-800 text-gray-600 dark:text-gray-400">
                    <div className="bg-gray-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                      <span className="block text-gray-400 text-[10px] uppercase font-bold">Available Stock</span>
                      <strong className="text-sm text-gray-900 dark:text-white font-bold">{product.quantity} pcs</strong>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                      <span className="block text-gray-400 text-[10px] uppercase font-bold">Minimum Order (MOQ)</span>
                      <strong className="text-sm text-gray-900 dark:text-white font-bold">{product.minOrder} pcs</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Details Button */}
              <div className="px-6 pb-6 pt-2">
                <Link
                  to={`/product/${product._id}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-900 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                  page === pageNum
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-800"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

    </div>
  );
}