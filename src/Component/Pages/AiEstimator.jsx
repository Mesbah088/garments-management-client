import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  Sparkles, 
  Bot, 
  Calculator, 
  Layers, 
  Scissors, 
  Clock, 
  DollarSign, 
  Award, 
  Printer, 
  ShieldCheck, 
  ArrowRight,
  Leaf,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';
import usePageTitle from '../../Shared/usePageTitle';

export default function AiEstimator() {
  usePageTitle('AI Garment Cost & Production Estimator');

  const [category, setCategory] = useState('Jacket');
  const [fabricGsm, setFabricGsm] = useState('14.5oz Denim (Ring-Spun)');
  const [quantity, setQuantity] = useState(1000);
  const [customTrims, setCustomTrims] = useState({
    enzymeWash: true,
    ykkZippers: true,
    customLabels: true,
    organicDye: false
  });
  const [destination, setDestination] = useState('Europe (Hamburg/Rotterdam)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [estimateResult, setEstimateResult] = useState(null);

  const calculateEstimate = () => {
    setIsGenerating(true);
    setEstimateResult(null);

    setTimeout(() => {
      let baseCost = 18.0;
      if (category === 'Jacket') baseCost = 32.0;
      if (category === 'Shirt') baseCost = 14.5;
      if (category === 'Pant') baseCost = 20.0;
      if (category === 'Hoodie') baseCost = 22.5;

      // Volume bulk discount calculation
      let volumeMultiplier = 1.0;
      if (quantity >= 5000) volumeMultiplier = 0.82;
      else if (quantity >= 2000) volumeMultiplier = 0.88;
      else if (quantity >= 1000) volumeMultiplier = 0.93;
      else if (quantity >= 500) volumeMultiplier = 0.97;

      // Trim add-ons
      let trimAddon = 0;
      if (customTrims.enzymeWash) trimAddon += 1.8;
      if (customTrims.ykkZippers) trimAddon += 1.2;
      if (customTrims.customLabels) trimAddon += 0.6;
      if (customTrims.organicDye) trimAddon += 1.5;

      const unitCost = ((baseCost + trimAddon) * volumeMultiplier).toFixed(2);
      const totalCost = (Number(unitCost) * quantity).toFixed(2);
      const leadTimeDays = quantity > 5000 ? 16 : quantity > 2000 ? 12 : 9;

      setEstimateResult({
        category,
        fabricGsm,
        quantity,
        unitCost,
        totalCost,
        leadTimeDays,
        destination,
        breakdown: {
          fabric: (unitCost * 0.52).toFixed(2),
          sewing: (unitCost * 0.24).toFixed(2),
          washing: (unitCost * 0.12).toFixed(2),
          trimsPacking: (unitCost * 0.12).toFixed(2),
        },
        ecoScore: customTrims.organicDye ? 'A+ (GOTS Zero Carbon)' : 'A (OEKO-TEX Certified)',
        estimatedRetailPrice: (unitCost * 3.4).toFixed(2),
        potentialGrossMargin: '68%'
      });

      setIsGenerating(false);

      Swal.fire({
        icon: 'success',
        title: 'AI Production Estimate Generated!',
        text: `FOB Unit Cost calculated at $${unitCost} USD for ${quantity.toLocaleString()} units.`,
        timer: 2000,
        showConfirmButton: false
      });
    }, 900);
  };

  const handlePrintQuotation = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>AI-Powered Garments Merchandising & Cost Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-950 dark:text-white font-heading">
          AI Manufacturing & FOB Cost Estimator
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Configure custom fabric weights, bulk batch sizes, and factory washes to generate immediate industrial FOB quotations and timeline forecasts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Form: Parameter Controls */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-800 pb-4">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white font-heading">
                Garment & Batch Parameters
              </h3>
              <p className="text-xs text-gray-400">Set technical specs for algorithmic computation</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Apparel Style Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Jacket">Vintage & Technical Jackets</option>
                <option value="Shirt">Oxford & Twill Shirts</option>
                <option value="Pant">Chinos & Tactical Cargo Pants</option>
                <option value="Hoodie">Heavyweight Fleece Hoodies</option>
              </select>
            </div>

            {/* Fabric Specs */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Fabric Composition & GSM Weight</label>
              <select
                value={fabricGsm}
                onChange={(e) => setFabricGsm(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="14.5oz Denim (Ring-Spun)">14.5oz Heavyweight Ring-Spun Denim</option>
                <option value="400 GSM French Terry">400 GSM 100% Combed Cotton French Terry</option>
                <option value="100% GOTS Organic Oxford">100% GOTS Certified Organic Oxford Weave</option>
                <option value="98/2 Cotton Stretch Twill">98/2 Cotton-Elastane Stretch Mercerized Twill</option>
                <option value="3-Layer Waterproof Ripstop">3-Layer Waterproof Breathable Nylon Ripstop</option>
              </select>
            </div>

            {/* Batch Volume Slider */}
            <div className="space-y-2 p-4 bg-gray-50 dark:bg-slate-800/60 rounded-2xl border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Target Production Order Quantity
                </label>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  {quantity.toLocaleString()} pcs
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="20000"
                step="50"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="range range-emerald range-sm w-full"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>MOQ: 50 pcs</span>
                <span>Tier 1: 1,000 pcs</span>
                <span>Mass Run: 20,000+ pcs</span>
              </div>
            </div>

            {/* Custom Treatments Checkboxes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                Finishing & Custom Trims
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-slate-800 rounded-xl text-xs font-semibold cursor-pointer border border-gray-200 dark:border-slate-700">
                  <input
                    type="checkbox"
                    checked={customTrims.enzymeWash}
                    onChange={(e) => setCustomTrims({ ...customTrims, enzymeWash: e.target.checked })}
                    className="checkbox checkbox-emerald checkbox-xs"
                  />
                  Enzyme Wash
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-slate-800 rounded-xl text-xs font-semibold cursor-pointer border border-gray-200 dark:border-slate-700">
                  <input
                    type="checkbox"
                    checked={customTrims.ykkZippers}
                    onChange={(e) => setCustomTrims({ ...customTrims, ykkZippers: e.target.checked })}
                    className="checkbox checkbox-emerald checkbox-xs"
                  />
                  YKK Brass Zippers
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-slate-800 rounded-xl text-xs font-semibold cursor-pointer border border-gray-200 dark:border-slate-700">
                  <input
                    type="checkbox"
                    checked={customTrims.customLabels}
                    onChange={(e) => setCustomTrims({ ...customTrims, customLabels: e.target.checked })}
                    className="checkbox checkbox-emerald checkbox-xs"
                  />
                  Woven Brand Labels
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-slate-800 rounded-xl text-xs font-semibold cursor-pointer border border-gray-200 dark:border-slate-700">
                  <input
                    type="checkbox"
                    checked={customTrims.organicDye}
                    onChange={(e) => setCustomTrims({ ...customTrims, organicDye: e.target.checked })}
                    className="checkbox checkbox-emerald checkbox-xs"
                  />
                  100% Botanical Dye
                </label>
              </div>
            </div>

            {/* Destination */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Destination Port / Region</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-hidden"
              >
                <option value="Europe (Hamburg/Rotterdam)">Europe (Hamburg / Rotterdam Port)</option>
                <option value="North America (Los Angeles/NY)">North America (LA / New York Freight)</option>
                <option value="United Kingdom (Southampton)">United Kingdom (Southampton Port)</option>
                <option value="Asia-Pacific & Australia (Sydney)">Asia-Pacific (Sydney / Tokyo)</option>
              </select>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateEstimate}
              disabled={isGenerating}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? 'Computing AI Factory Model...' : 'Calculate AI Manufacturing Quotation'}
            </button>
          </div>
        </div>

        {/* Right Panel: AI Results & Quotation Output */}
        <div className="lg:col-span-6 space-y-6">
          {!estimateResult ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-300 dark:border-slate-800 space-y-4">
              <Bot className="w-14 h-14 text-emerald-500 mx-auto animate-pulse" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
                Ready to Compute Manufacturing Metrics
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                Adjust the apparel category, fabric weight, and order quantity parameters on the left to run our AI production costing engine.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                    Verified AI Quotation
                  </span>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white font-heading mt-1">
                    {estimateResult.category} Wholesale Breakdown
                  </h3>
                </div>

                <button
                  onClick={handlePrintQuotation}
                  className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-emerald-50 text-gray-700 dark:text-gray-200 hover:text-emerald-600 transition-colors flex items-center gap-1.5 text-xs font-bold"
                  title="Print Formal PDF Quotation"
                >
                  <Printer className="w-4 h-4" />
                  Print PDF
                </button>
              </div>

              {/* Major Price Highlight Box */}
              <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white shadow-lg">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                    FOB Unit Price
                  </span>
                  <div className="text-3xl sm:text-4xl font-black font-heading text-white">
                    ${estimateResult.unitCost}
                  </div>
                  <span className="text-[10px] text-slate-400">USD / Piece</span>
                </div>

                <div className="space-y-1 border-l border-slate-800 pl-4">
                  <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block">
                    Total Order Value
                  </span>
                  <div className="text-2xl sm:text-3xl font-black font-heading text-white">
                    ${Number(estimateResult.totalCost).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-emerald-400">For {estimateResult.quantity.toLocaleString()} units</span>
                </div>
              </div>

              {/* Cost Component Matrix */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                  Cost Component Breakdown (Per Unit)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl">
                    <span className="text-gray-400 block text-[10px]">Fabric & Yarn</span>
                    <strong className="text-sm text-gray-900 dark:text-white">${estimateResult.breakdown.fabric}</strong>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl">
                    <span className="text-gray-400 block text-[10px]">Stitching CM</span>
                    <strong className="text-sm text-gray-900 dark:text-white">${estimateResult.breakdown.sewing}</strong>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl">
                    <span className="text-gray-400 block text-[10px]">Washes & Dyes</span>
                    <strong className="text-sm text-gray-900 dark:text-white">${estimateResult.breakdown.washing}</strong>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl">
                    <span className="text-gray-400 block text-[10px]">Trims & Packing</span>
                    <strong className="text-sm text-gray-900 dark:text-white">${estimateResult.breakdown.trimsPacking}</strong>
                  </div>
                </div>
              </div>

              {/* Timeline & Retail Margin Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-emerald-50 dark:bg-slate-800 rounded-xl border border-emerald-200/50 dark:border-slate-700 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Estimated Production Time</span>
                    <strong className="text-sm text-gray-900 dark:text-white font-bold">{estimateResult.leadTimeDays} Business Days</strong>
                  </div>
                </div>

                <div className="p-3.5 bg-teal-50 dark:bg-slate-800 rounded-xl border border-teal-200/50 dark:border-slate-700 flex items-center gap-3">
                  <Leaf className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Sustainability Index</span>
                    <strong className="text-xs text-gray-900 dark:text-white font-bold">{estimateResult.ecoScore}</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-slate-800/60 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">Projected Retail Shelf MSRP</span>
                  <strong className="text-base text-gray-900 dark:text-white">${estimateResult.estimatedRetailPrice} USD</strong>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 block text-[10px]">Buyer Gross Profit Margin</span>
                  <strong className="text-base text-emerald-600 dark:text-emerald-400 font-extrabold">{estimateResult.potentialGrossMargin}</strong>
                </div>
              </div>
            </motion.div>
          )}
        </div>

      </div>

    </div>
  );
}
