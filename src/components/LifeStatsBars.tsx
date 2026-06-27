// src/components/LifeStatsBars.tsx
import { motion } from "motion/react";
import type { Attributes, AttributeName } from "../engine/types";

const LABELS: Record<AttributeName, string> = {
  appearance: "颜值",
  intelligence: "智力",
  physique: "体质",
  wealth: "家境",
  creativity: "才脉",
  luck: "运势",
};

const SHORT: Record<AttributeName, string> = {
  appearance: "颜",
  intelligence: "智",
  physique: "体",
  wealth: "富",
  creativity: "才",
  luck: "运",
};

const LETHAL = new Set<AttributeName>(["appearance", "intelligence", "physique", "wealth"]);

interface Props {
  attributes: Attributes;
  compact?: boolean;
  variant?: "monoliths" | "typographic" | "meridian";
}

// ── 方案 A: 纵向柱碑 ──
function Monoliths({ attributes, compact }: { attributes: Attributes; compact?: boolean }) {
  const entries = Object.entries(attributes) as [AttributeName, number][];
  return (
    <div className={`flex gap-2 ${compact ? "gap-1" : "gap-3"}`}>
      {entries.map(([key, val]) => {
        const isDeadly = LETHAL.has(key);
        const danger = val <= 10;
        return (
          <div key={key} className="flex flex-col items-center gap-1">
            <span className="font-mono text-[9px] text-secondary/60">{val}</span>
            <div className={`relative ${compact ? "w-5 h-14" : "w-7 h-24"}`}>
              <div className="absolute inset-x-0 bottom-0 bg-primary/5" style={{ height: "100%" }} />
              <motion.div
                className={`absolute inset-x-0 bottom-0 ${isDeadly ? "bg-primary" : "bg-primary/30"}`}
                initial={{ height: 0 }}
                animate={{ height: `${val}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 16 }}
              />
              {danger && (
                <motion.div
                  className="absolute inset-x-0 bottom-0 bg-red-700/80"
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(0, 10 - val) * 3}%` }}
                  transition={{ type: "spring", stiffness: 80, damping: 16 }}
                />
              )}
            </div>
            <span className={`font-serif text-xs tracking-tighter ${isDeadly ? "text-primary" : "text-secondary/60"}`}>
              {LABELS[key]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── 方案 B: 字阵排版 ──
function Typographic({ attributes, compact }: { attributes: Attributes; compact?: boolean }) {
  const entries = Object.entries(attributes) as [AttributeName, number][];
  return (
    <div className={`grid grid-cols-3 gap-x-4 gap-y-1 ${compact ? "gap-x-2 gap-y-0.5" : "gap-x-6 gap-y-2"}`}>
      {entries.map(([key, val]) => {
        const isDeadly = LETHAL.has(key);
        const danger = val <= 10;
        const dying = val <= 3;
        return (
          <motion.div
            key={key}
            className="flex items-baseline gap-2"
            animate={{ opacity: dying ? [1, 0.4, 1] : 1 }}
            transition={dying ? { repeat: Infinity, duration: 1.2 } : {}}
          >
            <span className={`font-mono text-xs tracking-wider ${isDeadly ? "text-primary" : "text-secondary/50"}`}>
              {LABELS[key]}
            </span>
            <span className={`font-mono ${compact ? "text-sm" : "text-xl"} tabular-nums tracking-tight ${danger ? "text-red-700" : isDeadly ? "text-primary" : "text-secondary"}`}>
              {String(val).padStart(2, "0")}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── 方案 C: 经脉流转 ──
function Meridian({ attributes, compact }: { attributes: Attributes; compact?: boolean }) {
  const entries = Object.entries(attributes) as [AttributeName, number][];
  return (
    <div className={`flex flex-col ${compact ? "gap-0" : "gap-1.5"}`}>
      {entries.map(([key, val]) => {
        const isDeadly = LETHAL.has(key);
        const danger = val <= 10;
        const dotSize = Math.max(2, Math.min(8, Math.round(val / 12)));
        return (
          <div key={key} className="flex items-center gap-2">
            <span className={`font-serif text-xs w-4 text-right tracking-tighter ${isDeadly ? "text-primary" : "text-secondary/50"}`}>
              {LABELS[key]}
            </span>
            <div className="flex-1 h-[1px] bg-primary/10 relative">
              <motion.div
                className="absolute inset-y-0 left-0 bg-primary/20"
                animate={{ width: `${val}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 16 }}
              />
              <motion.div
                className={`absolute top-1/2 -translate-y-1/2 rounded-full ${danger ? "bg-red-700" : isDeadly ? "bg-primary" : "bg-primary/40"}`}
                style={{ width: dotSize, height: dotSize }}
                animate={{ left: `${val}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 16 }}
              />
            </div>
            <span className={`font-mono text-[10px] w-5 text-right tabular-nums ${danger ? "text-red-700" : isDeadly ? "text-primary" : "text-secondary/60"}`}>
              {val}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function LifeStatsBars({ attributes, compact, variant = "monoliths" }: Props) {
  switch (variant) {
    case "monoliths":
      return <Monoliths attributes={attributes} compact={compact} />;
    case "typographic":
      return <Typographic attributes={attributes} compact={compact} />;
    case "meridian":
    default:
      return <Meridian attributes={attributes} compact={compact} />;
  }
}
