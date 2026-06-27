// src/components/LifeIntro.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  onDone: () => void;
}

const CHARS = ["沉", "默", "一", "生"];
const SUBTITLE = "CMYS · 人生模拟";

export function LifeIntro({ onDone }: Props) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const seq = [600, 1200, 1600, 2000, 3200];
    const timers = seq.map((ms, i) =>
      setTimeout(() => setPhase(i + 1), ms)
    );
    const done = setTimeout(onDone, 4200);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 背景网格闪烁 */}
        <motion.div
          className="absolute inset-0 opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.15, 0.08, 0.12, 0.05] }}
          transition={{ duration: 3.5, times: [0, 0.3, 0.5, 0.7, 1] }}
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* 中心竖线 */}
        <motion.div
          className="absolute w-[1px] bg-white/30"
          initial={{ height: 0 }}
          animate={{ height: phase >= 1 ? "40vh" : 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* 标题四字逐字出现 */}
        <div className="flex gap-4 z-10">
          {CHARS.map((char, i) => (
            <motion.span
              key={char}
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={
                phase >= i + 1
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : {}
              }
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-serif text-5xl text-white tracking-wider"
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* 副标题 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 mt-6 font-mono text-xs tracking-[0.3em] text-white/40"
        >
          {SUBTITLE}
        </motion.p>

        {/* 横线装饰 */}
        <motion.div
          className="absolute h-[1px] bg-white/10"
          initial={{ width: 0 }}
          animate={{ width: phase >= 4 ? "30vw" : 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />

        {/* 底部粒子 */}
        <div className="absolute bottom-32 flex gap-8">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="w-[1px] bg-white/20"
              initial={{ height: 0 }}
              animate={
                phase >= 4
                  ? {
                      height: [0, Math.random() * 40 + 10, 0],
                      opacity: [0, 0.6, 0],
                    }
                  : {}
              }
              transition={{
                duration: 1.5 + Math.random() * 1,
                delay: 0.5 + Math.random() * 0.8,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
