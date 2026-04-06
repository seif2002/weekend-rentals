import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Star, MapPin, Wrench, Filter, MessageCircle } from "lucide-react";

type Worker = {
  id: string;
  user_id: string;
  title: string;
  skills: string[];
  hourly_rate: number;
  bio: string | null;
  location: string | null;
  rating: number;
  total_reviews: number;
  total_jobs: number;
  worker_type: string;
  availability: string;
  certifications: string[];
  portfolio_urls: string[];
};

const BrowseWorkers = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [maxRate, setMaxRate] = useState(200);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("workers")
        .select("*")
        .eq("availability", "available")
        .order("rating", { ascending: false });
      if (!error && data) setWorkers(data as Worker[]);
      setLoading(false);
    };
    fetchWorkers();
  }, []);

  const filtered = workers.filter(w => {
    const matchesSearch = search === "" ||
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.skills.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
      (w.location?.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === "all" || w.worker_type === typeFilter || w.worker_type === "both";
    const matchesRate = w.hourly_rate <= maxRate;
    return matchesSearch && matchesType && matchesRate;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold mb-2">Find Workers</h1>
          <p className="text-muted-foreground text-lg">Browse skilled professionals and general helpers near you</p>
        </div>

        {/* Search & Filters */}
        <div className="max-w-3xl mx-auto mb-8 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input className="pl-10" placeholder="Search by skill, title, or location..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter size={16} className="mr-2" /> Filters
            </Button>
            <Button variant="hero" asChild>
              <a href="/worker-signup">Become a Worker</a>
            </Button>
          </div>

          {showFilters && (
            <Card>
              <CardContent className="pt-4 flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Worker Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="skilled">Skilled Trade</SelectItem>
                      <SelectItem value="general">General Helper</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Max Rate: ${maxRate}/hr</label>
                  <Slider value={[maxRate]} onValueChange={v => setMaxRate(v[0])} max={300} min={5} step={5} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2"><div className="h-4 bg-muted rounded w-2/3" /><div className="h-3 bg-muted rounded w-1/2" /></div>
                  </div>
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Wrench className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-display font-semibold mb-2">No workers found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(worker => (
              <a key={worker.id} href={`/worker/${worker.id}`} className="block group">
                <Card className="h-full transition-all hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {worker.title.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{worker.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {worker.location && (
                            <span className="flex items-center gap-0.5 truncate"><MapPin size={12} /> {worker.location}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-lg font-bold text-primary">${worker.hourly_rate}</span>
                        <span className="text-xs text-muted-foreground block">/hr</span>
                      </div>
                    </div>

                    {worker.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{worker.bio}</p>
                    )}

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {worker.skills.slice(0, 4).map((s, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                      {worker.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">+{worker.skills.length - 4}</Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-secondary text-secondary" />
                        <span className="font-medium">{worker.rating > 0 ? worker.rating.toFixed(1) : "New"}</span>
                        {worker.total_reviews > 0 && (
                          <span className="text-muted-foreground">({worker.total_reviews})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Wrench size={14} /> {worker.total_jobs} jobs
                      </div>
                      {worker.certifications.length > 0 && (
                        <Badge variant="outline" className="text-xs text-primary border-primary/30">Certified</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BrowseWorkers;
