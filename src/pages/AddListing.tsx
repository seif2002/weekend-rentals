import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Camera, DollarSign, CalendarDays, ShieldCheck, ChevronRight, ChevronLeft,
  Plus, X, Upload, Info, Check, Sparkles, Clock, MapPin, Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CATEGORIES = [
  "Tools", "Cameras & Photography", "Bikes & Scooters", "Camping & Outdoors",
  "Party & Events", "Sports Equipment", "Electronics", "Musical Instruments",
  "Home & Garden", "Baby & Kids", "Vehicles", "Other"
];

const RULES_PRESETS = [
  "No smoking around items",
  "Return cleaned / wiped down",
  "Keep away from rain / water",
  "Do not modify or disassemble",
  "Adult supervision required",
  "Return with same fuel level",
  "Use protective gear included",
  "Keep receipts for any consumables used",
];

const STEPS = [
  { label: "Details", icon: Tag },
  { label: "Photos", icon: Camera },
  { label: "Pricing", icon: DollarSign },
  { label: "Availability", icon: CalendarDays },
  { label: "Rules", icon: ShieldCheck },
];

const stepAnim = {
  initial: { opacity: 0, x: 40, filter: "blur(6px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: { opacity: 0, x: -40, filter: "blur(6px)" },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
};

const AddListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Step 1 – Details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [includedItems, setIncludedItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");

  // Step 2 – Photos
  const [photos, setPhotos] = useState<{ url: string; name: string }[]>([]);

  // Step 3 – Pricing
  const [priceDaily, setPriceDaily] = useState("");
  const [priceWeekend, setPriceWeekend] = useState("");
  const [priceWeekly, setPriceWeekly] = useState("");
  const [deposit, setDeposit] = useState("");
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState("");
  const [deliveryRadius, setDeliveryRadius] = useState([5]);

  // Step 4 – Availability
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [minRentalDays, setMinRentalDays] = useState("1");
  const [maxRentalDays, setMaxRentalDays] = useState("14");
  const [instantBook, setInstantBook] = useState(true);

  // Step 5 – Rules
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [customRule, setCustomRule] = useState("");
  const [lateFee, setLateFee] = useState("");
  const [requireVerification, setRequireVerification] = useState(false);

  const addIncludedItem = () => {
    if (newItem.trim() && !includedItems.includes(newItem.trim())) {
      setIncludedItems([...includedItems, newItem.trim()]);
      setNewItem("");
    }
  };

  const addPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;
    for (let i = 0; i < files.length && photos.length + i < 8; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop();
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from('listings').upload(path, file);
      if (error) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }
      const { data: urlData } = supabase.storage.from('listings').getPublicUrl(path);
      setPhotos((prev) => [...prev, { url: urlData.publicUrl, name: file.name }]);
    }
    e.target.value = '';
  };

  const toggleRule = (rule: string) => {
    setSelectedRules((prev) =>
      prev.includes(rule) ? prev.filter((r) => r !== rule) : [...prev, rule]
    );
  };

  const addCustomRule = () => {
    if (customRule.trim() && !selectedRules.includes(customRule.trim())) {
      setSelectedRules([...selectedRules, customRule.trim()]);
      setCustomRule("");
    }
  };

  const canAdvance = useCallback(() => {
    switch (step) {
      case 0: return title.trim() && category && condition && location.trim();
      case 1: return photos.length >= 1;
      case 2: return priceDaily.trim();
      case 3: return true;
      case 4: return true;
      default: return true;
    }
  }, [step, title, category, condition, location, photos, priceDaily]);

  const handleSubmit = () => {
    toast.success("Listing created successfully!", {
      description: `"${title}" is now live and visible to renters nearby.`,
    });
    navigate("/dashboard");
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Create a New Listing</h1>
              <p className="text-muted-foreground text-sm mt-1">Fill in the details to start earning from your gear.</p>
            </div>

            {/* Step indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const done = i < step;
                  const active = i === step;
                  return (
                    <button
                      key={s.label}
                      onClick={() => i < step && setStep(i)}
                      className={`flex flex-col items-center gap-1.5 transition-all duration-200 ${
                        active ? "text-primary" : done ? "text-primary/70 cursor-pointer" : "text-muted-foreground/40"
                      }`}
                      disabled={i > step}
                    >
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        active ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]" :
                        done ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground/40"
                      }`}>
                        {done ? <Check size={18} /> : <Icon size={18} />}
                      </div>
                      <span className="text-[11px] font-medium hidden sm:block">{s.label}</span>
                    </button>
                  );
                })}
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>

            {/* Form body */}
            <div className="bg-card border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div key={step} {...stepAnim} className="p-6 md:p-8">
                  {/* Step 0: Details */}
                  {step === 0 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-semibold">Listing Title *</Label>
                        <Input id="title" placeholder='e.g. "Weekend DIY Tool Kit"' value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
                        <p className="text-xs text-muted-foreground">{title.length}/80 characters</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="desc" className="text-sm font-semibold">Description</Label>
                        <Textarea id="desc" placeholder="Describe your item, what's included, and any tips for use..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} maxLength={1000} />
                        <p className="text-xs text-muted-foreground">{description.length}/1000 characters</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Category *</Label>
                          <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Condition *</Label>
                          <Select value={condition} onValueChange={setCondition}>
                            <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">Like New</SelectItem>
                              <SelectItem value="excellent">Excellent</SelectItem>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="fair">Fair</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-semibold flex items-center gap-1.5">
                          <MapPin size={14} /> Pickup Location *
                        </Label>
                        <Input id="location" placeholder="Neighborhood or zip code" value={location} onChange={(e) => setLocation(e.target.value)} />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">What's Included</Label>
                        <div className="flex gap-2">
                          <Input placeholder="e.g. Circular Saw" value={newItem} onChange={(e) => setNewItem(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addIncludedItem())} />
                          <Button type="button" variant="outline" size="icon" onClick={addIncludedItem} className="shrink-0"><Plus size={16} /></Button>
                        </div>
                        {includedItems.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {includedItems.map((item) => (
                              <Badge key={item} variant="secondary" className="gap-1 pr-1.5">
                                {item}
                                <button onClick={() => setIncludedItems(includedItems.filter((i) => i !== item))} className="hover:text-destructive transition-colors">
                                  <X size={12} />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 1: Photos */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-display font-semibold text-foreground">Add Photos</h2>
                        <p className="text-sm text-muted-foreground mt-1">Upload up to 8 photos. The first photo will be your cover image.</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {photos.map((photo, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-border"
                          >
                            <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                            {idx === 0 && (
                              <span className="absolute top-1.5 left-1.5 text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-md">
                                Cover
                              </span>
                            )}
                            <button
                              onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                              className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-foreground/70 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                            >
                              <X size={12} />
                            </button>
                          </motion.div>
                        ))}
                        {photos.length < 8 && (
                          <button
                            onClick={addPhoto}
                            className="aspect-[4/3] rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent/30 transition-all flex flex-col items-center justify-center gap-2 text-muted-foreground active:scale-[0.97]"
                          >
                            <Upload size={22} />
                            <span className="text-xs font-medium">Add Photo</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/30 border border-accent">
                        <Info size={16} className="text-accent-foreground shrink-0 mt-0.5" />
                        <p className="text-xs text-accent-foreground">
                          Well-lit photos from multiple angles increase your bookings by up to 3×. Show any wear or damage for transparency.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Pricing */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-display font-semibold text-foreground">Set Your Pricing</h2>
                        <p className="text-sm text-muted-foreground mt-1">Competitive pricing gets you booked faster.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Daily Rate *</Label>
                          <div className="relative">
                            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input className="pl-8" placeholder="25" value={priceDaily} onChange={(e) => setPriceDaily(e.target.value.replace(/[^0-9.]/g, ""))} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Weekend Rate</Label>
                          <div className="relative">
                            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input className="pl-8" placeholder="40" value={priceWeekend} onChange={(e) => setPriceWeekend(e.target.value.replace(/[^0-9.]/g, ""))} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Weekly Rate</Label>
                          <div className="relative">
                            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input className="pl-8" placeholder="120" value={priceWeekly} onChange={(e) => setPriceWeekly(e.target.value.replace(/[^0-9.]/g, ""))} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Refundable Deposit</Label>
                        <div className="relative max-w-[200px]">
                          <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input className="pl-8" placeholder="30" value={deposit} onChange={(e) => setDeposit(e.target.value.replace(/[^0-9.]/g, ""))} />
                        </div>
                        <p className="text-xs text-muted-foreground">Automatically refunded when the item is returned in good condition.</p>
                      </div>

                      {priceDaily && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="p-4 rounded-lg bg-accent/30 border border-accent"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={14} className="text-accent-foreground" />
                            <span className="text-sm font-semibold text-accent-foreground">Smart Pricing Insight</span>
                          </div>
                          <p className="text-xs text-accent-foreground">
                            Similar items in your area rent for $20–$35/day. Your rate of ${priceDaily}/day is {
                              Number(priceDaily) < 20 ? "below average — great for visibility!" :
                              Number(priceDaily) > 35 ? "above average — consider lowering for more bookings." :
                              "competitive — nice choice!"
                            }
                          </p>
                        </motion.div>
                      )}

                      <div className="border-t border-border pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-semibold">Delivery Available</Label>
                            <p className="text-xs text-muted-foreground">You drop off and pick up the item</p>
                          </div>
                          <Switch checked={deliveryAvailable} onCheckedChange={setDeliveryAvailable} />
                        </div>
                        {deliveryAvailable && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pl-0 sm:pl-4">
                            <div className="space-y-2 max-w-[200px]">
                              <Label className="text-sm font-medium">Delivery Fee</Label>
                              <div className="relative">
                                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input className="pl-8" placeholder="5" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value.replace(/[^0-9.]/g, ""))} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Delivery Radius: {deliveryRadius[0]} miles</Label>
                              <Slider value={deliveryRadius} onValueChange={setDeliveryRadius} min={1} max={25} step={1} className="max-w-[300px]" />
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Availability */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-display font-semibold text-foreground">Set Availability</h2>
                        <p className="text-sm text-muted-foreground mt-1">Select the dates your item is available for rent. Click dates to toggle.</p>
                      </div>

                      <div className="flex justify-center">
                        <Calendar
                          mode="multiple"
                          selected={availableDates}
                          onSelect={(dates) => setAvailableDates(dates || [])}
                          disabled={(date) => date < new Date()}
                          numberOfMonths={2}
                          className="rounded-xl border border-border p-3 pointer-events-auto"
                        />
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground justify-center">
                        <span className="flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded bg-primary" /> Available
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded bg-muted" /> Unavailable
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold flex items-center gap-1.5">
                            <Clock size={14} /> Min Rental Period
                          </Label>
                          <Select value={minRentalDays} onValueChange={setMinRentalDays}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {["1", "2", "3", "5", "7"].map((d) => (
                                <SelectItem key={d} value={d}>{d} day{d !== "1" ? "s" : ""}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold flex items-center gap-1.5">
                            <Clock size={14} /> Max Rental Period
                          </Label>
                          <Select value={maxRentalDays} onValueChange={setMaxRentalDays}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {["3", "7", "14", "30", "60"].map((d) => (
                                <SelectItem key={d} value={d}>{d} days</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div>
                          <Label className="text-sm font-semibold">Instant Booking</Label>
                          <p className="text-xs text-muted-foreground mt-0.5">Renters can book without waiting for your approval</p>
                        </div>
                        <Switch checked={instantBook} onCheckedChange={setInstantBook} />
                      </div>
                    </div>
                  )}

                  {/* Step 4: Rules */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-display font-semibold text-foreground">Rental Rules & Policies</h2>
                        <p className="text-sm text-muted-foreground mt-1">Set expectations so renters know what to follow.</p>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">Common Rules</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {RULES_PRESETS.map((rule) => (
                            <label
                              key={rule}
                              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150 active:scale-[0.98] ${
                                selectedRules.includes(rule) ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 hover:bg-accent/20"
                              }`}
                            >
                              <Checkbox
                                checked={selectedRules.includes(rule)}
                                onCheckedChange={() => toggleRule(rule)}
                              />
                              <span className="text-sm text-foreground">{rule}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Add Custom Rule</Label>
                        <div className="flex gap-2">
                          <Input placeholder="e.g. Must return by 9 AM" value={customRule} onChange={(e) => setCustomRule(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomRule())} />
                          <Button type="button" variant="outline" size="icon" onClick={addCustomRule} className="shrink-0"><Plus size={16} /></Button>
                        </div>
                        {selectedRules.filter((r) => !RULES_PRESETS.includes(r)).length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedRules.filter((r) => !RULES_PRESETS.includes(r)).map((rule) => (
                              <Badge key={rule} variant="secondary" className="gap-1 pr-1.5">
                                {rule}
                                <button onClick={() => setSelectedRules(selectedRules.filter((r) => r !== rule))} className="hover:text-destructive transition-colors">
                                  <X size={12} />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 max-w-[200px]">
                        <Label className="text-sm font-semibold">Late Return Fee (per day)</Label>
                        <div className="relative">
                          <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input className="pl-8" placeholder="10" value={lateFee} onChange={(e) => setLateFee(e.target.value.replace(/[^0-9.]/g, ""))} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div>
                          <Label className="text-sm font-semibold">Require Verified ID</Label>
                          <p className="text-xs text-muted-foreground mt-0.5">Only verified renters can book this item</p>
                        </div>
                        <Switch checked={requireVerification} onCheckedChange={setRequireVerification} />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between p-6 md:px-8 border-t border-border bg-muted/20">
                <Button
                  variant="ghost"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 0}
                  className="gap-1.5"
                >
                  <ChevronLeft size={16} /> Back
                </Button>

                {step < STEPS.length - 1 ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={!canAdvance()}
                    className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Continue <ChevronRight size={16} />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Check size={16} /> Publish Listing
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddListing;
