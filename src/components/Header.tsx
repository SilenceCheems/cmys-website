import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "../lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

export function Header() {
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();
  const location = useLocation();
  
  const height = useTransform(scrollYProgress, [0, 0.2], ["15vh", "8vh"]);
  const logoScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.7]);
  const isGachaPage = location.pathname === "/gacha";
  const isLifePage = location.pathname === "/life";
  const isHomePage = location.pathname === "/";
  const headerY = useTransform(scrollYProgress, [0.85, 0.9], [isGachaPage ? "0%" : "0%", isGachaPage ? "0%" : "-100%"]);
  const headerOpacity = useTransform(scrollYProgress, [0.85, 0.9], [1, isGachaPage ? 1 : 0]);

  const navLinks = [
    { name: "纯墨韵声", section: "roots", type: "anchor" },
    { name: "驰鸣羽势", section: "growth", type: "anchor" },
    { name: "聪明一世", path: "/gacha", type: "route" },
    { name: "沉默一生", path: "/life", type: "route" },
  ];

  const handleNavClick = (link: any) => {
    if (link.type === "route") {
      navigate(link.path);
    } else {
      if (location.pathname !== "/") {
        navigate("/");
        // Wait for navigation and rendering then scroll
        setTimeout(() => {
          const element = document.getElementById(link.section);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      } else {
        const element = document.getElementById(link.section);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  };

  return (
    <motion.header
      style={{ height, y: headerY, opacity: headerOpacity }}
      className={`fixed top-0 left-0 w-full z-50 flex items-center border-b border-primary/10 px-6 overflow-hidden transition-all duration-300 ${
        isLifePage ? "hidden" : ""
      }`}
    >
      <div className="w-full grid grid-cols-3 items-center">
        {/* Left Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {!isGachaPage && isHomePage && navLinks.slice(0, 2).map((link) => (
            <NavLink
              key={link.name}
              name={link.name}
              onClick={() => handleNavClick(link)}
              isActive={link.type === 'route' ? location.pathname === link.path : false}
            />
          ))}
        </nav>
        <div className="md:hidden" />

        {/* Center Logo */}
        <motion.div
          style={{ scale: logoScale }}
          className={`flex justify-center items-center ${!isHomePage ? "md:opacity-0 pointer-events-none" : ""}`}
        >
          <button 
            onClick={() => {
              if (location.pathname !== "/") {
                navigate("/");
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
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
          {!isGachaPage && isHomePage && navLinks.slice(2).map((link) => (
            <NavLink
              key={link.name}
              name={link.name}
              onClick={() => handleNavClick(link)}
              isActive={link.type === 'route' ? location.pathname === link.path : false}
            />
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

function NavLink({ 
  name, 
  onClick, 
  isActive 
}: { 
  name: string; 
  onClick: () => void; 
  isActive?: boolean;
  key?: any;
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "relative group font-mono text-xs tracking-[0.2em] transition-colors py-2 cursor-pointer",
        isActive ? "text-primary" : "text-secondary hover:text-primary"
      )}
    >
      {name}
      <motion.span 
        className="absolute bottom-1 left-0 h-[1px] bg-primary"
        initial={{ width: isActive ? "100%" : 0 }}
        animate={{ width: isActive ? "100%" : 0 }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.4, ease: "circOut" }}
      />
    </button>
  );
}
