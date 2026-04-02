import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageCircle, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import NotificationCenter from "@/components/NotificationCenter";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const unreadCount = 3;

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="/" className="font-display text-2xl font-bold text-gradient-primary">
          Rentzy
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#categories" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Categories</a>
          <a href="#listings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Featured</a>
          <a href="/add-listing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">List Your Gear</a>
          <a href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Dashboard</a>
        </div>

        <div className="hidden md:flex items-center gap-1">
          <a href="/messages" className="relative text-muted-foreground hover:text-foreground transition-colors p-2">
            <MessageCircle size={20} />
            {unreadCount > 0 && (
              <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1 border-2 border-background">
                {unreadCount}
              </Badge>
            )}
          </a>
          <NotificationCenter />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-2 flex items-center gap-2 rounded-full hover:bg-accent p-1 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/profile" className="cursor-pointer"><User size={14} className="mr-2" /> Profile</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/dashboard" className="cursor-pointer">Dashboard</a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                  <LogOut size={14} className="mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="ml-2" asChild><a href="/auth">Log In</a></Button>
              <Button variant="hero" size="sm" asChild><a href="/auth">Sign Up Free</a></Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <NotificationCenter />
          <button className="text-foreground p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-background border-b border-border"
          >
            <div className="flex flex-col gap-4 p-4">
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>How It Works</a>
              <a href="#categories" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Categories</a>
              <a href="#listings" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Featured</a>
              <a href="/add-listing" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>List Your Gear</a>
              <a href="/messages" className="text-sm font-medium text-muted-foreground flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                Messages
                {unreadCount > 0 && (
                  <Badge className="h-4 min-w-[16px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1">
                    {unreadCount}
                  </Badge>
                )}
              </a>
              <div className="flex gap-3 pt-2">
                {user ? (
                  <Button variant="ghost" size="sm" className="flex-1" onClick={() => { signOut(); setMobileOpen(false); }}>Sign Out</Button>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="flex-1" asChild><a href="/auth">Log In</a></Button>
                    <Button variant="hero" size="sm" className="flex-1" asChild><a href="/auth">Sign Up</a></Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
