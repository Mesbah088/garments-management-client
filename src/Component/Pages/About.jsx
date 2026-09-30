import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Award, Factory, Users, Globe2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import usePageTitle from '../../Shared/usePageTitle';

export default function About() {
  usePageTitle('About Us | Factory Heritage & Capacity');

  const stats = [
    { label: 'Established', value: '2014' },
    { label: 'Floor Space', value: '120,000 sq ft' },
    { label: 'Export Destinations', value: '35+ Countries' },
    { label: 'Skilled Artisans', value: '1,400+ Staff' },
  ];

  return (
    <div className="space-y-20 py-12">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide">
          <Factory className="w-3.5 h-3.5" /> Established Apparel Manufacturing Excellence
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-950 dark:text-white font-heading">
          Engineering the Future of <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Sustainable Garment Manufacturing
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base max-w-2xl mx-auto">
          We combine cutting-edge German CAD cutting technology, ethical human craftsmanship, and end-to-end digital tracking to manufacture export-grade apparel for global brands.
        </p>
      </section>

      {/* Stats Counter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
          {stats.map((st, i) => (
            <div key={i} className="text-center space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-heading">
                {st.value}
              </span>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{st.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story & Facility Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white font-heading">
              Ethical Production with Zero Tolerance for Quality Deviations
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
              Founded in Savar DEPZ, our plant is built on two core principles: human dignity and uncompromising stitch precision. Every batch is produced under certified Fair Trade conditions, equipped with ergonomic workstations and medical facilities.
            </p>
            <ul className="space-y-3">
              {[
                'Automated Gerber Fabric Spreading & High-Ply Laser Cutting',
                'OEKO-TEX Standard 100 Non-Toxic Dyes & Organic Cottons',
                'In-house Physical & Chemical Textile Testing Laboratory',
                'Real-Time RFID Production Stage Monitoring for Global Buyers'
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-slate-800 aspect-4/3">
            <img
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"
              alt="Quality Inspection Lab"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Certifications Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-emerald-950/10 dark:bg-slate-900 border border-emerald-900/20 dark:border-slate-800 text-center space-y-6">
          <h3 className="text-xl font-bold font-heading">International Compliance Accreditations</h3>
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-600 dark:text-gray-300 font-bold text-sm">
            <span className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">ISO 9001:2015</span>
            <span className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">BSCI Audit Grade A</span>
            <span className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">GOTS Organic Certified</span>
            <span className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">OEKO-TEX Standard 100</span>
            <span className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">WRAP Gold Certificate</span>
          </div>
        </div>
      </section>
    </div>
  );
}