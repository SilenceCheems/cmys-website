// src/components/LifeDeathScreen.tsx
import { motion } from "motion/react";
import { useLife } from "./LifeContext";
import { computeResult } from "../engine/ending";
import { ENDING_FLAVOR_TEXTS } from "../data/life/endings";

export function LifeDeathScreen() {
  const { state, dispatch } = useLife();
  const result = computeResult(state);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-8 max-w-2xl w-full"
    >
      {/* 星级 */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-3xl ${star <= result.starRating ? "text-primary" : "text-primary/10"}`}
          >
            ★
          </span>
        ))}
      </div>

      {/* 称号 */}
      <h2 className="font-serif text-5xl tracking-tighter text-center">{result.title}</h2>
      <div className="h-[1px] w-24 bg-primary/20" />

      {/* 描述 */}
      <p className="font-mono text-sm text-secondary">{result.description}</p>

      {/* 风味文本 */}
      <p className="font-serif text-lg italic text-primary/60">
        {ENDING_FLAVOR_TEXTS[result.starRating]}
      </p>

      {/* 高亮 */}
      {result.highlights.length > 0 && (
        <div className="flex flex-col gap-2 w-full">
          {result.highlights.map((h, i) => (
            <div key={i} className="p-3 border border-primary/10 font-mono text-xs text-secondary text-center">
              {h}
            </div>
          ))}
        </div>
      )}

      {/* 人生回顾 */}
      {state.eventLog.length > 0 && (
        <div className="w-full border-t border-primary/10 pt-6">
          <p className="font-mono text-[10px] text-secondary tracking-widest uppercase mb-4 text-center">
            人生回顾
          </p>
          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
            {state.eventLog.map((e, i) => (
              <div key={i} className="flex gap-4 font-mono text-[10px] text-secondary/60 hover:text-secondary transition-colors">
                <span className="w-8 text-right shrink-0">{e.age}岁</span>
                <span className="shrink-0">{e.title}</span>
                <span className="truncate">— {e.choiceText}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 重新开始 */}
      <button
        onClick={() => dispatch({ type: "RESTART" })}
        className="px-8 py-3 border border-primary font-mono text-xs tracking-[0.3em] uppercase hover:bg-primary hover:text-canvas transition-colors mt-4"
      >
        再来一局
      </button>
    </motion.div>
  );
}
