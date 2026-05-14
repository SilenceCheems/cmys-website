import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export function DecorativeScrollbar() {
  const { scrollYProgress } = useScroll();
  const [percent, setPercent] = useState(0);

  // Smooth out the percentage display
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setPercent(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 h-[60vh] w-8 z-[100] pointer-events-none flex flex-col items-center justify-between">
      {/* Percentage Display */}
      <div className="font-mono text-[10px] text-secondary tracking-tighter transform rotate-90">
        {percent.toString().padStart(3, '0')}%
      </div>

      {/* The Track */}
      <div className="relative flex-grow w-[1px] bg-primary/10 my-8">
        {/* The Progress Line */}
        <motion.div 
          className="absolute top-0 left-0 w-full bg-primary origin-top"
          style={{ scaleY: scrollYProgress }}
        />
        
        {/* The Floating Pointer */}
        <motion.div 
          className="absolute left-1/2 -translate-x-1/2 w-4 h-[1px] bg-primary shadow-sm"
          style={{ top: useTransform(smoothProgress, [0, 1], ["0%", "100%"]) }}
        >
          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 font-mono text-[8px] text-primary whitespace-nowrap opacity-40">
            LOC
          </div>
        </motion.div>
      </div>

      {/* Label */}
      <div className="font-mono text-[8px] text-primary/40 uppercase tracking-[0.3em] h-12 flex items-center justify-center transform rotate-90 whitespace-nowrap">
        SCROLL_LAB_V2
      </div>
    </div>
  );
}
