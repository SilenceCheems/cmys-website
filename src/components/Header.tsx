import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "../lib/utils";

export function Header() {
  const { scrollYProgress } = useScroll();
  
  // Shrink from 15% to 5% height
  const height = useTransform(scrollYProgress, [0, 0.2], ["15vh", "8vh"]);
  const logoScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.7]);
  const headerY = useTransform(scrollYProgress, [0.85, 0.9], ["0%", "-100%"]);
  const headerOpacity = useTransform(scrollYProgress, [0.85, 0.9], [1, 0]);

  const navLinks = [
    { name: "纯墨韵声", href: "#roots" },
    { name: "驰鸣羽势", href: "#growth" },
    { name: "诚盟远溯", href: "#now" },
    { name: "聪明一世", href: "#contact" },
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
            <NavLink key={link.name} name={link.name} href={link.href} />
          ))}
        </nav>
        <div className="md:hidden" /> {/* Spacer for mobile grid */}

        {/* Center Logo */}
        <motion.div 
          style={{ scale: logoScale }}
          className="flex justify-center items-center"
        >
          <a href="#" className="font-serif text-4xl sm:text-5xl tracking-tighter text-primary group overflow-hidden">
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
          </a>
        </motion.div>

        {/* Right Nav */}
        <nav className="hidden md:flex gap-8 items-center justify-end">
          {navLinks.slice(2).map((link) => (
            <NavLink key={link.name} name={link.name} href={link.href} />
          ))}
        </nav>
        <div className="md:hidden" /> {/* Spacer for mobile grid */}
      </div>
      
      {/* Scroll indicator line at the bottom of header */}
      <motion.div 
        className="absolute bottom-0 left-0 h-[1px] bg-primary"
        style={{ width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
      />
    </motion.header>
  );
}

function NavLink({ name, href }: { name: string; href: string; key?: string | number }) {
  return (
    <a 
      href={href} 
      className="relative group font-mono text-xs tracking-[0.2em] text-secondary hover:text-primary transition-colors py-2"
    >
      {name}
      {/* Animated underline (DrawSVG style) */}
      <motion.span 
        className="absolute bottom-1 left-0 h-[1px] bg-primary"
        initial={{ width: 0 }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.4, ease: "circOut" }}
      />
    </a>
  );
}
