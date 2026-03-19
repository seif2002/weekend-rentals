import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Shield, MapPin, ChevronLeft, ChevronRight, MessageCircle,
  Calendar as CalendarIcon, Clock, DollarSign, User, ThumbsUp, Package, AlertTriangle, Heart
} from "lucide-react";
import { format, addDays, isBefore, isAfter, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

// Extended listing data with more detail
const listingsData: Record<number, {
  id: number; title: string; owner: string; ownerAvatar: string; ownerJoined: string;
  ownerListings: number; ownerResponseTime: string; rating: number; reviews: number;
  price: number; period: string; deposit: number; distance: number;
  images: string[]; verified: boolean; tags: string[]; category: string; available: boolean;
  description: string; rules: string[]; includes: string[];
  reviewsList: { user: string; avatar: string; rating: number; date: string; text: string }[];
  unavailableDates: Date[];
}> = {
  1: {
    id: 1, title: "Weekend DIY Tool Kit", owner: "Eric M.", ownerAvatar: "EM",
    ownerJoined: "Mar 2024", ownerListings: 5, ownerResponseTime: "< 1 hour",
    rating: 4.9, reviews: 12, price: 25, period: "weekend", deposit: 30, distance: 0.8,
    images: [
      "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1530124566582-a45a7c6ec40f?w=800&h=600&fit=crop",
    ],
    verified: true, tags: ["Circular Saw", "Drill", "Clamps", "Sander", "Safety Goggles"],
    category: "Tools", available: true,
    description: "Everything you need for a weekend DIY project. This kit includes a DeWalt circular saw, Bosch cordless drill, 4 bar clamps, an orbital sander, and safety goggles. All tools are well-maintained and come in a carry case. Perfect for furniture building, shelving, or general woodwork.",
    rules: ["Pick-up only (no delivery)", "Late return: $10/day", "Must return clean", "No sub-lending"],
    includes: ["DeWalt Circular Saw", "Bosch Cordless Drill + 2 batteries", "4x Bar Clamps", "Orbital Sander + pads", "Safety Goggles", "Carry case"],
    reviewsList: [
      { user: "Emma S.", avatar: "ES", rating: 5, date: "2 weeks ago", text: "Amazing kit! Everything was clean and in perfect working order. Eric was super helpful with pickup instructions. Built my bookshelf in a day!" },
      { user: "Marcus T.", avatar: "MT", rating: 5, date: "1 month ago", text: "Professional quality tools at a fraction of the cost. The drill had great battery life and the saw cut through plywood like butter." },
      { user: "Lisa K.", avatar: "LK", rating: 5, date: "1 month ago", text: "Super punctual and easy to work with. Tools were exactly as described. Will rent again!" },
      { user: "Jake P.", avatar: "JP", rating: 4, date: "2 months ago", text: "Great value for a weekend project. Only minor note — one clamp was a bit stiff, but still worked fine. Eric offered to replace it next time." },
      { user: "Amy W.", avatar: "AW", rating: 5, date: "3 months ago", text: "Third time renting from Eric. Always reliable, always clean tools. Highly recommend!" },
    ],
    unavailableDates: [addDays(new Date(), 3), addDays(new Date(), 4), addDays(new Date(), 10), addDays(new Date(), 11), addDays(new Date(), 12)],
  },
  2: {
    id: 2, title: "Mountain Bike – Trek X-Caliber", owner: "Sarah L.", ownerAvatar: "SL",
    ownerJoined: "Jan 2024", ownerListings: 3, ownerResponseTime: "< 30 min",
    rating: 4.8, reviews: 24, price: 18, period: "day", deposit: 50, distance: 1.2,
    images: [
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop",
    ],
    verified: true, tags: ["21-speed", "Helmet included", "Lock included"],
    category: "Bikes & Scooters", available: true,
    description: "Trek X-Caliber 8 mountain bike in excellent condition. Perfect for trail riding or city commuting. Comes with a helmet (M/L) and a Kryptonite lock.",
    rules: ["Helmet must be worn", "Return by 8 PM", "Report any damage immediately"],
    includes: ["Trek X-Caliber 8 (Size L)", "Bell helmet (M/L)", "Kryptonite U-Lock", "Tire repair kit"],
    reviewsList: [
      { user: "Dan R.", avatar: "DR", rating: 5, date: "1 week ago", text: "Perfect bike for the trails! Sarah keeps it in great shape." },
      { user: "Kelly M.", avatar: "KM", rating: 5, date: "3 weeks ago", text: "Smooth ride, easy pickup. The included helmet and lock are a nice touch." },
      { user: "Tom H.", avatar: "TH", rating: 4, date: "1 month ago", text: "Great bike overall. Gears shifted smoothly. Would rent again." },
    ],
    unavailableDates: [addDays(new Date(), 1), addDays(new Date(), 5), addDays(new Date(), 6)],
  },
};

// Fallback for IDs not in the detailed map
const fallbackListing = (id: number) => ({
  id, title: "Item Not Found", owner: "Unknown", ownerAvatar: "??",
  ownerJoined: "N/A", ownerListings: 0, ownerResponseTime: "N/A",
  rating: 0, reviews: 0, price: 0, period: "day", deposit: 0, distance: 0,
  images: ["https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&h=600&fit=crop"],
  verified: false, tags: [], category: "Other", available: false,
  description: "This listing could not be found.", rules: [], includes: [],
  reviewsList: [], unavailableDates: [] as Date[],
});

const ListingDetail = () => {
  const { id } = useParams();
  const listingId = Number(id);
  const listing = listingsData[listingId] || fallbackListing(listingId);

  const [currentImage, setCurrentImage] = useState(0);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  const rentalDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  }, [startDate, endDate]);

  const totalPrice = useMemo(() => {
    if (listing.period === "weekend") return listing.price;
    return listing.price * rentalDays;
  }, [listing.price, listing.period, rentalDays]);

  const isDateUnavailable = (date: Date) => {
    return listing.unavailableDates.some(d => isSameDay(d, date)) || isBefore(date, new Date());
  };

  const nextImage = () => setCurrentImage((c) => (c + 1) % listing.images.length);
  const prevImage = () => setCurrentImage((c) => (c - 1 + listing.images.length) % listing.images.length);

  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    listing.reviewsList.forEach(r => { dist[r.rating - 1]++; });
    return dist.reverse(); // 5-star first
  }, [listing.reviewsList]);

  if (!listingsData[listingId]) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 pb-20 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Listing Not Found</h1>
          <p className="text-muted-foreground mb-6">This listing doesn't exist or has been removed.</p>
          <Link to="/search">
            <Button variant="hero">Back to Search</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 pb-16">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/search" className="hover:text-primary transition-colors">Search</Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate">{listing.title}</span>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left Column — Photos + Details */}
            <div className="lg:col-span-3 space-y-8">
              {/* Photo Gallery */}
              <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[4/3]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    src={listing.images[currentImage]}
                    alt={`${listing.title} - Photo ${currentImage + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {listing.images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors shadow-card">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors shadow-card">
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {listing.images.map((_, i) => (
                    <button key={i} onClick={() => setCurrentImage(i)}
                      className={cn("w-2 h-2 rounded-full transition-all", i === currentImage ? "bg-primary-foreground w-6" : "bg-primary-foreground/50")}
                    />
                  ))}
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {listing.verified && (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      <Shield size={12} /> Verified
                    </div>
                  )}
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-sm text-foreground text-xs font-semibold">
                    <MapPin size={12} /> {listing.distance} mi
                  </div>
                </div>

                <button onClick={() => setSaved(!saved)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors">
                  <Heart size={18} className={saved ? "fill-destructive text-destructive" : ""} />
                </button>
              </div>

              {/* Thumbnail strip */}
              {listing.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {listing.images.map((img, i) => (
                    <button key={i} onClick={() => setCurrentImage(i)}
                      className={cn("shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all",
                        i === currentImage ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}

              {/* Title & Meta */}
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Badge variant="outline" className="mb-2">{listing.category}</Badge>
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">{listing.title}</h1>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star size={18} className="fill-secondary text-secondary" />
                    <span className="font-display font-bold text-lg text-foreground">{listing.rating}</span>
                    <span className="text-muted-foreground text-sm">({listing.reviews})</span>
                  </div>
                </div>
                <p className="text-muted-foreground mt-3 leading-relaxed">{listing.description}</p>
              </div>

              <Separator />

              {/* What's Included */}
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Package size={18} className="text-primary" /> What's Included
                </h2>
                <div className="grid sm:grid-cols-2 gap-2">
                  {listing.includes.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Rental Rules */}
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-secondary" /> Rental Rules
                </h2>
                <div className="space-y-2">
                  {listing.rules.map((rule) => (
                    <div key={rule} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-secondary mt-0.5">•</span>
                      {rule}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Reviews Section */}
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Star size={18} className="text-secondary" /> Reviews ({listing.reviews})
                </h2>

                {/* Rating Summary */}
                <div className="flex items-start gap-8 mb-8 p-5 rounded-2xl bg-card border border-border">
                  <div className="text-center shrink-0">
                    <div className="font-display text-4xl font-bold text-foreground">{listing.rating}</div>
                    <div className="flex items-center gap-0.5 mt-1 justify-center">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={14} className={s <= Math.round(listing.rating) ? "fill-secondary text-secondary" : "text-muted"} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{listing.reviews} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {ratingDistribution.map((count, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="w-3 text-muted-foreground">{5 - i}</span>
                        <Star size={12} className="text-secondary fill-secondary shrink-0" />
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-secondary transition-all"
                            style={{ width: listing.reviewsList.length ? `${(count / listing.reviewsList.length) * 100}%` : "0%" }}
                          />
                        </div>
                        <span className="w-4 text-xs text-muted-foreground text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Cards */}
                <div className="space-y-5">
                  {listing.reviewsList.map((review, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-xl bg-card border border-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-display font-semibold text-primary">
                            {review.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{review.user}</p>
                            <p className="text-xs text-muted-foreground">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={12} className={s <= review.rating ? "fill-secondary text-secondary" : "text-muted"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-foreground/85 leading-relaxed">{review.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column — Booking Sidebar */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                {/* Price Card */}
                <div className="rounded-2xl bg-card border border-border shadow-card p-6">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-display text-3xl font-bold text-foreground">${listing.price}</span>
                    <span className="text-muted-foreground text-sm">/ {listing.period}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-5">+ ${listing.deposit} refundable deposit</p>

                  {/* Date Pickers */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("justify-start text-left font-normal h-12", !startDate && "text-muted-foreground")}>
                          <CalendarIcon size={14} className="mr-1.5 shrink-0" />
                          {startDate ? format(startDate, "MMM d") : "Start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={startDate} onSelect={(d) => { setStartDate(d); if (endDate && d && isAfter(d, endDate)) setEndDate(undefined); }}
                          disabled={isDateUnavailable} className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("justify-start text-left font-normal h-12", !endDate && "text-muted-foreground")}>
                          <CalendarIcon size={14} className="mr-1.5 shrink-0" />
                          {endDate ? format(endDate, "MMM d") : "End date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={endDate} onSelect={setEndDate}
                          disabled={(date) => isDateUnavailable(date) || (startDate ? isBefore(date, startDate) : false)}
                          className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Price Breakdown */}
                  {startDate && endDate && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-4 space-y-2 text-sm">
                      <div className="flex justify-between text-foreground">
                        <span>${listing.price} × {listing.period === "weekend" ? "1 weekend" : `${rentalDays} day${rentalDays > 1 ? "s" : ""}`}</span>
                        <span>${totalPrice}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Service fee</span>
                        <span>${Math.round(totalPrice * 0.12)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Refundable deposit</span>
                        <span>${listing.deposit}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-display font-bold text-foreground text-base">
                        <span>Total</span>
                        <span>${totalPrice + Math.round(totalPrice * 0.12) + listing.deposit}</span>
                      </div>
                    </motion.div>
                  )}

                  <Button variant="hero" size="lg" className="w-full" disabled={!startDate || !endDate}>
                    {startDate && endDate ? `Book for $${totalPrice + Math.round(totalPrice * 0.12) + listing.deposit}` : "Select dates to book"}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-3">You won't be charged yet</p>
                </div>

                {/* Message Owner */}
                <div className="rounded-2xl bg-card border border-border shadow-card p-6">
                  <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                    <MessageCircle size={16} className="text-primary" /> Message {listing.owner}
                  </h3>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Hi ${listing.owner.split(" ")[0]}, I'm interested in renting this...`}
                    className="mb-3 resize-none"
                    rows={3}
                  />
                  <Button variant="outline" className="w-full" disabled={!message.trim()}>
                    Send Message
                  </Button>
                </div>

                {/* Owner Card */}
                <div className="rounded-2xl bg-card border border-border shadow-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-display font-semibold text-primary">
                      {listing.ownerAvatar}
                    </div>
                    <div>
                      <p className="font-display font-semibold text-foreground flex items-center gap-1.5">
                        {listing.owner}
                        {listing.verified && <Shield size={14} className="text-primary" />}
                      </p>
                      <p className="text-xs text-muted-foreground">Joined {listing.ownerJoined}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2 rounded-lg bg-muted">
                      <p className="font-display font-bold text-foreground">{listing.ownerListings}</p>
                      <p className="text-xs text-muted-foreground">Listings</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted">
                      <p className="font-display font-bold text-foreground">{listing.rating}★</p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted">
                      <p className="font-display font-bold text-foreground text-xs mt-1">{listing.ownerResponseTime}</p>
                      <p className="text-xs text-muted-foreground">Response</p>
                    </div>
                  </div>
                </div>

                {/* Availability Calendar */}
                <div className="rounded-2xl bg-card border border-border shadow-card p-6">
                  <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CalendarIcon size={16} className="text-primary" /> Availability
                  </h3>
                  <Calendar
                    mode="single"
                    disabled={isDateUnavailable}
                    className="p-0 pointer-events-auto w-full"
                    classNames={{
                      months: "w-full",
                      month: "w-full space-y-4",
                      table: "w-full border-collapse",
                      head_row: "flex w-full",
                      head_cell: "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem]",
                      row: "flex w-full mt-2",
                      cell: "flex-1 h-9 text-center text-sm p-0 relative",
                      day: "h-9 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md",
                    }}
                  />
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/30" />
                      Available
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm bg-muted border border-border" />
                      Unavailable
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListingDetail;
