import React from 'react';
import { Link } from 'react-router';
import { Scissors, Mail, Phone, MapPin, ShieldCheck, Award, Factory, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Banner Section */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <Factory className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base">Smart Garment Tracking</h4>
                <p className="text-xs text-slate-400">Live production stages from Cutting to Dispatch</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base">Certified Global Quality</h4>
                <p className="text-xs text-slate-400">ISO 9001, OEKO-TEX Standard & BSCI compliant</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base">Secure B2B Order Flow</h4>
                <p className="text-xs text-slate-400">Encrypted payment & verified manager authorizations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Scissors className="w-5 h-5 text-white transform -rotate-45" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-heading">
                Garments<span className="text-emerald-400">Tracker</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed pr-6">
              Empowering apparel manufacturers, global buyers, and factory supervisors with an all-in-one digital order management, inventory monitoring, and automated production timeline system.
            </p>
            
            {/* Social Icons with official NEW X logo (not old bird) */}
            <div className="flex items-center gap-3 pt-2">
              {/* New X (Twitter) Logo */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow us on X"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Connect on LinkedIn"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook Page"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-heading">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Home Landing
                </Link>
              </li>
              <li>
                <Link to="/allproduct" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  All Garments Catalog
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  About Factory & Heritage
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Buyer & Manager Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Garments Categories */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-heading">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/allproduct?category=Shirt" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Oxford & Dress Shirts
                </Link>
              </li>
              <li>
                <Link to="/allproduct?category=Pant" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Chinos & Cargo Pants
                </Link>
              </li>
              <li>
                <Link to="/allproduct?category=Jacket" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Denim & Windbreakers
                </Link>
              </li>
              <li>
                <Link to="/allproduct?category=Accessories" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Heavy Hoodies & Fleece
                </Link>
              </li>
              <li>
                <Link to="/allproduct" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Custom OEM Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-heading">
              Factory HQ
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span>Plot 42, Export Processing Zone (DEPZ), Savar, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+880 2-9876543 / +880 1700-112233</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@garmentstracker.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-800 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} GarmentsTracker System. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Compliance & Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}