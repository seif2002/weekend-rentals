const Footer = () => {
  return (
    <footer className="bg-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-2xl font-bold text-background">Rentzy</span>
            <p className="text-sm text-background/60 mt-3 max-w-xs font-body">
              The peer-to-peer rental marketplace for everyday gear. Borrow it. List it. Earn from it.
            </p>
          </div>
          {[
            { title: "Product", links: ["How It Works", "Categories", "Pricing", "Trust & Safety"] },
            { title: "Company", links: ["About Us", "Blog", "Careers", "Press"] },
            { title: "Support", links: ["Help Center", "Contact", "Dispute Resolution", "Terms"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-sm text-background mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-background/50 hover:text-background transition-colors font-body">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-background/10 pt-8 text-center">
          <p className="text-xs text-background/40 font-body">© 2026 Rentzy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
