import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Star, Shield, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Listing {
  id: number;
  title: string;
  owner: string;
  rating: number;
  reviews: number;
  price: number;
  period: string;
  deposit: number;
  distance: number;
  image: string;
  verified: boolean;
  tags: string[];
  category: string;
  available: boolean;
}

const allListings: Listing[] = [
  { id: 1, title: "Weekend DIY Tool Kit", owner: "Eric M.", rating: 4.9, reviews: 12, price: 25, period: "weekend", deposit: 30, distance: 0.8, image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&h=300&fit=crop", verified: true, tags: ["Circular Saw", "Drill", "Clamps"], category: "Tools", available: true },
  { id: 2, title: "Mountain Bike – Trek X-Caliber", owner: "Sarah L.", rating: 4.8, reviews: 24, price: 18, period: "day", deposit: 50, distance: 1.2, image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&h=300&fit=crop", verified: true, tags: ["21-speed", "Helmet included"], category: "Bikes & Scooters", available: true },
  { id: 3, title: "Canon EOS R5 + 24-70mm", owner: "James K.", rating: 5.0, reviews: 8, price: 45, period: "day", deposit: 100, distance: 2.1, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop", verified: false, tags: ["Mirrorless", "Pro lens"], category: "Camera Gear", available: true },
  { id: 4, title: "4-Person Camping Bundle", owner: "Mia R.", rating: 4.7, reviews: 15, price: 35, period: "weekend", deposit: 40, distance: 3.4, image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop", verified: true, tags: ["Tent", "Sleeping bags", "Cooler"], category: "Outdoor & Camping", available: false },
  { id: 5, title: "Bosch Hammer Drill", owner: "Tom W.", rating: 4.6, reviews: 31, price: 12, period: "day", deposit: 20, distance: 0.5, image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop", verified: true, tags: ["Heavy-duty", "SDS-plus"], category: "Tools", available: true },
  { id: 6, title: "DJ Speaker System", owner: "Alex P.", rating: 4.4, reviews: 9, price: 60, period: "day", deposit: 80, distance: 4.2, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop", verified: false, tags: ["PA System", "2x Speakers"], category: "Party & Events", available: true },
  { id: 7, title: "Electric Scooter – Xiaomi Pro", owner: "Nina C.", rating: 4.9, reviews: 18, price: 15, period: "day", deposit: 40, distance: 1.8, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop", verified: true, tags: ["30mi range", "Foldable"], category: "Bikes & Scooters", available: true },
  { id: 8, title: "Pressure Washer – Kärcher", owner: "Dave H.", rating: 4.3, reviews: 6, price: 20, period: "day", deposit: 25, distance: 2.9, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop", verified: true, tags: ["2000 PSI", "Hose included"], category: "Tools", available: true },
  { id: 9, title: "Yoga & Fitness Kit", owner: "Lena F.", rating: 4.8, reviews: 22, price: 8, period: "day", deposit: 15, distance: 0.6, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop", verified: true, tags: ["Mat", "Bands", "Blocks"], category: "Sports & Fitness", available: true },
  { id: 10, title: "Wedding Decor Set", owner: "Chris B.", rating: 5.0, reviews: 4, price: 75, period: "weekend", deposit: 100, distance: 5.0, image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop", verified: false, tags: ["Arch", "Flowers", "Lighting"], category: "Party & Events", available: false },
  { id: 11, title: "GoPro Hero 12 Bundle", owner: "Sam T.", rating: 4.7, reviews: 14, price: 22, period: "day", deposit: 50, distance: 1.5, image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop", verified: true, tags: ["4K", "Waterproof", "Mounts"], category: "Camera Gear", available: true },
  { id: 12, title: "Tile Cutter + Grout Kit", owner: "Rick M.", rating: 4.5, reviews: 7, price: 18, period: "day", deposit: 30, distance: 3.1, image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop", verified: false, tags: ["Wet saw", "Spacers"], category: "Tools", available: true },
];

const categories = ["All", "Tools", "Bikes & Scooters", "Camera Gear", "Outdoor & Camping", "Party & Events", "Sports & Fitness"];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [location, setLocation] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxDistance, setMaxDistance] = useState(10);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [minRating, setMinRating] = useState(0);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  const filtered = useMemo(() => {
    let results = allListings.filter((item) => {
      if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
      if (item.distance > maxDistance) return false;
      if (item.price < priceRange[0] || item.price > priceRange[1]) return false;
      if (item.rating < minRating) return false;
      if (availableOnly && !item.available) return false;
      if (verifiedOnly && !item.verified) return false;
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
      return true;
    });

    switch (sortBy) {
      case "price-low": results.sort((a, b) => a.price - b.price); break;
      case "price-high": results.sort((a, b) => b.price - a.price); break;
      case "rating": results.sort((a, b) => b.rating - a.rating); break;
      case "distance": results.sort((a, b) => a.distance - b.distance); break;
    }

    return results;
  }, [selectedCategory, maxDistance, priceRange, minRating, availableOnly, verifiedOnly, searchQuery, sortBy]);

  const activeFilterCount = [
    selectedCategory !== "All",
    maxDistance < 10,
    priceRange[0] > 0 || priceRange[1] < 100,
    minRating > 0,
    availableOnly,
    verifiedOnly,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory("All");
    setMaxDistance(10);
    setPriceRange([0, 100]);
    setMinRating(0);
    setAvailableOnly(false);
    setVerifiedOnly(false);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="font-display font-semibold text-sm text-foreground mb-3">Category</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Distance */}
      <div>
        <h4 className="font-display font-semibold text-sm text-foreground mb-3">
          Max Distance: <span className="text-primary">{maxDistance} mi</span>
        </h4>
        <Slider
          value={[maxDistance]}
          onValueChange={(v) => setMaxDistance(v[0])}
          max={10}
          min={0.5}
          step={0.5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0.5 mi</span>
          <span>10 mi</span>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-display font-semibold text-sm text-foreground mb-3">
          Price: <span className="text-primary">${priceRange[0]} – ${priceRange[1]}</span>
        </h4>
        <Slider
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          max={100}
          min={0}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>$0</span>
          <span>$100+</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-display font-semibold text-sm text-foreground mb-3">Minimum Rating</h4>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                minRating === r
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {r === 0 ? "Any" : <><Star size={12} className="fill-current" /> {r}+</>}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={availableOnly} onCheckedChange={(v) => setAvailableOnly(!!v)} />
          <span className="text-sm text-foreground">Available now only</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={verifiedOnly} onCheckedChange={(v) => setVerifiedOnly(!!v)} />
          <span className="text-sm text-foreground">Verified owners only</span>
        </label>
      </div>

      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
          Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Search Header */}
      <div className="pt-20 pb-4 bg-gradient-surface border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-3 p-2 bg-card rounded-xl shadow-card max-w-2xl mx-auto">
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search className="text-muted-foreground shrink-0" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you need?"
                className="bg-transparent outline-none flex-1 text-sm text-foreground placeholder:text-muted-foreground font-body"
              />
            </div>
            <div className="flex items-center gap-2 flex-1 px-3 border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0">
              <MapPin className="text-muted-foreground shrink-0" size={18} />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="bg-transparent outline-none flex-1 text-sm text-foreground placeholder:text-muted-foreground font-body"
              />
            </div>
            <Button variant="hero" size="lg">Search</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium text-foreground"
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> results
              {searchQuery && <> for "<span className="text-primary">{searchQuery}</span>"</>}
            </p>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-card">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-low">Price: Low → High</SelectItem>
              <SelectItem value="price-high">Price: High → Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="distance">Nearest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 p-5 rounded-2xl bg-card border border-border shadow-card">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-semibold text-foreground">Filters</h3>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="text-xs">{activeFilterCount} active</Badge>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {filtersOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setFiltersOpen(false)}
                  className="lg:hidden fixed inset-0 bg-foreground/30 z-40"
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25 }}
                  className="lg:hidden fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-background z-50 overflow-y-auto p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display font-semibold text-lg text-foreground">Filters</h3>
                    <button onClick={() => setFiltersOpen(false)} className="text-muted-foreground">
                      <X size={20} />
                    </button>
                  </div>
                  <FilterPanel />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Results Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-xl font-semibold text-foreground mb-2">No results found</p>
                <p className="text-sm text-muted-foreground mb-6">Try adjusting your filters or search term</p>
                <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -3 }}
                    className="group rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated transition-all overflow-hidden cursor-pointer"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {item.verified && (
                        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                          <Shield size={12} /> Verified
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-card/90 backdrop-blur-sm text-foreground text-xs font-semibold">
                        <MapPin size={12} /> {item.distance} mi
                      </div>
                      {!item.available && (
                        <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
                          <span className="px-4 py-1.5 rounded-full bg-card text-foreground text-sm font-display font-semibold">Unavailable</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display font-semibold text-foreground text-sm truncate">{item.title}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">by {item.owner}</p>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">{item.category}</Badge>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
                        ))}
                        {item.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs font-normal">+{item.tags.length - 2}</Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                        <div>
                          <span className="font-display font-bold text-lg text-foreground">${item.price}</span>
                          <span className="text-xs text-muted-foreground">/{item.period}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star size={14} className="fill-secondary text-secondary" />
                          <span className="font-semibold text-foreground">{item.rating}</span>
                          <span className="text-muted-foreground text-xs">({item.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;
