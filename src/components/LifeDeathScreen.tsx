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
      transition={{ delay: 0.6, duration: 1.2 }}
      className="flex flex-col items-center gap-10 max-w-2xl w-full text-white"
    >
      {/* 星级 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="flex gap-3"
      >
        {[1, 2, 3, 4, 5].map((star, i) => (
          <motion.span
            key={star}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: star <= result.starRating ? 1 : 0.15, scale: 1 }}
            transition={{ delay: 1.5 + i * 0.15, type: "spring", stiffness: 200 }}
            className="text-4xl"
          >
            ★
          </motion.span>
        ))}
      </motion.div>

      {/* 称号 */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="font-serif text-6xl tracking-tighter text-center"
      >
        {result.title}
      </motion.h2>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 2.8, duration: 1 }}
        className="h-[1px] w-24 bg-white/20"
      />

      {/* 描述 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 0.8 }}
        className="font-mono text-sm text-white/60"
      >
        {result.description}
      </motion.p>

      {/* 风味文本 */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.6, duration: 1 }}
        className="font-serif text-xl italic text-white/50 text-center leading-relaxed"
      >
        {ENDING_FLAVOR_TEXTS[result.starRating]}
      </motion.p>

      {/* 高亮 */}
      {result.highlights.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.2, duration: 0.8 }}
          className="flex flex-col gap-3 w-full"
        >
          {result.highlights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 4.4 + i * 0.2 }}
              className="p-4 border border-white/10 font-mono text-xs text-white/50 text-center"
            >
              {h}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* 人生回顾 */}
      {state.eventLog.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5.2, duration: 1 }}
          className="w-full border-t border-white/10 pt-8"
        >
          <p className="font-mono text-[10px] text-white/30 tracking-widest uppercase mb-6 text-center">
            人生回顾
          </p>
          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
            {state.eventLog.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5.4 + i * 0.03 }}
                className="flex gap-4 font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors"
              >
                <span className="w-8 text-right shrink-0">{e.age}岁</span>
                <span className="shrink-0">{e.title}</span>
                <span className="truncate">— {e.choiceText}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 重新开始 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 6.5, duration: 0.8 }}
      >
        <button
          onClick={() => dispatch({ type: "RESTART" })}
          className="px-8 py-3 border border-white/30 font-mono text-xs tracking-[0.3em] uppercase text-white/60 hover:bg-white hover:text-black transition-colors"
        >
          再来一局
        </button>
      </motion.div>
    </motion.div>
  );
}
