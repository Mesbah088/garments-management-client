import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Scissors, Home, ArrowLeft, AlertTriangle } from 'lucide-react';
import usePageTitle from '../../Shared/usePageTitle';

export default function ErrorPage() {
  usePageTitle('404 Page Not Found');

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10 space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block"
        >
          <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-2xl shadow-emerald-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center">
              <Scissors className="w-12 h-12 text-emerald-400 transform -rotate-45 animate-pulse" />
            </div>
          </div>
          <span className="absolute -bottom-2 -right-2 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-full border-2 border-slate-900 shadow-md">
            404
          </span>
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight font-heading">
            Pattern Not Found!
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            The garment cut or production route you are looking for has been moved, unstitched, or does not exist in our factory database.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 transition-all"
          >
            <Home className="w-4 h-4" />
            Return to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}