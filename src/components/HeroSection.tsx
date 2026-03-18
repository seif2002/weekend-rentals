import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-illustration.png";

const HeroSection = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-surface">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold font-display tracking-wide mb-6">
              🔧 The Sharing Economy for Gear
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6">
              Why <span className="text-gradient-primary">buy it</span> when you can{" "}
              <span className="text-gradient-primary">borrow it?</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mb-8 font-body">
              Rentzy connects you with people nearby who have the tools, bikes, and gear you need — affordably, locally, and safely.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 p-2 bg-card rounded-xl shadow-card max-w-xl">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search className="text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="What do you need?"
                  className="bg-transparent outline-none flex-1 text-sm text-foreground placeholder:text-muted-foreground font-body"
                />
              </div>
              <div className="flex items-center gap-2 flex-1 px-3 border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0">
                <MapPin className="text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Location"
                  className="bg-transparent outline-none flex-1 text-sm text-foreground placeholder:text-muted-foreground font-body"
                />
              </div>
              <Button variant="hero" size="lg">
                Search
              </Button>
            </div>

            <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-foreground text-lg">12K+</span> Items listed
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-foreground text-lg">5K+</span> Happy renters
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-foreground text-lg">4.9★</span> Avg rating
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex justify-center"
          >
            <img
              src={heroImage}
              alt="People sharing tools and gear in a community"
              className="w-full max-w-lg animate-float"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
