import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, MessageCircle, CalendarCheck, RotateCcw, Package, Star, X, Check, CheckCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type NotificationType = "message" | "booking" | "return" | "review" | "promo" | "payout";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  avatar?: string;
  actionUrl?: string;
}

const ICON_MAP: Record<NotificationType, typeof Bell> = {
  message: MessageCircle,
  booking: CalendarCheck,
  return: RotateCcw,
  review: Star,
  promo: Sparkles,
  payout: Package,
};

const COLOR_MAP: Record<NotificationType, string> = {
  message: "bg-primary/15 text-primary",
  booking: "bg-secondary/15 text-secondary",
  return: "bg-accent text-accent-foreground",
  review: "bg-yellow-100 text-yellow-700",
  promo: "bg-purple-100 text-purple-700",
  payout: "bg-emerald-100 text-emerald-700",
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "message",
    title: "New message from Emma",
    body: "\"Hey, can I pick these up Friday after 6?\"",
    time: "2m ago",
    read: false,
    actionUrl: "/messages",
  },
  {
    id: "2",
    type: "booking",
    title: "Booking confirmed!",
    body: "James Chen booked your Canon EOS R6 for Mar 25–27.",
    time: "1h ago",
    read: false,
    actionUrl: "/dashboard",
  },
  {
    id: "3",
    type: "return",
    title: "Return reminder",
    body: "\"Weekend DIY Tool Kit\" is due back tomorrow by 9 AM.",
    time: "3h ago",
    read: false,
  },
  {
    id: "4",
    type: "review",
    title: "New 5★ review",
    body: "Emma Wilson left a review on your DIY Tool Kit listing.",
    time: "5h ago",
    read: true,
    actionUrl: "/dashboard",
  },
  {
    id: "5",
    type: "payout",
    title: "Payout processed",
    body: "$120.00 has been transferred to your bank account.",
    time: "1d ago",
    read: true,
  },
  {
    id: "6",
    type: "promo",
    title: "Spring deal! 🌱",
    body: "Use code SpringBuild15 for 15% off your next rental.",
    time: "2d ago",
    read: true,
  },
];

/* ─── Toast-style push notification ──────────── */
const PushToast = ({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: () => void;
}) => {
  const Icon = ICON_MAP[notification.type];

  useEffect(() => {
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.9 }}
      transition={{ type: "spring", damping: 22, stiffness: 300 }}
      className="pointer-events-auto w-[360px] rounded-xl border border-border bg-card shadow-elevated p-4 flex gap-3 items-start"
    >
      <div className={cn("shrink-0 rounded-lg p-2", COLOR_MAP[notification.type])}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-card-foreground truncate">{notification.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.body}</p>
      </div>
      <button onClick={onDismiss} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
        <X size={14} />
      </button>
    </motion.div>
  );
};

/* ─── Main notification centre ───────────────── */
const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* Simulate a push notification after 8s */
  useEffect(() => {
    const timer = setTimeout(() => {
      const push: Notification = {
        id: "push-1",
        type: "message",
        title: "Sarah Miller sent a message",
        body: "\"Can I pick up the bike at 3pm?\"",
        time: "Just now",
        read: false,
        actionUrl: "/messages",
      };
      setNotifications((prev) => [push, ...prev]);
      setToasts((prev) => [push, ...prev]);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Push toast layer */}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <PushToast key={t.id} notification={t} onDismiss={() => dismissToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>

      {/* Bell trigger + dropdown */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="relative text-muted-foreground hover:text-foreground transition-colors p-2">
            <Bell size={20} />
            {unreadCount > 0 && (
              <motion.span
                key={unreadCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1 border-2 border-background"
              >
                {unreadCount}
              </motion.span>
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent align="end" sideOffset={8} className="w-[380px] p-0 rounded-xl shadow-elevated border-border">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" className="text-xs h-7 text-muted-foreground" onClick={markAllRead}>
                  <CheckCheck size={14} className="mr-1" /> Mark all read
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-4 pb-2">
            {(["all", "unread"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "text-xs font-medium px-3 py-1.5 rounded-full transition-colors capitalize",
                  filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                )}
              >
                {f}
                {f === "unread" && unreadCount > 0 && (
                  <span className="ml-1.5 bg-primary-foreground/20 rounded-full px-1.5 text-[10px]">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>

          <Separator />

          {/* List */}
          <ScrollArea className="max-h-[400px]">
            {filtered.length === 0 ? (
              <div className="py-12 text-center">
                <Bell size={32} className="mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">All caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filtered.map((n) => {
                  const Icon = ICON_MAP[n.type];
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        "flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/50",
                        !n.read && "bg-primary/[0.03]"
                      )}
                      onClick={() => {
                        markRead(n.id);
                        if (n.actionUrl) window.location.href = n.actionUrl;
                      }}
                    >
                      <div className={cn("shrink-0 rounded-lg p-2 mt-0.5", COLOR_MAP[n.type])}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn("text-sm truncate", !n.read ? "font-semibold text-foreground" : "font-medium text-muted-foreground")}>
                            {n.title}
                          </p>
                          {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                        <p className="text-[11px] text-muted-foreground/70 mt-1">{n.time}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          <Separator />
          <div className="p-2 text-center">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground w-full">
              View all notifications
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default NotificationCenter;
