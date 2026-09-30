import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';
import usePageTitle from '../../Shared/usePageTitle';

export default function Contact() {
  usePageTitle('Contact Factory HQ');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      reset();
      Swal.fire({
        icon: 'success',
        title: 'Message Transmitted',
        text: `Thank you ${data.name}! Our export merchandiser team will respond to ${data.email} within 24 hours.`,
        confirmButtonColor: '#059669'
      });
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide">
          <MessageSquare className="w-3.5 h-3.5" /> B2B Merchandising & Inquiries
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-950 dark:text-white font-heading">
          Get in Touch with Our Production Team
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Have inquiries regarding custom fabric GSMs, bulk volume sampling, or factory audits? Our technical representatives are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
              Factory Operations Headquarters
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3.5 text-gray-600 dark:text-gray-300">
                <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-gray-900 dark:text-white font-bold">Physical Location</strong>
                  <span>Plot 42, Export Processing Zone (DEPZ), Savar, Dhaka, Bangladesh</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-gray-600 dark:text-gray-300">
                <div className="p-2.5 bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-xl shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-gray-900 dark:text-white font-bold">Direct Phone & WhatsApp</strong>
                  <span>+880 2-9876543 / +880 1700-112233</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-gray-600 dark:text-gray-300">
                <div className="p-2.5 bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 rounded-xl shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-gray-900 dark:text-white font-bold">Inquiry Email</strong>
                  <span>export@garmentstracker.com / support@garmentstracker.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-gray-600 dark:text-gray-300">
                <div className="p-2.5 bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-xl shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-gray-900 dark:text-white font-bold">Factory Shift Schedule</strong>
                  <span>Sunday – Thursday: 8:00 AM – 6:00 PM (GMT+6)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-xl space-y-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading">
            Submit Merchandising Query
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Your Full Name *</label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                {errors.name && <p className="text-[11px] text-rose-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Email Address *</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  placeholder="name@brand.com"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                {errors.email && <p className="text-[11px] text-rose-500">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Subject / Category</label>
              <input
                type="text"
                {...register('subject')}
                placeholder="e.g. Custom Denim Jacket 5,000 Pcs Quotation"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Message / Technical Specs *</label>
              <textarea
                rows="4"
                {...register('message', { required: 'Message is required' })}
                placeholder="Provide fabric requirements, target delivery date, target price per unit..."
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              {errors.message && <p className="text-[11px] text-rose-500">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Transmitting...' : 'Send Merchandising Request'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}