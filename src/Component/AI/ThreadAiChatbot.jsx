import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  Scissors, 
  MessageSquare, 
  HelpCircle, 
  Minimize2, 
  Maximize2,
  ChevronRight,
  TrendingUp,
  Layers
} from 'lucide-react';

export default function ThreadAiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am **ThreadAI**, your smart garments merchandising and production assistant. How can I help with your apparel sourcing, fabric specs, or tracking today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const quickPrompts = [
    "What is the MOQ for wholesale denim jackets?",
    "How does production stage tracking work?",
    "Calculate estimated FOB price for 2,000 shirts",
    "What quality standards (AQL 2.5) are used?"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend = null) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // AI Knowledge Engine & Reasoning
    setTimeout(() => {
      const reply = generateAiResponse(query);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 700);
  };

  const generateAiResponse = (q) => {
    const query = q.toLowerCase();

    if (query.includes('moq') || query.includes('minimum order')) {
      return "Our minimum order quantity (MOQ) depends on the garment style: \n\n• **Shirts & Polos:** 100 - 120 units\n• **Pants & Chinos:** 60 - 75 units\n• **Heavyweight Jackets & Hoodies:** 40 - 50 units.\n\nYou can customize batch sizes directly on any product page!";
    }

    if (query.includes('tracking') || query.includes('stage') || query.includes('production flow')) {
      return "GarmentsTracker provides real-time GPS & station telemetry across 6 verified milestones:\n\n1. **Order Placed & CAD Optimization**\n2. **Laser Cutting Completed**\n3. **Automated Sewing Assembly**\n4. **Finishing & AQL 2.5 Inspection**\n5. **Export Polybag Packing**\n6. **Live Carrier Dispatch**\n\nBuyers can track active orders live from their Dashboard!";
    }

    if (query.includes('price') || query.includes('cost') || query.includes('fob') || query.includes('estimate')) {
      return "FOB wholesale pricing includes: \n\n• **Fabric & Yarn (50-60%)**: GOTS organic cotton / ring-spun denim\n• **Cutting & Stitching CM (20-25%)**\n• **Washing & Trims (10%)**: YKK zippers, shank buttons\n• **Quality Control & Export Packing (10%)**\n\nTry our new **AI Garment Estimator** tool in the top navigation for real-time live cost projections!";
    }

    if (query.includes('aql') || query.includes('quality') || query.includes('iso') || query.includes('certificate')) {
      return "All export batches adhere to **AQL 2.5 (Acceptable Quality Level)** standards. Our factory is **ISO 9001:2015, BSCI Grade A, and OEKO-TEX Standard 100** certified, guaranteeing non-toxic dyes and fair trade ethical labor.";
    }

    if (query.includes('sample') || query.includes('lead time') || query.includes('time')) {
      return "Standard production lead time is **7 to 14 business days** after manager CAD approval. Digital proto-samples and physical sample swatches are prepared within **48 hours**.";
    }

    return `Thank you for your query about "${q}". Our smart system is equipped for automated laser pattern cutting, high-ply sewing lines, and bulk wholesale logistics. You can explore our catalog or test the AI Estimator in the menu for instant quotes!`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Trigger Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-2xl shadow-emerald-600/40 flex items-center gap-2.5 border border-white/20"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full" />
          </div>
          <span className="font-bold text-sm tracking-wide hidden sm:inline font-heading">
            ThreadAI Assistant
          </span>
          <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded-full bg-white/20 text-white">
            AI 2.0
          </span>
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[92vw] sm:w-[420px] h-[560px] bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Chat Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-black font-heading flex items-center gap-1.5 text-white">
                    ThreadAI <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/30 text-emerald-300 rounded-md">Online</span>
                  </h4>
                  <p className="text-[10px] text-slate-400">Garments Merchandising & Spec Engine</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50 dark:bg-slate-950/40 text-xs">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-xs shadow-sm font-medium'
                        : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-bl-xs border border-gray-200/80 dark:border-slate-700 shadow-2xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-gray-400 bg-white dark:bg-slate-800 p-3 rounded-2xl max-w-[120px] border border-gray-200 dark:border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-gray-700 dark:text-gray-300 hover:text-emerald-600 text-[11px] font-semibold shrink-0 transition-colors border border-gray-200/50 dark:border-slate-700"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask ThreadAI about fabrics, MOQ, tracking..."
                className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
