import { motion } from "motion/react";
import { cn } from "../lib/utils";

export function Contact() {
  return (
    <section className="relative min-h-[100svh] w-full flex flex-col items-center justify-center bg-canvas snap-always snap-start overflow-hidden">
      {/* Background Grid Lines to match timeline */}
      <div className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-20%" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center gap-12"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-sm tracking-widest text-secondary uppercase py-1 border-b border-primary/20">
            Contact & Links
          </span>
        </div>

        {/* osu! style button */}
        <motion.a
          href="https://ys.mihoyo.com"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            scale: [1, 1.04, 1],
          }}
          transition={{
            scale: {
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className={cn(
            "relative flex items-center justify-center w-48 h-48 rounded-full",
            "bg-[#ff66aa] border-[12px] border-white cursor-pointer shadow-xl",
            "hover:shadow-2xl transition-shadow duration-300"
          )}
        >
          {/* Inner ring decoration */}
          <div className="absolute inset-1 rounded-full border-2 border-white/40 pointer-events-none" />
          
          <span className="text-white text-5xl font-bold tracking-tighter drop-shadow-md pr-2">
            esu!
          </span>
        </motion.a>
        
        <p className="text-secondary font-mono text-xs uppercase tracking-widest mt-4">
          Click to view
        </p>
      </motion.div>
    </section>
  );
}
