import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Star, MapPin, Wrench, Shield, ExternalLink, MessageCircle, Calendar, Clock, ArrowLeft, CheckCircle2 } from "lucide-react";

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

const WorkerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Booking form
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");

  useEffect(() => {
    const fetchWorker = async () => {
      if (!id) return;
      const { data, error } = await supabase.from("workers").select("*").eq("id", id).single();
      if (!error && data) setWorker(data as Worker);
      setLoading(false);
    };
    fetchWorker();
  }, [id]);

  const totalPrice = worker && estimatedHours ? (worker.hourly_rate * parseFloat(estimatedHours)).toFixed(2) : "0.00";

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to book a worker");
      navigate("/auth");
      return;
    }
    if (!worker) return;
    setBookingLoading(true);
    const { error } = await supabase.from("worker_bookings").insert({
      worker_id: worker.id,
      client_id: user.id,
      description,
      scheduled_date: scheduledDate,
      scheduled_time: scheduledTime,
      estimated_hours: parseFloat(estimatedHours),
      total_price: parseFloat(totalPrice),
      status: "pending",
    });
    setBookingLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Booking request sent! The worker will review it shortly.");
      setBookingOpen(false);
      setDescription("");
      setScheduledDate("");
      setScheduledTime("");
      setEstimatedHours("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 max-w-4xl animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-48 bg-muted rounded-xl" />
          <div className="h-32 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 text-center">
          <h1 className="text-2xl font-display font-bold mb-2">Worker not found</h1>
          <Button variant="hero" onClick={() => navigate("/workers")}>Browse Workers</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const isOwnProfile = user?.id === worker.user_id;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-4xl">
        <button onClick={() => navigate("/workers")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={16} /> Back to Workers
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      {worker.title.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-2xl font-display font-bold">{worker.title}</h1>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                      {worker.location && (
                        <span className="flex items-center gap-1"><MapPin size={14} /> {worker.location}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star size={14} className="fill-secondary text-secondary" />
                        {worker.rating > 0 ? worker.rating.toFixed(1) : "New"} ({worker.total_reviews} reviews)
                      </span>
                      <span className="flex items-center gap-1"><Wrench size={14} /> {worker.total_jobs} jobs completed</span>
                    </div>
                    <Badge className="mt-2" variant={worker.worker_type === "skilled" ? "default" : "secondary"}>
                      {worker.worker_type === "skilled" ? "Skilled Trade" : worker.worker_type === "both" ? "Skilled & General" : "General Helper"}
                    </Badge>
                  </div>
                </div>

                {worker.bio && (
                  <div>
                    <h3 className="font-semibold mb-1">About</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{worker.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Skills</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {worker.skills.map((s, i) => (
                    <Badge key={i} variant="secondary" className="text-sm py-1 px-3">{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            {worker.certifications.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Shield size={18} /> Certifications</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {worker.certifications.map((c, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 size={16} className="text-primary" /> {c}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Portfolio */}
            {worker.portfolio_urls.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-lg">Portfolio</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {worker.portfolio_urls.map((u, i) => (
                      <li key={i}>
                        <a href={u} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                          <ExternalLink size={14} /> {u}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Booking */}
          <div className="space-y-4">
            <Card className="sticky top-24">
              <CardContent className="pt-6 space-y-4">
                <div className="text-center">
                  <span className="text-3xl font-bold text-primary">${worker.hourly_rate}</span>
                  <span className="text-muted-foreground">/hr</span>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${worker.availability === "available" ? "bg-green-500" : "bg-muted-foreground"}`} />
                  <span className="text-sm capitalize">{worker.availability}</span>
                </div>

                {!isOwnProfile && (
                  <>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/messages">
                        <MessageCircle size={16} className="mr-2" /> Chat First
                      </a>
                    </Button>

                    <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
                      <DialogTrigger asChild>
                        <Button variant="hero" className="w-full">
                          <Calendar size={16} className="mr-2" /> Book Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="font-display">Book {worker.title}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleBooking} className="space-y-4">
                          <div className="space-y-2">
                            <Label>What do you need done?</Label>
                            <Textarea value={description} onChange={e => setDescription(e.target.value)} required placeholder="Describe the job or task..." rows={3} />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label>Date</Label>
                              <Input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} required min={new Date().toISOString().split("T")[0]} />
                            </div>
                            <div className="space-y-2">
                              <Label>Time</Label>
                              <Input type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} required />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Estimated Hours</Label>
                            <Input type="number" min="0.5" step="0.5" value={estimatedHours} onChange={e => setEstimatedHours(e.target.value)} required placeholder="e.g. 3" />
                          </div>
                          {estimatedHours && (
                            <div className="bg-accent/50 rounded-lg p-3 text-sm">
                              <div className="flex justify-between"><span>Rate</span><span>${worker.hourly_rate}/hr</span></div>
                              <div className="flex justify-between"><span>Hours</span><span>{estimatedHours} hrs</span></div>
                              <div className="flex justify-between font-bold mt-1 pt-1 border-t border-border">
                                <span>Estimated Total</span><span>${totalPrice}</span>
                              </div>
                            </div>
                          )}
                          <Button type="submit" variant="hero" className="w-full" disabled={bookingLoading}>
                            {bookingLoading ? "Sending Request..." : "Send Booking Request"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </>
                )}

                {isOwnProfile && (
                  <p className="text-sm text-center text-muted-foreground">This is your worker profile</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WorkerDetail;
