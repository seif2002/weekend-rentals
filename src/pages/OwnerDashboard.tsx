import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  DollarSign, TrendingUp, Package, CalendarCheck, Star, Eye, MoreVertical,
  Plus, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle, MessageSquare,
  ChevronRight, BarChart3, Wallet, Settings, Bell, ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

/* ------------------------------------------------------------------ */
/*  Mock data                                                         */
/* ------------------------------------------------------------------ */

const earningsData = {
  totalEarnings: 2847,
  thisMonth: 486,
  lastMonth: 392,
  pendingPayout: 128,
  completedRentals: 47,
  activeListings: 8,
  averageRating: 4.9,
  totalReviews: 34,
  monthlyBreakdown: [
    { month: "Oct", amount: 310 },
    { month: "Nov", amount: 425 },
    { month: "Dec", amount: 520 },
    { month: "Jan", amount: 392 },
    { month: "Feb", amount: 486 },
    { month: "Mar", amount: 128 },
  ],
};

const listings = [
  { id: 1, title: "Weekend DIY Tool Kit", category: "Tools", price: 25, period: "weekend", views: 142, bookings: 12, rating: 4.9, status: "active", image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=120&h=80&fit=crop" },
  { id: 2, title: "Mountain Bike – Trek Marlin 7", category: "Bikes", price: 35, period: "day", views: 98, bookings: 8, rating: 4.8, status: "active", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=120&h=80&fit=crop" },
  { id: 3, title: "Canon EOS R6 Camera Kit", category: "Electronics", price: 60, period: "day", views: 210, bookings: 15, rating: 5.0, status: "active", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=120&h=80&fit=crop" },
  { id: 4, title: "Camping Tent – 4 Person", category: "Outdoor", price: 20, period: "day", views: 76, bookings: 5, rating: 4.7, status: "paused", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=120&h=80&fit=crop" },
  { id: 5, title: "Pressure Washer – Karcher K5", category: "Tools", price: 30, period: "day", views: 65, bookings: 4, rating: 4.6, status: "active", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=120&h=80&fit=crop" },
  { id: 6, title: "Stand-Up Paddleboard", category: "Outdoor", price: 40, period: "day", views: 134, bookings: 9, rating: 4.9, status: "active", image: "https://images.unsplash.com/photo-1526290439512-472695bfa095?w=120&h=80&fit=crop" },
];

const bookings = [
  { id: "BK-2847", renter: "Emma Wilson", item: "Weekend DIY Tool Kit", dates: "Mar 14 – Mar 17", amount: 75, status: "active", avatar: "EW" },
  { id: "BK-2846", renter: "James Chen", item: "Canon EOS R6 Camera Kit", dates: "Mar 18 – Mar 20", amount: 180, status: "upcoming", avatar: "JC" },
  { id: "BK-2845", renter: "Sarah Miller", item: "Mountain Bike – Trek Marlin 7", dates: "Mar 22 – Mar 23", amount: 70, status: "upcoming", avatar: "SM" },
  { id: "BK-2844", renter: "Alex Kumar", item: "Stand-Up Paddleboard", dates: "Mar 10 – Mar 12", amount: 120, status: "completed", avatar: "AK" },
  { id: "BK-2843", renter: "Mia Rodriguez", item: "Weekend DIY Tool Kit", dates: "Mar 7 – Mar 9", amount: 75, status: "completed", avatar: "MR" },
  { id: "BK-2842", renter: "David Park", item: "Pressure Washer – Karcher K5", dates: "Mar 5 – Mar 6", amount: 60, status: "completed", avatar: "DP" },
  { id: "BK-2841", renter: "Olivia Brown", item: "Camping Tent – 4 Person", dates: "Feb 28 – Mar 3", amount: 80, status: "disputed", avatar: "OB" },
];

const recentActivity = [
  { type: "booking", message: "New booking from James Chen for Canon EOS R6", time: "2h ago" },
  { type: "review", message: "Emma Wilson left a 5★ review on DIY Tool Kit", time: "5h ago" },
  { type: "payout", message: "$120.00 payout processed to your bank account", time: "1d ago" },
  { type: "message", message: "Sarah Miller: 'Can I pick up the bike at 3pm?'", time: "1d ago" },
  { type: "booking", message: "Rental completed: Alex Kumar returned SUP board", time: "2d ago" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-primary/10 text-primary border-primary/20" },
  upcoming: { label: "Upcoming", className: "bg-secondary/10 text-secondary border-secondary/20" },
  completed: { label: "Completed", className: "bg-muted text-muted-foreground border-border" },
  disputed: { label: "Disputed", className: "bg-destructive/10 text-destructive border-destructive/20" },
  paused: { label: "Paused", className: "bg-muted text-muted-foreground border-border" },
};

const activityIcons: Record<string, React.ReactNode> = {
  booking: <CalendarCheck className="h-4 w-4 text-primary" />,
  review: <Star className="h-4 w-4 text-secondary" />,
  payout: <DollarSign className="h-4 w-4 text-primary" />,
  message: <MessageSquare className="h-4 w-4 text-muted-foreground" />,
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const OwnerDashboard = () => {
  const [bookingFilter, setBookingFilter] = useState("all");
  const [period, setPeriod] = useState("this-month");

  const monthChange = ((earningsData.thisMonth - earningsData.lastMonth) / earningsData.lastMonth * 100).toFixed(1);
  const isPositive = earningsData.thisMonth >= earningsData.lastMonth;

  const filteredBookings = bookingFilter === "all"
    ? bookings
    : bookings.filter((b) => b.status === bookingFilter);

  const maxBar = Math.max(...earningsData.monthlyBreakdown.map((m) => m.amount));

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-display text-2xl font-bold text-gradient-primary">Rentzy</Link>
            <span className="hidden sm:inline text-sm text-muted-foreground">/</span>
            <span className="hidden sm:inline text-sm font-medium text-foreground">Owner Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-secondary" />
            </Button>
            <Button variant="ghost" size="icon"><Settings className="h-5 w-5" /></Button>
            <div className="h-9 w-9 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-display text-sm font-semibold">E</div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Greeting + actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Welcome back, Eric 👋</h1>
            <p className="text-muted-foreground mt-1">Here's how your rentals are performing.</p>
          </div>
          <div className="flex gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="3-months">Last 3 Months</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="hero" className="gap-2"><Plus className="h-4 w-4" /> Add Listing</Button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Earnings", value: `$${earningsData.totalEarnings.toLocaleString()}`, icon: DollarSign, change: `+${monthChange}%`, positive: isPositive, sub: "lifetime" },
            { label: "This Month", value: `$${earningsData.thisMonth}`, icon: TrendingUp, change: isPositive ? `+$${earningsData.thisMonth - earningsData.lastMonth}` : `-$${earningsData.lastMonth - earningsData.thisMonth}`, positive: isPositive, sub: "vs last month" },
            { label: "Active Listings", value: earningsData.activeListings.toString(), icon: Package, change: `${earningsData.completedRentals} rentals`, positive: true, sub: "total completed" },
            { label: "Avg Rating", value: earningsData.averageRating.toFixed(1), icon: Star, change: `${earningsData.totalReviews} reviews`, positive: true, sub: "from renters" },
          ].map((kpi, i) => (
            <motion.div key={kpi.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
              <Card className="shadow-card hover:shadow-elevated transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-muted-foreground">{kpi.label}</span>
                    <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
                      <kpi.icon className="h-4 w-4 text-accent-foreground" />
                    </div>
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground">{kpi.value}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {kpi.positive
                      ? <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
                      : <ArrowDownRight className="h-3.5 w-3.5 text-destructive" />}
                    <span className={`text-xs font-medium ${kpi.positive ? "text-primary" : "text-destructive"}`}>{kpi.change}</span>
                    <span className="text-xs text-muted-foreground">{kpi.sub}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Earnings chart + activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div className="lg:col-span-2" custom={4} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="shadow-card h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Earnings Overview</CardTitle>
                    <CardDescription>Monthly rental income</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">${earningsData.pendingPayout}</span>
                    <span className="text-xs text-muted-foreground">pending</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-3 h-48 mt-4">
                  {earningsData.monthlyBreakdown.map((m, i) => (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs font-medium text-foreground">${m.amount}</span>
                      <motion.div
                        className="w-full rounded-t-md bg-gradient-hero"
                        initial={{ height: 0 }}
                        animate={{ height: `${(m.amount / maxBar) * 100}%` }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                      />
                      <span className="text-xs text-muted-foreground">{m.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="shadow-card h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="mt-0.5 h-8 w-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                      {activityIcons[a.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-snug line-clamp-2">{a.message}</p>
                      <span className="text-xs text-muted-foreground">{a.time}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Active Listings */}
        <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}>
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">Your Listings</CardTitle>
                  <CardDescription>{listings.filter((l) => l.status === "active").length} active · {listings.filter((l) => l.status === "paused").length} paused</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2"><BarChart3 className="h-4 w-4" /> Performance</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="group flex gap-4 p-3 rounded-lg border border-border hover:border-primary/30 hover:shadow-card transition-all"
                  >
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-20 h-16 rounded-md object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-foreground truncate">{listing.title}</h4>
                        <Badge variant="outline" className={`text-[10px] shrink-0 ${statusConfig[listing.status].className}`}>
                          {statusConfig[listing.status].label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">${listing.price}/{listing.period} · {listing.category}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {listing.views}</span>
                        <span className="flex items-center gap-1"><CalendarCheck className="h-3 w-3" /> {listing.bookings}</span>
                        <span className="flex items-center gap-1"><Star className="h-3 w-3 text-secondary" /> {listing.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Booking Management */}
        <motion.div custom={7} initial="hidden" animate="visible" variants={fadeUp}>
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">Booking Management</CardTitle>
                  <CardDescription>Track and manage your rental bookings</CardDescription>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["all", "active", "upcoming", "completed", "disputed"].map((f) => (
                    <Button
                      key={f}
                      variant={bookingFilter === f ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBookingFilter(f)}
                      className="capitalize text-xs"
                    >
                      {f}
                      {f !== "all" && (
                        <span className="ml-1 text-[10px] opacity-70">
                          ({bookings.filter((b) => b.status === f).length})
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Desktop table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking</TableHead>
                      <TableHead>Renter</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">{b.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-accent flex items-center justify-center text-[10px] font-semibold text-accent-foreground">{b.avatar}</div>
                            <span className="text-sm font-medium">{b.renter}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm max-w-[180px] truncate">{b.item}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{b.dates}</TableCell>
                        <TableCell className="font-semibold">${b.amount}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] ${statusConfig[b.status].className}`}>
                            {statusConfig[b.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {b.status === "upcoming" && (
                              <>
                                <Button variant="ghost" size="icon" className="h-7 w-7"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7"><XCircle className="h-3.5 w-3.5 text-destructive" /></Button>
                              </>
                            )}
                            {b.status === "active" && (
                              <Button variant="ghost" size="icon" className="h-7 w-7"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /></Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-7 w-7"><MessageSquare className="h-3.5 w-3.5" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {filteredBookings.map((b) => (
                  <div key={b.id} className="p-4 rounded-lg border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground">{b.avatar}</div>
                        <div>
                          <p className="text-sm font-semibold">{b.renter}</p>
                          <p className="text-xs text-muted-foreground font-mono">{b.id}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-[10px] ${statusConfig[b.status].className}`}>
                        {statusConfig[b.status].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">{b.item}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {b.dates}</span>
                      <span className="font-display font-bold">${b.amount}</span>
                    </div>
                    <div className="flex gap-2">
                      {b.status === "upcoming" && (
                        <>
                          <Button variant="default" size="sm" className="flex-1 gap-1 text-xs"><CheckCircle2 className="h-3.5 w-3.5" /> Approve</Button>
                          <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs"><XCircle className="h-3.5 w-3.5" /> Decline</Button>
                        </>
                      )}
                      {b.status === "active" && (
                        <Button variant="default" size="sm" className="flex-1 gap-1 text-xs"><CheckCircle2 className="h-3.5 w-3.5" /> Mark Returned</Button>
                      )}
                      <Button variant="ghost" size="sm" className="gap-1 text-xs"><MessageSquare className="h-3.5 w-3.5" /> Chat</Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredBookings.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <CalendarCheck className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No {bookingFilter} bookings found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Payout + Trust Score */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div custom={8} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="shadow-card h-full">
              <CardHeader>
                <CardTitle className="text-lg">Payout Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                  <div>
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="font-display text-2xl font-bold text-foreground">${earningsData.pendingPayout}</p>
                  </div>
                  <Button variant="hero" size="sm">Withdraw</Button>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Last Payout", value: "$120.00", date: "Mar 15, 2026" },
                    { label: "Total Withdrawn", value: "$2,719.00", date: "Lifetime" },
                    { label: "Processing", value: "$0.00", date: "—" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{row.label}</span>
                      <div className="text-right">
                        <span className="font-medium text-foreground">{row.value}</span>
                        <span className="text-xs text-muted-foreground ml-2">{row.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div custom={9} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="shadow-card h-full">
              <CardHeader>
                <CardTitle className="text-lg">Trust Score</CardTitle>
                <CardDescription>Your community reputation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-hero text-primary-foreground font-display font-bold text-lg">
                    <Star className="h-5 w-5" /> Gold Lender
                  </div>
                </div>
                {[
                  { label: "Response Rate", value: 98 },
                  { label: "On-Time Handoffs", value: 100 },
                  { label: "Profile Completeness", value: 90 },
                  { label: "Positive Reviews", value: 97 },
                ].map((metric) => (
                  <div key={metric.label} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <span className="font-medium text-foreground">{metric.value}%</span>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;
