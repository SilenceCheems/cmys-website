// src/components/LifeInfancyStage.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLife } from "./LifeContext";
import { ANCHOR_EVENTS } from "../data/life/events-anchors";

export function LifeInfancyStage() {
  const { state, dispatch } = useLife();
  const [narrationIndex, setNarrationIndex] = useState(0);

  const infancyEvents = ANCHOR_EVENTS
    .filter((e) => e.maxAge <= 5)
    .sort((a, b) => (a.triggerAge as number) - (b.triggerAge as number));

  useEffect(() => {
    if (narrationIndex >= infancyEvents.length) {
      // 婴幼期结束，进入少年期
      const timer = setTimeout(() => dispatch({ type: "ADVANCE_AGE" }), 500);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setNarrationIndex((i) => i + 1);
    }, 2500);

    return () => clearTimeout(timer);
  }, [narrationIndex]);

  const currentEvent = infancyEvents[narrationIndex];

  if (!currentEvent) {
    return (
      <div className="flex items-center justify-center">
        <p className="font-mono text-xs text-secondary animate-pulse">成长中...</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentEvent.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center gap-6 text-center max-w-lg"
      >
        <p className="font-serif text-5xl tracking-tighter">{currentEvent.title}</p>
        <div className="h-[1px] w-12 bg-primary/20" />
        <p className="font-mono text-sm text-secondary leading-relaxed">
          {currentEvent.description}
        </p>
        <p className="font-mono text-xs text-secondary/50">
          {narrationIndex + 1} / {infancyEvents.length}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
