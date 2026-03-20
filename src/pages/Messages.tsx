import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Search, MoreVertical, Phone, Image, Paperclip, Check, CheckCheck, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  participantName: string;
  participantAvatar: string;
  participantInitials: string;
  listingTitle: string;
  listingImage: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  online: boolean;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    participantName: "Eric Thompson",
    participantAvatar: "",
    participantInitials: "ET",
    listingTitle: "Weekend DIY Tool Kit",
    listingImage: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=100&h=100&fit=crop",
    lastMessage: "Yep! I'll be home around 6. See you then!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 12),
    unreadCount: 1,
    online: true,
    messages: [
      { id: "m1", senderId: "me", text: "Hey Eric! I'm interested in renting your tool kit this weekend. Is it available Friday to Monday?", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), read: true },
      { id: "m2", senderId: "other", text: "Hey! Yes, it's available. The kit includes a circular saw, drill, and clamps. Everything you need for most projects.", timestamp: new Date(Date.now() - 1000 * 60 * 55), read: true },
      { id: "m3", senderId: "me", text: "Perfect, that's exactly what I need. Can I pick them up Friday after 6?", timestamp: new Date(Date.now() - 1000 * 60 * 30), read: true },
      { id: "m4", senderId: "other", text: "Yep! I'll be home around 6. See you then!", timestamp: new Date(Date.now() - 1000 * 60 * 12), read: false },
    ],
  },
  {
    id: "conv-2",
    participantName: "Sarah Chen",
    participantAvatar: "",
    participantInitials: "SC",
    listingTitle: "Canon EOS R6 Camera Kit",
    listingImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop",
    lastMessage: "The 24-70mm lens is included. Let me know if you need any extras!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3),
    unreadCount: 0,
    online: false,
    messages: [
      { id: "m5", senderId: "me", text: "Hi Sarah, does the camera come with a lens or just the body?", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), read: true },
      { id: "m6", senderId: "other", text: "The 24-70mm lens is included. Let me know if you need any extras!", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), read: true },
    ],
  },
  {
    id: "conv-3",
    participantName: "Marcus Rivera",
    participantAvatar: "",
    participantInitials: "MR",
    listingTitle: "Mountain Bike – Trek Marlin 7",
    listingImage: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=100&h=100&fit=crop",
    lastMessage: "I can drop it off if you're within 3 miles. Where are you located?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 2,
    online: true,
    messages: [
      { id: "m7", senderId: "other", text: "Thanks for your interest in the Trek! It's in great condition, just serviced last week.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26), read: true },
      { id: "m8", senderId: "me", text: "Awesome! Do you offer delivery or is it pickup only?", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25), read: true },
      { id: "m9", senderId: "other", text: "I can drop it off if you're within 3 miles. Where are you located?", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), read: false },
      { id: "m10", senderId: "other", text: "Also, I have a helmet and lock you can borrow for free if needed 👍", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), read: false },
    ],
  },
  {
    id: "conv-4",
    participantName: "Leila Abrams",
    participantAvatar: "",
    participantInitials: "LA",
    listingTitle: "Party Speaker – JBL PartyBox",
    listingImage: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=100&h=100&fit=crop",
    lastMessage: "Returned in perfect condition. Thanks for being a great renter! 🎉",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 72),
    unreadCount: 0,
    online: false,
    messages: [
      { id: "m11", senderId: "me", text: "Just dropped off the speaker. Everything is as I found it!", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 73), read: true },
      { id: "m12", senderId: "other", text: "Returned in perfect condition. Thanks for being a great renter! 🎉", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), read: true },
    ],
  },
];

function formatTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatFullTime(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const filtered = conversations.filter(
    (c) =>
      c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.listingTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages.length]);

  const handleSelectConv = (id: string) => {
    setActiveConvId(id);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, unreadCount: 0, messages: c.messages.map((m) => ({ ...m, read: true })) }
          : c
      )
    );
  };

  const handleSend = () => {
    if (!newMessage.trim() || !activeConvId) return;
    const msg: Message = {
      id: `m-${Date.now()}`,
      senderId: "me",
      text: newMessage.trim(),
      timestamp: new Date(),
      read: false,
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? { ...c, messages: [...c.messages, msg], lastMessage: msg.text, lastMessageTime: msg.timestamp }
          : c
      )
    );
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { label: string; messages: Message[] }[] = [];
    let currentLabel = "";
    for (const msg of messages) {
      const d = msg.timestamp;
      const now = new Date();
      let label: string;
      if (d.toDateString() === now.toDateString()) label = "Today";
      else if (d.toDateString() === new Date(now.getTime() - 86400000).toDateString()) label = "Yesterday";
      else label = d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

      if (label !== currentLabel) {
        groups.push({ label, messages: [msg] });
        currentLabel = label;
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    }
    return groups;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Messages</h1>
                {totalUnread > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">{totalUnread} unread conversation{totalUnread > 1 ? "s" : ""}</p>
                )}
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-[var(--shadow-card)] overflow-hidden" style={{ height: "calc(100vh - 200px)", minHeight: "500px" }}>
              <div className="flex h-full">
                {/* Conversation List */}
                <div className={`${activeConvId ? "hidden md:flex" : "flex"} flex-col w-full md:w-[360px] border-r border-border`}>
                  <div className="p-4 border-b border-border">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-muted/50 border-none"
                      />
                    </div>
                  </div>
                  <ScrollArea className="flex-1">
                    {filtered.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground text-sm">No conversations found</div>
                    ) : (
                      filtered.map((conv) => (
                        <button
                          key={conv.id}
                          onClick={() => handleSelectConv(conv.id)}
                          className={`w-full text-left p-4 flex gap-3 transition-colors duration-150 hover:bg-accent/50 active:scale-[0.98] ${
                            activeConvId === conv.id ? "bg-accent/60" : ""
                          } ${conv.unreadCount > 0 ? "bg-accent/20" : ""}`}
                        >
                          <div className="relative shrink-0">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={conv.participantAvatar} />
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                                {conv.participantInitials}
                              </AvatarFallback>
                            </Avatar>
                            {conv.online && (
                              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-card" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-sm truncate ${conv.unreadCount > 0 ? "font-bold text-foreground" : "font-medium text-foreground"}`}>
                                {conv.participantName}
                              </span>
                              <span className="text-xs text-muted-foreground shrink-0">{formatTime(conv.lastMessageTime)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.listingTitle}</p>
                            <div className="flex items-center justify-between gap-2 mt-1">
                              <p className={`text-sm truncate ${conv.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                                {conv.lastMessage}
                              </p>
                              {conv.unreadCount > 0 && (
                                <Badge className="h-5 min-w-[20px] flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1.5 shrink-0">
                                  {conv.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </ScrollArea>
                </div>

                {/* Chat View */}
                <div className={`${activeConvId ? "flex" : "hidden md:flex"} flex-col flex-1`}>
                  {activeConv ? (
                    <>
                      {/* Chat Header */}
                      <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
                        <button
                          onClick={() => setActiveConvId(null)}
                          className="md:hidden text-muted-foreground hover:text-foreground transition-colors active:scale-95"
                        >
                          <ArrowLeft size={20} />
                        </button>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={activeConv.participantAvatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                            {activeConv.participantInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground truncate">{activeConv.participantName}</h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            {activeConv.online ? (
                              <>
                                <Circle className="h-2 w-2 fill-green-500 text-green-500" /> Online
                              </>
                            ) : (
                              "Offline"
                            )}
                          </p>
                        </div>
                        {/* Listing context */}
                        <a href={`/listing/1`} className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                          <img src={activeConv.listingImage} alt="" className="h-8 w-8 rounded object-cover" />
                          <span className="text-xs font-medium text-foreground max-w-[140px] truncate">{activeConv.listingTitle}</span>
                        </a>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <MoreVertical size={18} />
                        </Button>
                      </div>

                      {/* Messages */}
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-1">
                          {groupMessagesByDate(activeConv.messages).map((group) => (
                            <div key={group.label}>
                              <div className="flex justify-center my-4">
                                <span className="text-[11px] text-muted-foreground bg-muted/60 px-3 py-1 rounded-full font-medium">
                                  {group.label}
                                </span>
                              </div>
                              <div className="space-y-2">
                                {group.messages.map((msg, idx) => {
                                  const isMe = msg.senderId === "me";
                                  return (
                                    <motion.div
                                      key={msg.id}
                                      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                      transition={{ duration: 0.35, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                    >
                                      <div
                                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                          isMe
                                            ? "bg-primary text-primary-foreground rounded-br-md"
                                            : "bg-muted text-foreground rounded-bl-md"
                                        }`}
                                      >
                                        <p className="overflow-wrap-break-word">{msg.text}</p>
                                        <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                                          <span className={`text-[10px] ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                                            {formatFullTime(msg.timestamp)}
                                          </span>
                                          {isMe && (
                                            msg.read
                                              ? <CheckCheck className={`h-3 w-3 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`} />
                                              : <Check className={`h-3 w-3 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`} />
                                          )}
                                        </div>
                                      </div>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>

                      {/* Input */}
                      <div className="p-4 border-t border-border bg-card">
                        <div className="flex items-end gap-2">
                          <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground h-10 w-10">
                            <Paperclip size={18} />
                          </Button>
                          <Textarea
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            className="min-h-[40px] max-h-[120px] resize-none bg-muted/50 border-none rounded-xl text-sm"
                          />
                          <Button
                            onClick={handleSend}
                            disabled={!newMessage.trim()}
                            size="icon"
                            className="shrink-0 h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40 active:scale-95 transition-all"
                          >
                            <Send size={16} />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center p-8">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                      >
                        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <Send className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-display font-semibold text-foreground mb-2">Your Messages</h3>
                        <p className="text-sm text-muted-foreground max-w-[280px]">
                          Select a conversation to start chatting with renters and owners about bookings.
                        </p>
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Messages;
