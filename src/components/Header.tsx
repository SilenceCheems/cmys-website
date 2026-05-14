import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "../lib/utils";

function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Header() {
  const { scrollYProgress } = useScroll();
  
  const height = useTransform(scrollYProgress, [0, 0.2], ["15vh", "8vh"]);
  const logoScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.7]);
  const headerY = useTransform(scrollYProgress, [0.85, 0.9], ["0%", "-100%"]);
  const headerOpacity = useTransform(scrollYProgress, [0.85, 0.9], [1, 0]);

  const navLinks = [
    { name: "纯墨韵声", section: "roots" },
    { name: "驰鸣羽势", section: "growth" },
    { name: "诚盟远溯", section: "now" },
    { name: "聪明一世", section: "contact" },
  ];

  return (
    <motion.header
      style={{ height, y: headerY, opacity: headerOpacity }}
      className="fixed top-0 left-0 w-full z-50 flex items-center border-b border-primary/10 px-6 overflow-hidden transition-all duration-300"
    >
      <div className="w-full grid grid-cols-3 items-center">
        {/* Left Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.slice(0, 2).map((link) => (
            <NavLink key={link.name} name={link.name} sectionId={link.section} />
          ))}
        </nav>
        <div className="md:hidden" />

        {/* Center Logo */}
        <motion.div 
          style={{ scale: logoScale }}
          className="flex justify-center items-center"
        >
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-serif text-4xl sm:text-5xl tracking-tighter text-primary group overflow-hidden cursor-pointer"
          >
            <motion.span 
              className="inline-block"
              style={{ 
                letterSpacing: useTransform(scrollYProgress, [0, 0.2], ["-0.05em", "0.2em"]),
                fontWeight: useTransform(scrollYProgress, [0, 0.2], ["700", "400"])
              }}
              transition={{ duration: 0.5 }}
            >
              CMYS
            </motion.span>
          </button>
        </motion.div>

        {/* Right Nav */}
        <nav className="hidden md:flex gap-8 items-center justify-end">
          {navLinks.slice(2).map((link) => (
            <NavLink key={link.name} name={link.name} sectionId={link.section} />
          ))}
        </nav>
        <div className="md:hidden" />
      </div>
      
      <motion.div 
        className="absolute bottom-0 left-0 h-[1px] bg-primary"
        style={{ width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
      />
    </motion.header>
  );
}

function NavLink({ name, sectionId }: { name: string; sectionId: string; key?: string | number }) {
  return (
    <button 
      onClick={() => scrollToSection(sectionId)}
      className="relative group font-mono text-xs tracking-[0.2em] text-secondary hover:text-primary transition-colors py-2 cursor-pointer"
    >
      {name}
      <motion.span 
        className="absolute bottom-1 left-0 h-[1px] bg-primary"
        initial={{ width: 0 }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.4, ease: "circOut" }}
      />
    </button>
  );
}
