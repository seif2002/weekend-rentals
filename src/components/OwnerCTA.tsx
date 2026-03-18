import { Button } from "@/components/ui/button";
import { DollarSign, Calendar, Shield, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const perks = [
  { icon: DollarSign, title: "Earn Passive Income", desc: "Turn idle gear into steady earnings" },
  { icon: Calendar, title: "Smart Availability", desc: "Set your own schedule and pricing" },
  { icon: Shield, title: "Built-in Protection", desc: "Deposits, insurance, and dispute support" },
  { icon: TrendingUp, title: "Performance Dashboard", desc: "Track earnings, ratings, and trends" },
];

const OwnerCTA = () => {
  return (
    <section id="owners" className="py-20 md:py-28 bg-gradient-surface">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-semibold font-display tracking-widest text-secondary uppercase">For Owners</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
              Your garage is a <span className="text-gradient-primary">goldmine</span>
            </h2>
            <p className="text-muted-foreground mb-10 max-w-lg font-body">
              List your tools, bikes, cameras, or camping gear and start earning. Average owners make $200+/month with items they rarely use.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {perks.map((perk) => (
                <div key={perk.title} className="flex gap-3 p-4 rounded-xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-primary shrink-0">
                    <perk.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-sm text-foreground">{perk.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{perk.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="warm" size="lg">
              Start Listing — It's Free
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-2xl bg-card border border-border shadow-elevated p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center font-display font-bold text-primary">E</div>
                <div>
                  <p className="font-display font-semibold text-foreground">Eric's Dashboard</p>
                  <p className="text-xs text-muted-foreground">Verified Owner · 4.9★</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 rounded-xl bg-accent/50">
                  <p className="font-display font-bold text-xl text-foreground">$210</p>
                  <p className="text-xs text-muted-foreground">This Month</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-accent/50">
                  <p className="font-display font-bold text-xl text-foreground">28</p>
                  <p className="text-xs text-muted-foreground">Rentals</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-accent/50">
                  <p className="font-display font-bold text-xl text-foreground">4.9★</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>

              <div className="space-y-3">
                {["Weekend DIY Tool Kit", "Mountain Bike", "Camping Bundle"].map((item, i) => (
                  <div key={item} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium text-foreground">{item}</span>
                    <span className="text-xs text-primary font-semibold">{["$85", "$62", "$63"][i]} earned</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OwnerCTA;
