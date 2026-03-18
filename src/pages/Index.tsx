import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import Categories from "@/components/Categories";
import FeaturedListings from "@/components/FeaturedListings";
import OwnerCTA from "@/components/OwnerCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <Categories />
      <FeaturedListings />
      <OwnerCTA />
      <Footer />
    </div>
  );
};

export default Index;
