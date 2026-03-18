import { Wrench, Bike, Camera, Tent, PartyPopper, Dumbbell } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { icon: Wrench, name: "Tools", count: "2.4K", color: "bg-primary/10 text-primary" },
  { icon: Bike, name: "Bikes & Scooters", count: "1.8K", color: "bg-secondary/10 text-secondary" },
  { icon: Camera, name: "Camera Gear", count: "950", color: "bg-accent text-accent-foreground" },
  { icon: Tent, name: "Outdoor & Camping", count: "1.2K", color: "bg-primary/10 text-primary" },
  { icon: PartyPopper, name: "Party & Events", count: "780", color: "bg-secondary/10 text-secondary" },
  { icon: Dumbbell, name: "Sports & Fitness", count: "1.1K", color: "bg-accent text-accent-foreground" },
];

const Categories = () => {
  return (
    <section id="categories" className="py-20 md:py-28 bg-gradient-surface">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold font-display tracking-widest text-primary uppercase">Browse</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3">
            Popular Categories
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card shadow-card hover:shadow-elevated transition-shadow cursor-pointer border border-border"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${cat.color}`}>
                <cat.icon size={26} />
              </div>
              <span className="font-display font-semibold text-sm text-foreground">{cat.name}</span>
              <span className="text-xs text-muted-foreground">{cat.count} listings</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
