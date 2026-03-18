import { Search, MessageSquare, CheckCircle, Star } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Search,
    title: "Find What You Need",
    description: "Search by category, distance, price, and availability. Filter for exactly what works.",
  },
  {
    icon: MessageSquare,
    title: "Chat & Book",
    description: "Message the owner, agree on pickup details, and book instantly with secure payments.",
  },
  {
    icon: CheckCircle,
    title: "Pick Up & Use",
    description: "Grab your gear, use it for your project, and return it when you're done.",
  },
  {
    icon: Star,
    title: "Review & Earn Points",
    description: "Leave a review, get your deposit back, and earn Rentzy Points for rewards.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold font-display tracking-widest text-primary uppercase">Simple Process</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3">
            How Rentzy Works
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto font-body">
            From search to return, the entire experience is built for speed and trust.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px border-t-2 border-dashed border-border" />
              )}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent text-primary mb-5">
                <step.icon size={28} />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
