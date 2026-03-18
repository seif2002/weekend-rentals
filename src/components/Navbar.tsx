import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

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
          <a href="#owners" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">List Your Gear</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm">Log In</Button>
          <Button variant="hero" size="sm">Sign Up Free</Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
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
              <a href="#owners" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>List Your Gear</a>
              <div className="flex gap-3 pt-2">
                <Button variant="ghost" size="sm" className="flex-1">Log In</Button>
                <Button variant="hero" size="sm" className="flex-1">Sign Up</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
