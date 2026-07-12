'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { sendChatMessageAction, uploadChatAttachmentAction, updateLastReadAction } from '@/app/(app)/trips/[id]/chat/actions';
import { ChatMessage, ChatReadState } from '@/types';
import { Send, Image, FileText, Smile, Search, ArrowLeft, Loader2, ShieldCheck, CheckCheck } from 'lucide-react';
import Link from 'next/link';

interface TripChatProps {
  tripId: string;
  initialMessages: ChatMessage[];
  initialReadStates: any[];
  currentUser: any;
  tripTitle: string;
}

export default function TripChat({
  tripId,
  initialMessages,
  initialReadStates,
  currentUser,
  tripTitle,
}: TripChatProps) {
  const supabase = getSupabaseBrowserClient();
  
  // Data lists
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [readStates, setReadStates] = useState<any[]>(initialReadStates);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  
  // Input fields
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Upload attachment states
  const [attachment, setAttachment] = useState<{ url: string; type: string; name: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Typing state
  const [typingUsers, setTypingUsers] = useState<{ [userId: string]: { name: string; timestamp: number } }>({});
  const typingTimeoutRef = useRef<{ [userId: string]: NodeJS.Timeout }>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  // Travel emojis list for quick access
  const travelEmojis = ['🏔️', '🚗', '🏍️', '🏕️', '👍', '❤️', '😂', '🔥', '🗺️', '✈️', '🎒', '⛺'];

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set up Supabase Realtime channel
  useEffect(() => {
    const channel = supabase.channel(`trip-chat:${tripId}`, {
      config: {
        presence: {
          key: currentUser.id,
        },
      },
    });

    channelRef.current = channel;

    // 1. Listen for new messages broadcasted by senders (efficient lookup with full profiles)
    channel.on('broadcast', { event: 'new-message' }, ({ payload }: { payload: any }) => {
      setMessages((prev) => {
        // Prevent duplicate appends if client already inserted locally
        if (prev.some((m) => m.id === payload.id)) return prev;
        return [...prev, payload];
      });
      // Mark read immediately if focused
      updateReadReceipt();
    });

    // 2. Listen for typing events
    channel.on('broadcast', { event: 'typing-indicator' }, ({ payload }: { payload: any }) => {
      const { userId, userName, isTyping } = payload;
      if (userId === currentUser.id) return;

      setTypingUsers((prev) => {
        const next = { ...prev };
        if (isTyping) {
          next[userId] = { name: userName, timestamp: Date.now() };
          
          // Clear previous timeout
          if (typingTimeoutRef.current[userId]) {
            clearTimeout(typingTimeoutRef.current[userId]);
          }
          
          // Set timeout to clear typing state after 3 seconds of inactivity
          typingTimeoutRef.current[userId] = setTimeout(() => {
            setTypingUsers((current) => {
              const updated = { ...current };
              delete updated[userId];
              return updated;
            });
          }, 3000);
        } else {
          delete next[userId];
        }
        return next;
      });
    });

    // 3. Listen for read receipt broadcast (realtime read ticks update)
    channel.on('broadcast', { event: 'read-receipt' }, ({ payload }: { payload: any }) => {
      const { userId, lastReadAt, userName, avatarUrl } = payload;
      setReadStates((prev) => {
        const index = prev.findIndex((r) => r.userId === userId);
        const updatedReceipt = {
          userId,
          lastReadAt,
          user: {
            profile: {
              fullName: userName,
              avatarUrl,
            },
          },
        };
        if (index > -1) {
          const copy = [...prev];
          copy[index] = updatedReceipt;
          return copy;
        }
        return [...prev, updatedReceipt];
      });
    });

    // 4. Track Presence (active members in the room)
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const onlineIds = Object.keys(state);
      setOnlineUsers(onlineIds);
    });

    // Subscribe to channel and track presence
    channel.subscribe(async (status: string) => {
      if (status === 'SUBSCRIBED') {
        const fullName = currentUser.user_metadata?.full_name || currentUser.email.split('@')[0];
        await channel.track({
          userId: currentUser.id,
          userName: fullName,
          avatarUrl: currentUser.user_metadata?.avatar_url || null,
        });
      }
    });

    // Update read state on database immediately on load
    updateReadReceipt();

    return () => {
      channel.unsubscribe();
      // Clear all typing timeouts
      Object.values(typingTimeoutRef.current).forEach(clearTimeout);
    };
  }, [tripId]);

  // Update read receipt both in database and broadcast to channel
  const updateReadReceipt = async () => {
    const lastReadAt = new Date().toISOString();
    
    // 1. Update in database via Server Action
    updateLastReadAction(tripId);

    // 2. Broadcast read event to channel
    const fullName = currentUser.user_metadata?.full_name || currentUser.email.split('@')[0];
    const avatarUrl = currentUser.user_metadata?.avatar_url || null;

    channelRef.current?.send({
      type: 'broadcast',
      event: 'read-receipt',
      payload: {
        userId: currentUser.id,
        lastReadAt,
        userName: fullName,
        avatarUrl,
      },
    });
  };

  // Broadcast typing indicator
  const handleTyping = (text: string) => {
    setMessageInput(text);
    const fullName = currentUser.user_metadata?.full_name || currentUser.email.split('@')[0];
    
    channelRef.current?.send({
      type: 'broadcast',
      event: 'typing-indicator',
      payload: {
        userId: currentUser.id,
        userName: fullName,
        isTyping: text.trim().length > 0,
      },
    });
  };

  // Send message handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() && !attachment) return;

    const text = messageInput.trim();
    setMessageInput('');
    setShowEmojiPicker(false);

    const fileUrl = attachment?.url || null;
    const fileType = attachment?.type || null;
    setAttachment(null);

    // 1. Send to server via Server Action
    const res = await sendChatMessageAction(tripId, text, fileUrl, fileType);
    
    if (res?.error) {
      setErrorMsg(res.error);
    } else if (res?.message) {
      // 2. Append locally to avoid waiting
      setMessages((prev) => [...prev, res.message]);
      
      // 3. Broadcast message to realtime channel
      channelRef.current?.send({
        type: 'broadcast',
        event: 'new-message',
        payload: res.message,
      });

      // Clear typing indicator
      channelRef.current?.send({
        type: 'broadcast',
        event: 'typing-indicator',
        payload: {
          userId: currentUser.id,
          userName: '',
          isTyping: false,
        },
      });

      scrollToBottom();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadChatAttachmentAction(formData);
    setIsUploading(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else if (res?.fileUrl && res?.fileType) {
      setAttachment({
        url: res.fileUrl,
        type: res.fileType,
        name: res.fileName || file.name,
      });
    }
  };

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Search filter
  const filteredMessages = messages.filter((m) =>
    m.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Read receipts helper (calculates who has read a message)
  const getReadReceipts = (message: ChatMessage) => {
    if (message.senderId !== currentUser.id) return null;
    
    const readBy = readStates
      .filter((r) => r.userId !== currentUser.id && new Date(r.lastReadAt) >= new Date(message.createdAt))
      .map((r) => r.user?.profile?.fullName || 'Traveler');

    if (readBy.length === 0) return null;
    return `Read by: ${readBy.join(', ')}`;
  };

  return (
    <div className="flex flex-col h-[600px] border border-border bg-card rounded-3xl shadow-lg overflow-hidden">
      
      {/* 1. Header Chat */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/35">
        <div className="flex items-center gap-3">
          <Link href={`/trips/${tripId}`} className="p-2 hover:bg-secondary rounded-full transition-colors lg:hidden">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="font-bold text-md truncate max-w-[200px] sm:max-w-[350px]">{tripTitle} Chat</h2>
            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{onlineUsers.length} online</span>
            </div>
          </div>
        </div>

        {/* Search toggler */}
        <div className="flex items-center gap-2">
          {showSearch && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chat..."
              className="bg-background border border-border rounded-full px-4 py-1.5 text-xs focus:outline-none w-36 sm:w-48 animate-in fade-in duration-200"
            />
          )}
          <button
            onClick={() => {
              setShowSearch(!showSearch);
              setSearchQuery('');
            }}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <Search className="h-4.5 w-4.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* 2. Messages List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-secondary/10">
        {filteredMessages.map((message) => {
          const isOwn = message.senderId === currentUser.id;
          const senderProfile = message.sender?.profile;
          const receipts = getReadReceipts(message);

          return (
            <div key={message.id} className={`flex items-start gap-2.5 max-w-[85%] ${isOwn ? 'ml-auto flex-row-reverse' : ''}`}>
              
              {/* Profile Avatar */}
              <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-xs overflow-hidden flex-none">
                {senderProfile?.avatarUrl ? (
                  <img src={senderProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  senderProfile?.fullName?.charAt(0) || message.sender?.email.charAt(0) || 'T'
                )}
              </div>

              {/* Message Bubble content */}
              <div className="space-y-1">
                {/* Sender Name */}
                {!isOwn && (
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      {senderProfile?.fullName || 'Companion'}
                    </span>
                    {senderProfile?.isVerified && (
                      <ShieldCheck className="h-3 w-3 text-primary fill-primary/10" />
                    )}
                  </div>
                )}

                <div className={`p-3.5 rounded-2xl text-sm ${
                  isOwn 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-card border border-border rounded-tl-none'
                }`}>
                  {/* File attachment preview */}
                  {message.fileUrl && (
                    <div className="mb-2 max-w-[200px]">
                      {message.fileType === 'IMAGE' ? (
                        <img src={message.fileUrl} alt="Attachment" className="rounded-lg object-cover max-h-40 w-full border border-border" />
                      ) : (
                        <a
                          href={message.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-secondary rounded-lg border border-border text-foreground hover:bg-secondary/80 text-xs font-semibold"
                        >
                          <FileText className="h-5 w-5 text-primary" />
                          <span className="truncate">Download File</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Text content */}
                  {message.content && <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>}
                  
                  {/* Timestamp */}
                  <span className={`block text-[9px] mt-1.5 text-right ${isOwn ? 'text-primary-foreground/75' : 'text-muted-foreground'}`}>
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Read Receipts */}
                {isOwn && receipts && (
                  <div className="text-[9px] text-muted-foreground flex items-center justify-end gap-0.5">
                    <CheckCheck className="h-3 w-3 text-primary" />
                    <span>{receipts}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Realtime Typing Indicators */}
      {Object.keys(typingUsers).length > 0 && (
        <div className="px-6 py-1 bg-secondary/25 border-t border-border flex items-center gap-1.5">
          <Loader2 className="h-3 w-3 animate-spin text-primary" />
          <span className="text-[10px] text-muted-foreground italic font-semibold">
            {Object.values(typingUsers).map((u) => u.name).join(', ')} typing...
          </span>
        </div>
      )}

      {/* 4. Chat Inputs Bar */}
      <div className="border-t border-border bg-background p-4 space-y-3">
        {/* Attachment preview if uploading */}
        {attachment && (
          <div className="flex items-center justify-between p-2 bg-secondary border border-border rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="truncate font-semibold">{attachment.name}</span>
            </div>
            <button onClick={() => setAttachment(null)} className="text-muted-foreground hover:text-foreground font-bold">
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          {/* File upload input */}
          <div className="flex gap-1.5 flex-none">
            <label className="p-2.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              <Image className="h-4.5 w-4.5" />
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
            </label>
            <label className="p-2.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              <FileText className="h-4.5 w-4.5" />
              <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
            </label>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2.5 rounded-full hover:bg-secondary transition-colors ${showEmojiPicker ? 'text-primary bg-secondary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Smile className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={messageInput}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder="Type message..."
            className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground transition-all duration-200"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={(!messageInput.trim() && !attachment) || isUploading}
            className="flex-none p-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors disabled:opacity-40 shadow-sm"
          >
            {isUploading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Send className="h-4.5 w-4.5" />}
          </button>
        </form>

        {/* Emoji Selection container */}
        {showEmojiPicker && (
          <div className="flex flex-wrap gap-2 p-3 bg-secondary/35 border border-border rounded-2xl animate-in slide-in-from-bottom-2 duration-200">
            {travelEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setMessageInput((prev) => prev + emoji);
                  setShowEmojiPicker(false);
                }}
                className="text-lg p-1 rounded hover:bg-secondary transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
