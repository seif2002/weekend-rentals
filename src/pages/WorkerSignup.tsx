import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Wrench, Plus, X, Upload, ArrowLeft } from "lucide-react";

const SKILL_SUGGESTIONS = [
  "Plumbing", "Electrical", "Painting", "Carpentry", "Moving", "Assembly",
  "Cleaning", "Landscaping", "Handyman", "Appliance Repair", "Flooring",
  "Drywall", "Pressure Washing", "Roofing", "HVAC", "Welding",
];

const WorkerSignup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [location, setLocation] = useState("");
  const [workerType, setWorkerType] = useState("general");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [certInput, setCertInput] = useState("");
  const [portfolioUrls, setPortfolioUrls] = useState<string[]>([]);
  const [portfolioInput, setPortfolioInput] = useState("");

  const addItem = (value: string, list: string[], setList: (v: string[]) => void, setInput: (v: string) => void) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
    }
    setInput("");
  };

  const removeItem = (index: number, list: string[], setList: (v: string[]) => void) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in first");
      navigate("/auth");
      return;
    }
    if (skills.length === 0) {
      toast.error("Add at least one skill");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("workers").insert({
      user_id: user.id,
      title,
      bio,
      hourly_rate: parseFloat(hourlyRate),
      location,
      worker_type: workerType,
      skills,
      certifications,
      portfolio_urls: portfolioUrls,
    });
    setLoading(false);
    if (error) {
      if (error.code === "23505") {
        toast.error("You already have a worker profile");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Worker profile created! You're now visible to clients.");
      navigate("/workers");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Join as a Worker</h1>
          <p className="text-muted-foreground mb-6">You need an account to register as a worker.</p>
          <Button variant="hero" asChild><a href="/auth">Sign Up / Log In</a></Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-2xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={16} /> Back
        </button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-display">Register as a Worker</CardTitle>
                <CardDescription>Create your profile so clients can find and book you</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Experienced Handyman & Plumber" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rate">Hourly Rate ($)</Label>
                    <Input id="rate" type="number" min="1" step="0.01" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} required placeholder="35.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Worker Type</Label>
                    <Select value={workerType} onValueChange={setWorkerType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="skilled">Skilled Trade</SelectItem>
                        <SelectItem value="general">General Helper</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. San Francisco, CA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">About You</Label>
                  <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell clients about your experience, approach, and what makes you stand out..." rows={4} />
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <Label>Skills</Label>
                <div className="flex gap-2">
                  <Input value={skillInput} onChange={e => setSkillInput(e.target.value)} placeholder="Add a skill" onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addItem(skillInput, skills, setSkills, setSkillInput); }}} />
                  <Button type="button" variant="outline" size="icon" onClick={() => addItem(skillInput, skills, setSkills, setSkillInput)}><Plus size={16} /></Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <Badge key={i} variant="secondary" className="gap-1 cursor-pointer" onClick={() => removeItem(i, skills, setSkills)}>
                      {s} <X size={12} />
                    </Badge>
                  ))}
                </div>
                {skills.length === 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {SKILL_SUGGESTIONS.slice(0, 8).map(s => (
                      <Badge key={s} variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => addItem(s, skills, setSkills, setSkillInput)}>
                        + {s}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Certifications */}
              <div className="space-y-3">
                <Label>Certifications (optional)</Label>
                <div className="flex gap-2">
                  <Input value={certInput} onChange={e => setCertInput(e.target.value)} placeholder="e.g. Licensed Electrician" onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addItem(certInput, certifications, setCertifications, setCertInput); }}} />
                  <Button type="button" variant="outline" size="icon" onClick={() => addItem(certInput, certifications, setCertifications, setCertInput)}><Plus size={16} /></Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((c, i) => (
                    <Badge key={i} variant="secondary" className="gap-1 cursor-pointer" onClick={() => removeItem(i, certifications, setCertifications)}>
                      {c} <X size={12} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Portfolio */}
              <div className="space-y-3">
                <Label>Portfolio Links (optional)</Label>
                <div className="flex gap-2">
                  <Input value={portfolioInput} onChange={e => setPortfolioInput(e.target.value)} placeholder="https://example.com/my-work" onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addItem(portfolioInput, portfolioUrls, setPortfolioUrls, setPortfolioInput); }}} />
                  <Button type="button" variant="outline" size="icon" onClick={() => addItem(portfolioInput, portfolioUrls, setPortfolioUrls, setPortfolioInput)}><Plus size={16} /></Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {portfolioUrls.map((u, i) => (
                    <Badge key={i} variant="secondary" className="gap-1 cursor-pointer text-xs max-w-[250px] truncate" onClick={() => removeItem(i, portfolioUrls, setPortfolioUrls)}>
                      {u} <X size={12} />
                    </Badge>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" variant="hero" disabled={loading}>
                {loading ? "Creating Profile..." : "Create Worker Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default WorkerSignup;
