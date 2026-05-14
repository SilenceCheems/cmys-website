import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { backgroundWords } from "../data";

export function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-canvas snap-always snap-start">
      {/* Background Text Cloud */}
      <div className="absolute inset-0 z-0 flex flex-wrap content-start opacity-[0.03] select-none text-primary pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 150 }).map((_, i) => {
          const word = backgroundWords[i % backgroundWords.length];
          return (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: i * 0.01 + Math.random() * 0.5,
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: Math.random() * 5 + 2
              }}
              className="text-2xl sm:text-4xl lg:text-5xl font-mono mx-2 my-1 whitespace-nowrap"
              style={{
                marginLeft: `${Math.random() * 20}px`,
                marginRight: `${Math.random() * 20}px`
              }}
            >
              {word}
            </motion.span>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl px-6">
        <motion.div
          initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
          whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <h1 className="text-6xl sm:text-7xl lg:text-9xl font-bold tracking-tighter text-primary mix-blend-difference mb-6" style={{ fontVariantLigatures: 'no-common-ligatures' }}>
            <span className="block text-2xl sm:text-4xl font-normal tracking-normal mb-4 font-mono text-secondary">你好，我叫</span>
            CMYS
          </h1>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="h-[1px] w-32 bg-primary mx-auto opacity-30 mt-8 mb-4"
          />
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-xs font-mono text-secondary">SCROLL</span>
      </motion.div>
    </section>
  );
}
