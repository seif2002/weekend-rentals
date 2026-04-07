import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  DollarSign, TrendingUp, CalendarCheck, Star, Clock,
  CheckCircle2, XCircle, MessageSquare, Briefcase, Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface WorkerProfile {
  id: string;
  title: string;
  hourly_rate: number;
  rating: number | null;
  total_jobs: number | null;
  total_reviews: number | null;
}

interface Booking {
  id: string;
  client_id: string;
  status: string | null;
  description: string | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
  estimated_hours: number | null;
  total_price: number | null;
  created_at: string | null;
  client_name?: string;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "outline" },
  accepted: { label: "Accepted", variant: "default" },
  declined: { label: "Declined", variant: "destructive" },
  completed: { label: "Completed", variant: "secondary" },
};

const WorkerDashboard = () => {
  const { user } = useAuth();
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      // Fetch worker profile
      const { data: w } = await supabase
        .from("workers")
        .select("id, title, hourly_rate, rating, total_jobs, total_reviews")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!w) {
        setLoading(false);
        return;
      }
      setWorker(w);

      // Fetch bookings
      const { data: b } = await supabase
        .from("worker_bookings")
        .select("*")
        .eq("worker_id", w.id)
        .order("created_at", { ascending: false });

      if (b) {
        // Fetch client names
        const clientIds = [...new Set(b.map((x) => x.client_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name")
          .in("id", clientIds);

        const nameMap = new Map(profiles?.map((p) => [p.id, p.display_name || "Unknown"]) || []);
        setBookings(b.map((x) => ({ ...x, client_name: nameMap.get(x.client_id) || "Unknown" })));
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const updateBookingStatus = async (bookingId: string, status: string) => {
    const { error } = await supabase
      .from("worker_bookings")
      .update({ status })
      .eq("id", bookingId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
    toast({ title: `Booking ${status}`, description: `The booking has been ${status}.` });
  };

  const filtered = bookings.filter((b) => {
    if (tab === "all") return true;
    return b.status === tab;
  });

  const totalEarnings = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center">
          <p className="text-muted-foreground">Please <Link to="/auth" className="text-primary underline">sign in</Link> to access your worker dashboard.</p>
        </div>
      </div>
    );
  }

  if (!loading && !worker) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center space-y-4">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No Worker Profile Found</h2>
          <p className="text-muted-foreground">You need to sign up as a worker first.</p>
          <Button asChild variant="hero">
            <Link to="/worker-signup">Become a Worker</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold mb-2">Worker Dashboard</h1>
          <p className="text-muted-foreground mb-8">{worker?.title}</p>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><DollarSign className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><CalendarCheck className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed Jobs</p>
                    <p className="text-2xl font-bold">{completedCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/50"><Clock className="h-5 w-5 text-accent-foreground" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Requests</p>
                    <p className="text-2xl font-bold">{pendingCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><Star className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="text-2xl font-bold">{worker?.rating ?? "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bookings Table */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Requests</CardTitle>
              <CardDescription>Manage incoming and past bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
                  <TabsTrigger value="accepted">Accepted</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="declined">Declined</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>

                <div className="overflow-x-auto">
                  {loading ? (
                    <p className="text-center py-8 text-muted-foreground">Loading...</p>
                  ) : filtered.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No bookings found.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Hours</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.map((b) => {
                          const cfg = statusConfig[b.status || "pending"];
                          return (
                            <TableRow key={b.id}>
                              <TableCell className="font-medium">{b.client_name}</TableCell>
                              <TableCell className="max-w-[200px] truncate">{b.description || "—"}</TableCell>
                              <TableCell>{b.scheduled_date || "TBD"}{b.scheduled_time ? ` ${b.scheduled_time}` : ""}</TableCell>
                              <TableCell>{b.estimated_hours ?? "—"}</TableCell>
                              <TableCell>${Number(b.total_price || 0).toFixed(2)}</TableCell>
                              <TableCell><Badge variant={cfg.variant}>{cfg.label}</Badge></TableCell>
                              <TableCell className="text-right">
                                {b.status === "pending" && (
                                  <div className="flex gap-2 justify-end">
                                    <Button size="sm" onClick={() => updateBookingStatus(b.id, "accepted")}>
                                      <CheckCircle2 className="h-4 w-4 mr-1" /> Accept
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => updateBookingStatus(b.id, "declined")}>
                                      <XCircle className="h-4 w-4 mr-1" /> Decline
                                    </Button>
                                  </div>
                                )}
                                {b.status === "accepted" && (
                                  <Button size="sm" variant="secondary" onClick={() => updateBookingStatus(b.id, "completed")}>
                                    Mark Complete
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
