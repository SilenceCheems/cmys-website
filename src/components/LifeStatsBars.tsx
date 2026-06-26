// src/components/LifeStatsBars.tsx
import { motion, AnimatePresence } from "motion/react";
import type { Attributes, AttributeName } from "../engine/types";

const LABELS: Record<AttributeName, string> = {
  appearance: "颜值",
  intelligence: "智力",
  physique: "体质",
  wealth: "家境",
  creativity: "才脉",
  luck: "运势",
};

const LETHAL = new Set<AttributeName>(["appearance", "intelligence", "physique", "wealth"]);

interface Props {
  attributes: Attributes;
}

export function LifeStatsBars({ attributes }: Props) {
  return (
    <div className="w-full max-w-xs grid grid-cols-2 gap-2">
      {(Object.entries(attributes) as [AttributeName, number][]).map(([key, val]) => (
        <div key={key} className="flex items-center gap-2">
          <span className={`font-mono text-[10px] w-8 text-right ${LETHAL.has(key) ? "text-primary" : "text-secondary"}`}>
            {LABELS[key]}
          </span>
          <div className="flex-1 h-2 bg-primary/5 relative overflow-hidden">
            <motion.div
              className={`absolute inset-y-0 left-0 ${LETHAL.has(key) ? "bg-primary" : "bg-primary/40"}`}
              initial={{ width: 0 }}
              animate={{ width: `${val}%` }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
            />
          </div>
          <span className={`font-mono text-[10px] w-6 ${val <= 10 ? "text-red-700" : "text-secondary"}`}>
            {val}
          </span>
        </div>
      ))}
    </div>
  );
}
