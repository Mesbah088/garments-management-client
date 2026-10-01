import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSearchParams, Link } from 'react-router';
import { AuthContext } from '../../../AuthProvider/authProvider';
import {
  MessageSquare,
  Send,
  Search,
  CheckCheck,
  Phone,
  Package,
  Shield,
  Briefcase,
  User,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import Swal from 'sweetalert2';

import { getApiBaseUrl } from '../../../api/api';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true
});

const API_BASE = getApiBaseUrl();

export default function ChatHub() {
  const { user, dbUser } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const targetEmail = searchParams.get('email');
  const targetOrderId = searchParams.get('orderId');

  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [linkedOrderId, setLinkedOrderId] = useState(targetOrderId || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  const currentEmail = user?.email || dbUser?.email || '';
  const currentRole = dbUser?.role || 'buyer';
  const currentName = user?.displayName || dbUser?.name || currentEmail.split('@')[0];
  const currentPhoto = user?.photoURL || dbUser?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80";

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load Contacts
  const fetchContacts = async (selectTarget = false) => {
    if (!currentEmail) return;
    try {
      const res = await fetch(`${API_BASE}/chat/contacts?email=${encodeURIComponent(currentEmail)}&role=${currentRole}`);
      if (!res.ok) throw new Error('Failed to fetch contacts');
      const data = await res.json();
      setContacts(data);

      // Auto-select contact if requested by query param or default to first contact
      if (selectTarget && targetEmail) {
        const found = data.find(c => c.email.toLowerCase() === targetEmail.toLowerCase());
        if (found) {
          setActiveContact(found);
        } else if (data.length > 0 && !activeContact) {
          setActiveContact(data[0]);
        }
      } else if (!activeContact && data.length > 0) {
        if (targetEmail) {
          const found = data.find(c => c.email.toLowerCase() === targetEmail.toLowerCase());
          setActiveContact(found || data[0]);
        } else {
          setActiveContact(data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
    } finally {
      setLoadingContacts(false);
    }
  };

  useEffect(() => {
    fetchContacts(true);
  }, [currentEmail, currentRole, targetEmail]);

  // Load Messages for Active Contact
  const fetchMessages = async (silent = false) => {
    if (!currentEmail || !activeContact?.email) return;
    if (!silent) setLoadingMessages(true);
    try {
      const res = await fetch(`${API_BASE}/messages?user1=${encodeURIComponent(currentEmail)}&user2=${encodeURIComponent(activeContact.email)}`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);

      // Mark messages as read
      await fetch(`${API_BASE}/messages/mark-read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: currentEmail, senderEmail: activeContact.email })
      });

      // Silently refresh contacts unread count
      fetchContacts(false);
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (activeContact) {
      fetchMessages(false);
    }
  }, [activeContact]);

  // Real-time Polling every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeContact) {
        fetchMessages(true);
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [activeContact, currentEmail]);

  // Send Message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeContact || sending) return;

    const messagePayload = {
      senderEmail: currentEmail,
      senderName: currentName,
      senderRole: currentRole,
      senderPhoto: currentPhoto,
      receiverEmail: activeContact.email,
      receiverName: activeContact.name,
      receiverRole: activeContact.role,
      receiverPhoto: activeContact.photoURL,
      text: inputText.trim(),
      orderId: linkedOrderId.trim()
    };

    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messagePayload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to send');
      }

      const createdMsg = await res.json();
      setMessages(prev => [...prev, createdMsg]);
      setInputText('');
      setLinkedOrderId('');
      fetchContacts(false);
    } catch (err) {
      Toast.fire({ icon: 'error', title: err.message || 'Could not send message' });
    } finally {
      setSending(false);
    }
  };

  // Quick Prompt suggestion click
  const handleQuickPrompt = (promptText) => {
    setInputText(promptText);
  };

  // Filter contacts by search & role
  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || c.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Role Badge Helper
  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <Shield className="w-2.5 h-2.5" /> Admin
          </span>
        );
      case 'manager':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Briefcase className="w-2.5 h-2.5" /> Floor Manager
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <User className="w-2.5 h-2.5" /> Wholesale Buyer
          </span>
        );
    }
  };

  // Role quick prompts
  const quickPrompts = {
    buyer: [
      "What is the current cutting status of my order?",
      "Can you provide the estimated packing & dispatch date?",
      "Please share fabric GSM & yarn test certification.",
      "Can we request an updated batch sample photo?"
    ],
    manager: [
      "Cutting completed on Floor B. Sewing assembly has commenced.",
      "Quality control inspection passed with zero defect rate.",
      "Order packed in export cartons. Awaiting freight pickup.",
      "Please confirm the finalized delivery contact & warehouse address."
    ],
    admin: [
      "Factory audit is scheduled for this week. Please review line quotas.",
      "Monthly production performance review meeting tomorrow at 10 AM.",
      "Buyer wholesale account approved with high-priority status."
    ]
  };

  const userQuickPrompts = quickPrompts[currentRole] || quickPrompts.buyer;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-1">
            <MessageSquare className="w-3.5 h-3.5" /> Live In-App Factory Chat & Knock Suite
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-heading">
            Direct Messaging & Floor Communication
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            {currentRole === 'admin' && 'Admin Hub: Direct communication channel with all Production Managers and Wholesale Buyers.'}
            {currentRole === 'manager' && 'Floor Manager Desk: Direct chat with Wholesale Buyers for order specifications and with System Admin.'}
            {currentRole === 'buyer' && 'Wholesale Buyer Desk: Directly knock your assigned Production Manager for instant live floor updates.'}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => {
              fetchContacts(false);
              if (activeContact) fetchMessages(false);
              Toast.fire({ icon: 'success', title: 'Chat refreshed' });
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Main Chat Frame */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] max-h-[820px]">
        
        {/* LEFT COLUMN: CONTACT DIRECTORY (4 Cols) */}
        <div className="lg:col-span-4 border-r border-gray-100 dark:border-slate-800 flex flex-col bg-gray-50/50 dark:bg-slate-900/50">
          
          {/* Search & Filters */}
          <div className="p-4 border-b border-gray-100 dark:border-slate-800 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search managers & buyers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            {/* Role Filter Tabs for Admin / Manager */}
            {currentRole !== 'buyer' && (
              <div className="flex gap-1 p-1 rounded-xl bg-gray-200/60 dark:bg-slate-800 text-[11px] font-bold">
                <button
                  onClick={() => setRoleFilter('all')}
                  className={`flex-1 py-1 rounded-lg transition-all ${
                    roleFilter === 'all'
                      ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-xs'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  All ({contacts.length})
                </button>
                <button
                  onClick={() => setRoleFilter('manager')}
                  className={`flex-1 py-1 rounded-lg transition-all ${
                    roleFilter === 'manager'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Managers
                </button>
                <button
                  onClick={() => setRoleFilter('buyer')}
                  className={`flex-1 py-1 rounded-lg transition-all ${
                    roleFilter === 'buyer'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Buyers
                </button>
              </div>
            )}

            {currentRole === 'buyer' && (
              <div className="px-1 text-[11px] font-bold text-gray-500 dark:text-gray-400 flex items-center justify-between">
                <span>Direct Production Contacts</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black">Authorized</span>
              </div>
            )}
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800/60">
            {loadingContacts ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-gray-400">Loading contacts...</p>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                No contacts matching filter.
              </div>
            ) : (
              filteredContacts.map((contact) => {
                const isSelected = activeContact?.email?.toLowerCase() === contact.email?.toLowerCase();
                return (
                  <button
                    key={contact._id || contact.email}
                    onClick={() => {
                      setActiveContact(contact);
                      setSearchParams({ email: contact.email, ...(linkedOrderId ? { orderId: linkedOrderId } : {}) });
                    }}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                      isSelected
                        ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-l-4 border-emerald-500'
                        : 'hover:bg-gray-100/70 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={contact.photoURL}
                        alt={contact.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-slate-700"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                          {contact.name}
                        </h4>
                        {contact.lastMessage?.createdAt && (
                          <span className="text-[10px] text-gray-400 shrink-0">
                            {new Date(contact.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-1">
                        <div className="truncate text-[11px] text-gray-500 dark:text-gray-400">
                          {contact.lastMessage?.text || contact.email}
                        </div>
                        {contact.unreadCount > 0 && (
                          <span className="shrink-0 px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold animate-pulse">
                            {contact.unreadCount}
                          </span>
                        )}
                      </div>

                      <div className="mt-1.5 flex items-center gap-1.5">
                        {getRoleBadge(contact.role)}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE CHAT ROOM (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col bg-white dark:bg-slate-900">
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-white dark:bg-slate-900 sticky top-0 z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={activeContact.photoURL}
                      alt={activeContact.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/50"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {activeContact.name}
                      </h3>
                      {getRoleBadge(activeContact.role)}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                      {activeContact.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* WhatsApp Quick Knock Fallback */}
                  <a
                    href={`https://wa.me/8801700000000?text=${encodeURIComponent(
                      `Hello ${activeContact.name}, I am messaging from Garments Tracker System.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp Direct
                  </a>
                </div>
              </div>

              {/* Order Reference Tag Bar (if attached) */}
              {linkedOrderId && (
                <div className="px-4 py-2 bg-indigo-50/80 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-medium">
                    <Package className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Attached Order Context: <strong className="font-mono">{linkedOrderId}</strong></span>
                  </div>
                  <button
                    onClick={() => setLinkedOrderId('')}
                    className="text-[11px] text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold"
                  >
                    Detach
                  </button>
                </div>
              )}

              {/* Message Feed Stream */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gray-50/40 dark:bg-slate-950/40 min-h-[360px] max-h-[480px]">
                {loadingMessages ? (
                  <div className="p-8 text-center space-y-2">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-gray-400">Loading conversation history...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">Start your conversation</h4>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto">
                        Send a message or select one of the quick suggestions below to knock {activeContact.name}.
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderEmail?.toLowerCase() === currentEmail.toLowerCase();
                    return (
                      <div
                        key={msg._id || msg.createdAt}
                        className={`flex items-end gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <img
                          src={msg.senderPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                          alt={msg.senderName}
                          className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                        />
                        <div
                          className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-xs space-y-1.5 ${
                            isMe
                              ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-br-xs'
                              : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200/80 dark:border-slate-700 rounded-bl-xs'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-[10px] font-bold ${isMe ? 'text-emerald-100' : 'text-gray-500 dark:text-gray-400'}`}>
                              {msg.senderName}
                            </span>
                            <span className={`text-[9px] ${isMe ? 'text-emerald-200' : 'text-gray-400'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          {/* Order Attachment Badge inside message */}
                          {msg.orderId && (
                            <div className={`p-2 rounded-xl text-xs flex items-center justify-between gap-2 ${
                              isMe ? 'bg-black/20 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200'
                            }`}>
                              <span className="flex items-center gap-1.5 font-medium truncate">
                                <Package className="w-3.5 h-3.5 shrink-0" />
                                <span>Ref Order: <strong className="font-mono">{msg.orderId}</strong></span>
                              </span>
                              <Link
                                to={`/dashboard/track-order/${msg.orderId}`}
                                className="text-[10px] underline font-bold hover:opacity-80 shrink-0"
                              >
                                View Order
                              </Link>
                            </div>
                          )}

                          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-normal">
                            {msg.text}
                          </p>

                          {isMe && (
                            <div className="flex justify-end">
                              <CheckCheck className={`w-3.5 h-3.5 ${msg.read ? 'text-emerald-200' : 'text-white/60'}`} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} className="h-2" />
              </div>

              {/* Quick Suggestion Chips */}
              <div className="px-4 py-2.5 bg-gray-50/80 dark:bg-slate-900/80 border-t border-gray-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Quick Prompts:
                </span>
                {userQuickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickPrompt(prompt)}
                    className="shrink-0 px-3 py-1 rounded-full text-[11px] bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-slate-700 border border-gray-200/80 dark:border-slate-700 transition-all font-semibold shadow-2xs cursor-pointer active:scale-95"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Form Box - Modern, Elevated & Clear of Overlays */}
              <form onSubmit={handleSendMessage} className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-t border-gray-200/80 dark:border-slate-800 shadow-lg relative z-20">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <textarea
                      rows={1}
                      placeholder={`Type your message to ${activeContact.name}... (Press Enter to send)`}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="w-full px-4 py-3.5 text-xs sm:text-sm rounded-2xl bg-gray-50 dark:bg-slate-800/90 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!inputText.trim() || sending}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all shrink-0 cursor-pointer"
                  >
                    {sending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-400 flex items-center justify-center">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-gray-800 dark:text-white">Select a contact to begin</h3>
              <p className="text-xs text-gray-500 max-w-sm">
                Choose a Production Manager or Buyer from the left sidebar to inspect and send in-app messages.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
