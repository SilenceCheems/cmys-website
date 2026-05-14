import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { FORTUNES, Fortune } from "../constants/fortunes";
import { cn } from "../lib/utils";

type AnimationStage = "idle" | "drawing" | "glitch" | "unfolding" | "settled";

interface FortuneSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FortuneSystem({ isOpen, onClose }: FortuneSystemProps) {
  const [stage, setStage] = useState<AnimationStage>("idle");
  const [fortune, setFortune] = useState<Fortune | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setFortune(FORTUNES[Math.floor(Math.random() * FORTUNES.length)]);
      startSequence();
    } else {
      document.body.style.overflow = "";
      setStage("idle");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const startSequence = async () => {
    setStage("drawing");
    await new Promise((r) => setTimeout(r, 1200));
    setStage("glitch");
    await new Promise((r) => setTimeout(r, 800));
    setStage("unfolding");
    await new Promise((r) => setTimeout(r, 1000));
    setStage("settled");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
        >
          {/* Backdrop Blur */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(40px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            className="absolute inset-0 bg-canvas/60"
            onClick={onClose}
          />

          {/* Animation Container */}
          <div className="relative w-full max-w-[420px] aspect-[3/4.5] flex items-center justify-center pointer-events-none">
            {stage === "drawing" && <DrawingPhase />}
            {(stage === "glitch" || stage === "unfolding" || stage === "settled") && (
              <CardPhase stage={stage} fortune={fortune} />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DrawingPhase() {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* 5 Offset Rectangles sketch勾勒 */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ pathLength: 0, opacity: 0, scale: 0.9 }}
          animate={{ 
            pathLength: 1, 
            opacity: [0, 0.8, 0.8, 0],
            scale: 1,
            rotate: i * 0.5 - 1,
            x: i * 12 - 24,
            y: i * 6 - 12
          }}
          transition={{ 
            duration: 0.8, 
            delay: i * 0.15,
            ease: "circOut"
          }}
          className="absolute inset-0 border border-primary/60"
          style={{
            clipPath: "polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)"
          }}
        />
      ))}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: [0, 2, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary blur-sm rounded-full"
      />
    </div>
  );
}

function CardPhase({ stage, fortune }: { stage: AnimationStage; fortune: Fortune | null }) {
  if (!fortune) return null;

  return (
    <motion.div
      layout
      initial={{ width: 1, height: "100%", opacity: 0 }}
      animate={{ 
        width: stage === "unfolding" || stage === "settled" ? "100%" : 2,
        opacity: 1,
        x: stage === "glitch" ? [0, -2, 2, -1, 0] : 0,
        filter: stage === "settled" ? "drop-shadow(0 20px 50px rgba(0,0,0,0.5))" : "none"
      }}
      transition={{
        width: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
        x: { repeat: stage === "glitch" ? Infinity : 0, duration: 0.1 }
      }}
      className={cn(
        "relative bg-[#121212] overflow-hidden rounded-sm",
        "before:absolute before:inset-0 before:bg-[url('https://grainy-gradients.vercel.app/noise.svg')] before:opacity-[0.03] before:pointer-events-none"
      )}
      style={{
        clipPath: "polygon(40px 0%, 100% 0%, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0% 100%, 0% 40px)"
      }}
    >
      {/* Fortune Field (1px intersecting lines) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-x-0 top-1/4 h-[1px] bg-white" />
        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white" />
        <div className="absolute inset-x-0 top-3/4 h-[1px] bg-white" />
        <div className="absolute left-1/4 inset-y-0 w-[1px] bg-white" />
        <div className="absolute left-1/2 inset-y-0 w-[1px] bg-white" />
        <div className="absolute left-3/4 inset-y-0 w-[1px] bg-white" />
      </div>

      {/* Atmospheric Glow */}
      <AnimatePresence>
        {stage === "settled" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at center, var(--color-primary-raw, rgba(var(--color-primary), 0.2)) 0%, transparent 70%)"
            }}
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full w-full p-10 flex flex-col justify-between text-[#F0F0F0] pointer-events-auto">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-mono text-[10px] tracking-[0.4em] text-white/40 uppercase"
            >
              Fortune Protocol v2.6
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-mono text-[10px] text-white/20"
            >
              ID: {fortune.id.padStart(4, '0')}
            </motion.span>
          </div>

          <div className="flex flex-col gap-2">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-5xl tracking-tighter"
            >
              {fortune.name}
            </motion.h3>
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2 }}
              className="h-[1px] bg-primary w-24 origin-left"
            />
          </div>
        </div>

        {/* Center Illustration Plot (One-Line Sprout) */}
        <div className="flex-grow flex items-center justify-center p-8">
           <svg viewBox="0 0 100 100" className="w-48 h-48 stroke-primary/60 fill-none stroke-[0.75]" style={{ filter: "drop-shadow(0 0 8px rgba(var(--color-primary-rgb), 0.3))" }}>
              <AnimatePresence>
                {stage === "settled" && (
                  <motion.path
                    d="M50,90 Q50,60 50,30 M50,60 Q30,40 10,50 M50,60 Q70,40 90,50 M50,45 Q40,20 50,5 Q60,20 50,45"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                  />
                )}
              </AnimatePresence>
           </svg>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
             <motion.div 
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex flex-col gap-1 -translate-y-2"
             >
                <span className="font-mono text-[8px] text-white/20 uppercase">運勢 / Level</span>
                <span className="font-mono text-sm">{fortune.fortune}</span>
             </motion.div>
             <motion.div 
               initial={{ opacity: 0, x: 10 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex flex-col gap-1 text-right translate-y-2"
             >
                <span className="font-mono text-[8px] text-white/20 uppercase">解釈 / Concept</span>
                <span className="font-mono text-sm">{fortune.explanation}</span>
             </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-t border-white/10 pt-4 translate-x-1"
          >
            <p className="font-mono text-[11px] leading-relaxed text-white/60 text-justify">
              {fortune.description}
            </p>
          </motion.div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-1">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className="w-1 h-1 bg-primary opacity-40" />
               ))}
            </div>
            <span className="font-mono text-[8px] text-primary uppercase tracking-widest">
               Design System Unfolded
            </span>
          </div>
        </div>
      </div>
      
      {/* External line decorations */}
      <div className="absolute top-0 right-0 w-20 h-20 border-r border-t border-primary/20 -translate-y-4 translate-x-4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-20 h-20 border-l border-b border-primary/20 translate-y-4 -translate-x-4 pointer-events-none" />
    </motion.div>
  );
}
