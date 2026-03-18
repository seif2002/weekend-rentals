import { Star, MapPin, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const listings = [
  {
    title: "Weekend DIY Tool Kit",
    owner: "Eric M.",
    rating: 4.9,
    reviews: 12,
    price: 25,
    period: "weekend",
    deposit: 30,
    distance: "0.8 mi",
    image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&h=300&fit=crop",
    verified: true,
    tags: ["Circular Saw", "Drill", "Clamps"],
  },
  {
    title: "Mountain Bike – Trek X-Caliber",
    owner: "Sarah L.",
    rating: 4.8,
    reviews: 24,
    price: 18,
    period: "day",
    deposit: 50,
    distance: "1.2 mi",
    image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&h=300&fit=crop",
    verified: true,
    tags: ["21-speed", "Helmet included"],
  },
  {
    title: "Canon EOS R5 + 24-70mm",
    owner: "James K.",
    rating: 5.0,
    reviews: 8,
    price: 45,
    period: "day",
    deposit: 100,
    distance: "2.1 mi",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",
    verified: false,
    tags: ["Mirrorless", "Pro lens"],
  },
  {
    title: "4-Person Camping Bundle",
    owner: "Mia R.",
    rating: 4.7,
    reviews: 15,
    price: 35,
    period: "weekend",
    deposit: 40,
    distance: "3.4 mi",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop",
    verified: true,
    tags: ["Tent", "Sleeping bags", "Cooler"],
  },
];

const FeaturedListings = () => {
  return (
    <section id="listings" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="text-xs font-semibold font-display tracking-widest text-primary uppercase">Trending</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3">
              Featured Listings
            </h2>
          </div>
          <Button variant="outline" className="hidden sm:flex">View All</Button>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated transition-all overflow-hidden cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.verified && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    <Shield size={12} /> Verified
                  </div>
                )}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-card/90 backdrop-blur-sm text-foreground text-xs font-semibold">
                  <MapPin size={12} /> {item.distance}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-display font-semibold text-foreground truncate">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">by {item.owner}</p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <div>
                    <span className="font-display font-bold text-lg text-foreground">${item.price}</span>
                    <span className="text-xs text-muted-foreground">/{item.period}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star size={14} className="fill-secondary text-secondary" />
                    <span className="font-semibold text-foreground">{item.rating}</span>
                    <span className="text-muted-foreground">({item.reviews})</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
