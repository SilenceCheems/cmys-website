import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback, useRef } from "react";
import { FORTUNES, Fortune } from "../constants/fortunes";
import { cn } from "../lib/utils";
import { toPng } from "html-to-image";

type AnimationStage = "idle" | "drawing" | "glitch" | "unfolding" | "settled";

interface FortuneSystemProps {
  isOpen: boolean;
  onClose: () => void;
  onDailyFortuneSet: (fortune: Fortune | null) => void;
}

const STORAGE_KEY = "esu_fortune_daily";
const STORAGE_DATE_KEY = "esu_fortune_date";
const STORAGE_UNIQUE_ID_KEY = "esu_fortune_unique_id";

function getTodayDate(): string {
  // 返回中国标准时间 (CST, UTC+8) 的日期字符串 (YYYY-MM-DD)
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(now);
  const year = parts.find(p => p.type === "year")?.value;
  const month = parts.find(p => p.type === "month")?.value;
  const day = parts.find(p => p.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

interface StoredFortune {
  fortuneId: string;
  uniqueId: string;
}

function getStoredDailyFortune(): StoredFortune | null {
  try {
    const storedDate = localStorage.getItem(STORAGE_DATE_KEY);
    const today = getTodayDate();
    if (storedDate === today) {
      const fortuneId = localStorage.getItem(STORAGE_KEY);
      const uniqueId = localStorage.getItem(STORAGE_UNIQUE_ID_KEY);
      if (fortuneId && uniqueId) {
        return { fortuneId, uniqueId };
      }
    }
    return null;
  } catch {
    return null;
  }
}

function saveDailyFortune(fortuneId: string, uniqueId: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, fortuneId);
    localStorage.setItem(STORAGE_UNIQUE_ID_KEY, uniqueId);
    localStorage.setItem(STORAGE_DATE_KEY, getTodayDate());
  } catch {
  }
}

function generateUniqueId(fortuneId: string): string {
  // Use current timestamp as seed to generate a 4-digit random number
  const seed = Date.now();
  const randomPart = Math.floor((Math.abs(Math.sin(seed)) * 9000) + 1000);
  return `${randomPart}${fortuneId.padStart(4, '0')}`;
}

export function FortuneSystem({ isOpen, onClose, onDailyFortuneSet }: FortuneSystemProps) {
  const [stage, setStage] = useState<AnimationStage>("idle");
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [displayId, setDisplayId] = useState<string>("");
  const cardRef = useRef<HTMLDivElement>(null);

  const startSequence = useCallback(async () => {
    const stored = getStoredDailyFortune();
    let targetFortune: Fortune | null = null;
    let finalUniqueId = "";
    
    if (stored) {
      targetFortune = FORTUNES.find((f) => f.id === stored.fortuneId) || null;
      finalUniqueId = stored.uniqueId;
      
      setFortune(targetFortune);
      setDisplayId(finalUniqueId);
      setStage("settled");
      onDailyFortuneSet(targetFortune);
      return;
    }

    targetFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    finalUniqueId = generateUniqueId(targetFortune.id);
    saveDailyFortune(targetFortune.id, finalUniqueId);

    setFortune(targetFortune);
    setDisplayId(finalUniqueId);
    
    setStage("drawing");
    await new Promise((r) => setTimeout(r, 1200));
    setStage("glitch");
    await new Promise((r) => setTimeout(r, 800));
    setStage("unfolding");
    await new Promise((r) => setTimeout(r, 1000));
    setStage("settled");
    
    // Update global state only after animation completes
    onDailyFortuneSet(targetFortune);
  }, [onDailyFortuneSet]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      startSequence();
    } else {
      document.body.style.overflow = "";
      setStage("idle");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, startSequence]);

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, { 
          cacheBust: true,
          pixelRatio: 2,
        });
        const link = document.createElement("a");
        link.download = `esu-fortune-${displayId}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Failed to download image", err);
      }
    }
  };

  const handleShare = async () => {
    const fortuneLevel = fortune?.fortune.split(/[，,]/)[0] || "";
    const shareText = `我的今日运势是${fortuneLevel}「${fortune?.name}」，来cmys.top/gacha 抽取你的专属cmys运势卡`;
    const shareData = {
      title: "CMYS esu! Fortune",
      text: shareText,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareText);
        alert("链接已复制到剪贴板");
      }
    } catch (err) {
      console.error("Error sharing", err);
    }
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
          <div className="relative w-full max-w-[420px] aspect-[3/4.5] flex flex-col items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
              {stage === "drawing" && <DrawingPhase />}
              {(stage === "glitch" || stage === "unfolding" || stage === "settled") && (
                <CardPhase ref={cardRef} stage={stage} fortune={fortune} displayId={displayId} />
              )}
            </div>

            {/* Action Buttons */}
            {stage === "settled" && (
              <div className="absolute -bottom-12 flex items-center gap-8 pointer-events-auto">
                <button
                  onClick={handleDownload}
                  className="group relative py-2 font-mono text-[10px] tracking-[0.3em] uppercase text-black transition-colors cursor-pointer"
                >
                  Download
                  <motion.span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300" />
                </button>
                
                <div className="w-[1px] h-3 bg-black/10" />

                <button
                  onClick={handleShare}
                  className="group relative py-2 font-mono text-[10px] tracking-[0.3em] uppercase text-black transition-colors cursor-pointer"
                >
                  Share
                  <motion.span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300" />
                </button>
              </div>
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
    </div>
  );
}

import { forwardRef } from "react";

const CardPhase = forwardRef<HTMLDivElement, { stage: AnimationStage; fortune: Fortune | null; displayId: string }>(
  ({ stage, fortune, displayId }, ref) => {
    if (!fortune) return null;

    return (
      <motion.div
        ref={ref}
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
          "relative bg-[#121212] overflow-hidden rounded-sm"
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

        {/* Content Container (Stable layout) */}
        <div className="absolute inset-0 w-[420px] left-1/2 -translate-x-1/2 h-full pointer-events-none">
          <div className="relative z-10 h-full w-full p-10 flex flex-col justify-between text-[#F0F0F0] pointer-events-auto">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-mono text-[10px] tracking-[0.4em] text-white/40 uppercase"
                >
                  Fortune Card
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-mono text-[10px] text-white/20"
                >
                  ID: {displayId}
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
        </div>
        
        {/* External line decorations */}
        <div className="absolute top-0 right-0 w-20 h-20 border-r border-t border-primary/20 -translate-y-4 translate-x-4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-20 h-20 border-l border-b border-primary/20 translate-y-4 -translate-x-4 pointer-events-none" />
      </motion.div>
    );
  }
);

CardPhase.displayName = "CardPhase";

