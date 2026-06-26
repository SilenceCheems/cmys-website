// src/components/LifeEventCard.tsx
import { motion } from "motion/react";
import type { GameEvent, EventChoice } from "../engine/types";

interface Props {
  event: GameEvent;
  choices: EventChoice[];
  age: number;
  onChoose: (index: number) => void;
}

export function LifeEventCard({ event, choices, age, onChoose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl flex flex-col gap-8"
    >
      <div className="text-center">
        <p className="font-mono text-[10px] text-secondary tracking-widest uppercase mb-2">
          {age} 岁
        </p>
        <h2 className="font-serif text-3xl tracking-tighter mb-3">{event.title}</h2>
        <div className="h-[1px] w-16 bg-primary/20 mx-auto mb-3" />
        <p className="font-mono text-sm text-secondary leading-relaxed max-w-lg mx-auto">
          {event.description}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {choices.map((choice, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            onClick={() => onChoose(i)}
            className="w-full p-4 border border-primary/20 text-left font-mono text-sm hover:border-primary/60 hover:bg-primary/5 transition-colors glass-panel group"
          >
            <span className="text-[10px] text-secondary mr-2">0{i + 1}</span>
            {choice.text}
            <span className="float-right opacity-0 group-hover:opacity-100 transition-opacity text-secondary">
              →
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
