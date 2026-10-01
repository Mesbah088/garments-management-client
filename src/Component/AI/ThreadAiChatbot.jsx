import React, { useState, useRef, useEffect, useContext } from 'react';
import { useLocation } from 'react-router';
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
  Layers,
  User,
  ShieldCheck,
  ChevronDown,
  Move,
  GripVertical
} from 'lucide-react';
import { AuthContext } from '../../AuthProvider/authProvider';

export default function ThreadAiChatbot() {
  const { user, dbUser } = useContext(AuthContext);
  const location = useLocation();
  const isChatPage = location?.pathname?.includes('/dashboard/chat');

  const [isOpen, setIsOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  
  // Resolve detected user name and role
  const detectedName = customName || user?.displayName || dbUser?.name || (user?.email ? user.email.split('@')[0] : null);
  const userRole = dbUser?.role || 'buyer';
  const userEmail = user?.email || null;

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: user 
        ? `Hello **${detectedName || 'Valued Partner'}**! 👋 I am **ThreadAI**, your smart garments merchandising and production assistant. I see you are logged in as a **${userRole.toUpperCase()}** (${userEmail}). How can I help with your apparel sourcing, orders, or production tracking today?`
        : 'Hello! 👋 I am **ThreadAI**, your smart garments merchandising and production assistant. How can I help with your apparel sourcing, fabric specs, or production tracking today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Update initial message when user logs in/changes
  useEffect(() => {
    if (user && messages.length === 1) {
      setMessages([
        {
          sender: 'ai',
          text: `Hello **${detectedName || 'Valued Partner'}**! 👋 I am **ThreadAI**, your smart garments merchandising and production assistant. I see you are logged in as a **${userRole.toUpperCase()}** (${userEmail}). How can I help with your apparel sourcing, orders, or production tracking today?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [user, dbUser, detectedName]);

  const quickPrompts = [
    "Who am I / My Profile?",
    "What is the MOQ for wholesale denim jackets?",
    "How does production stage tracking work?",
    "Calculate estimated FOB price for 2,000 shirts"
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
    }, 600);
  };

  const generateAiResponse = (q) => {
    const query = q.toLowerCase().trim();

    // 1. User Name & Identity Queries (English + Bengali / Banglish)
    const nameMatchQueries = [
      'amar nam ki', 'amar name ki', 'amr nam ki', 'amar nam', 'amr nam', 
      'what is my name', "what's my name", 'who am i', 'my name', 'tell me my name', 
      'ami k', 'ami ke', 'amake ceno', 'amake cheno', 'amake chino', 'do you know me',
      'who is logged in', 'my role', 'my email', 'my profile', 'my identity', 'who am i?'
    ];

    const isAskingForName = nameMatchQueries.some(nq => query.includes(nq));

    if (isAskingForName) {
      if (detectedName) {
        return `You are **${detectedName}**! 👤\n\n• **Email Address:** ${userEmail || 'N/A'}\n• **System Role:** ${userRole.toUpperCase()}\n• **Account Status:** Active & Verified ✅\n\nHow can I help you today, **${detectedName}**?`;
      } else {
        return "You are currently browsing as a **Guest User** (not logged in). If you [Login](/login), I will instantly recognize your account, orders, and profile! You can also tell me your name by saying *'My name is [Your Name]'* or *'Amar nam [Your Name]'*.";
      }
    }

    // 2. User Introducing Themselves ("my name is...", "amar nam...")
    const myNameIsMatch = query.match(/(?:my name is|amar nam|amr nam|i am|ami)\s+([a-zA-Z0-9_\s]+)/i);
    if (myNameIsMatch && myNameIsMatch[1] && !isAskingForName) {
      const extracted = myNameIsMatch[1].trim().replace(/[?.!]/g, '');
      if (extracted.length > 1 && extracted.toLowerCase() !== 'ki') {
        setCustomName(extracted);
        return `Nice to meet you, **${extracted}**! 🎉 I have saved your name in my memory for this session. How can I assist your garments manufacturing or order tracking today?`;
      }
    }

    // 3. User Asking for Help or What AI can do
    if (query.includes('help') || query.includes('hi') || query.includes('hello') || query.includes('salam') || query.includes('kemon')) {
      const salutation = detectedName ? `Hello **${detectedName}**!` : 'Hello there!';
      return `${salutation} 👋 I can help you with:\n\n1. **Fabric & GSM Specs** (Denim, Organic Cotton, Twill, Fleece)\n2. **MOQ & Wholesale Bulk Quotes**\n3. **Live Production Stage Tracking** (Cutting, Sewing, QC, Dispatch)\n4. **FOB Export Pricing Estimation**\n5. **Factory Certifications** (AQL 2.5, ISO 9001, OEKO-TEX)\n\nWhat would you like to explore?`;
    }

    // 4. MOQ Questions
    if (query.includes('moq') || query.includes('minimum order') || query.includes('minimum quantity')) {
      return `Our minimum order quantity (MOQ) depends on the garment style: \n\n• **Shirts & Polos:** 100 - 120 units\n• **Pants & Chinos:** 60 - 75 units\n• **Heavyweight Jackets & Hoodies:** 40 - 50 units.\n\n${detectedName ? `${detectedName}, you` : 'You'} can customize batch sizes directly on any product page!`;
    }

    // 5. Tracking & Milestones
    if (query.includes('tracking') || query.includes('stage') || query.includes('production flow') || query.includes('track order')) {
      return "GarmentsTracker provides real-time GPS & station telemetry across 6 verified milestones:\n\n1. **Order Placed & CAD Optimization**\n2. **Laser Cutting Completed**\n3. **Automated Sewing Assembly**\n4. **Finishing & AQL 2.5 Inspection**\n5. **Export Polybag Packing**\n6. **Live Carrier Dispatch**\n\nBuyers can track active orders live from their Dashboard!";
    }

    // 6. Pricing & Estimates
    if (query.includes('price') || query.includes('cost') || query.includes('fob') || query.includes('estimate') || query.includes('calculator')) {
      return "FOB wholesale pricing structure includes: \n\n• **Fabric & Yarn (50-60%)**: GOTS organic cotton / ring-spun denim\n• **Cutting & Stitching CM (20-25%)**\n• **Washing & Trims (10%)**: YKK zippers, shank buttons\n• **Quality Control & Export Packing (10%)**\n\nTry our new **AI Garment Estimator** tool in the top navigation for real-time live cost projections!";
    }

    // 7. Quality Standards & Compliance
    if (query.includes('aql') || query.includes('quality') || query.includes('iso') || query.includes('certificate')) {
      return "All export batches adhere to **AQL 2.5 (Acceptable Quality Level)** standards. Our factory is **ISO 9001:2015, BSCI Grade A, and OEKO-TEX Standard 100** certified, guaranteeing non-toxic dyes and fair trade ethical labor.";
    }

    // 8. Lead Time & Sampling
    if (query.includes('sample') || query.includes('lead time') || query.includes('delivery time') || query.includes('time')) {
      return "Standard production lead time is **7 to 14 business days** after manager CAD approval. Digital proto-samples and physical sample swatches are prepared within **48 hours**.";
    }

    return `Thank you for your query, ${detectedName ? `**${detectedName}**` : 'friend'}! Our smart system is equipped for automated laser pattern cutting, high-ply sewing lines, and bulk wholesale logistics. You can explore our catalog or test the AI Estimator in the menu for instant quotes!`;
  };

  return (
    <div className={`fixed transition-all duration-300 ${isChatPage ? 'bottom-28 right-4 sm:right-6 z-30' : 'bottom-6 right-4 sm:right-6 z-50'}`}>
      
      {/* 🚀 MOVABLE / DRAGGABLE FLOATING TRIGGER BUTTON */}
      {!isOpen && (
        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0.1}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
          className="cursor-grab active:cursor-grabbing select-none"
        >
          <div
            onClick={() => setIsOpen(true)}
            className="relative group h-13 sm:h-14 pl-3 pr-4 rounded-full bg-slate-950/90 dark:bg-slate-900/90 backdrop-blur-xl text-white shadow-2xl shadow-emerald-950/50 flex items-center gap-2.5 border border-emerald-500/30 hover:border-emerald-400 transition-colors ring-4 ring-emerald-500/10 hover:ring-emerald-500/20"
            title="Click to Open, or Drag to Reposition Anywhere!"
          >
            {/* Drag Handle Indicator */}
            <div className="text-gray-400 group-hover:text-emerald-400 transition-colors -mr-1 hidden sm:block">
              <GripVertical className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
            </div>

            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/30 shrink-0">
              <Bot className="w-4.5 h-4.5 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full border border-slate-900" />
            </div>

            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs tracking-wide text-white font-heading">
                  ThreadAI
                </span>
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Movable
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight truncate max-w-[110px]">
                {detectedName ? detectedName.split(' ')[0] : 'Drag or Click'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 🚀 MOVABLE / DRAGGABLE CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0.05}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[94vw] sm:w-[420px] h-[560px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Draggable Chat Header */}
            <div className="p-3.5 bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 text-white flex flex-col border-b border-slate-800 cursor-grab active:cursor-grabbing select-none">
              
              {/* Subtle Drag Pill */}
              <div className="w-12 h-1 bg-white/20 hover:bg-white/40 rounded-full mx-auto mb-2 transition-colors" title="Drag to move window" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black font-heading flex items-center gap-1.5 text-white">
                      ThreadAI <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/30 text-emerald-300 rounded-md">Movable AI</span>
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {detectedName ? `Assisting ${detectedName} (${userRole})` : 'Drag header to move anywhere'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg border border-white/5" title="Drag header to move">
                    <Move className="w-3 h-3 text-emerald-400" />
                    <span className="hidden sm:inline">Drag</span>
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Close ThreadAI"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50 dark:bg-slate-950/40 text-xs cursor-default">
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
            <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5 cursor-default">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-gray-700 dark:text-gray-300 hover:text-emerald-600 text-[11px] font-semibold shrink-0 transition-colors border border-gray-200/50 dark:border-slate-700 cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 flex items-center gap-2 cursor-default">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={detectedName ? `Ask ThreadAI anything, ${detectedName.split(' ')[0]}...` : "Ask ThreadAI about fabrics, MOQ, tracking..."}
                className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
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

