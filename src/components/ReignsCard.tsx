import { useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import type { GameEvent, EventChoice } from "../engine/types";

interface Props {
  event: GameEvent;
  choices: EventChoice[];
  age: number;
  onChoose: (index: number) => void;
  stageLabel?: string;
}

export function ReignsCard({ event, choices, age, onChoose, stageLabel }: Props) {
  const dragX = useMotionValue(0);
  const rotate = useTransform(dragX, [-300, 0, 300], [-8, 0, 8]);
  const bgTint = useTransform(
    dragX,
    [-300, 0, 300],
    ["rgba(59,130,246,0.06)", "rgba(0,0,0,0)", "rgba(245,158,11,0.06)"]
  );

  const handleDragEnd = useCallback(
    (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
      const threshold = window.innerWidth * 0.3;
      const velocity = info.velocity.x;
      const offset = info.offset.x;

      if (offset < -threshold || velocity < -500) {
        onChoose(0);
      } else if (offset > threshold || velocity > 500) {
        onChoose(choices.length > 1 ? 1 : 0);
      }
    },
    [onChoose, choices.length]
  );

  // 键盘监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onChoose(0);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onChoose(choices.length > 1 ? 1 : 0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onChoose, choices.length]);

  const leftChoice = choices[0];
  const rightChoice = choices.length > 1 ? choices[1] : null;

  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      {/* 背景色跟随拖动变化 */}
      <motion.div
        className="absolute inset-0 -inset-x-24 rounded-lg pointer-events-none"
        style={{ backgroundColor: bgTint }}
      />

      {/* 卡片本体 */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        style={{ x: dragX, rotate }}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: "grabbing" }}
        className="relative bg-white border border-primary/10 cursor-grab active:cursor-grabbing shadow-sm"
      >
        {/* 内容 */}
        <div className="relative z-10 p-6 sm:p-8 flex flex-col gap-5">
          {/* 顶部标签 */}
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] tracking-[0.3em] text-secondary/60 uppercase">
              {stageLabel ?? `${age} 岁`}
            </span>
            {event.type === "anchor" && (
              <span className="font-mono text-[10px] text-secondary/30">锚点</span>
            )}
          </div>

          {/* 标题 */}
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tighter leading-tight text-primary">
            {event.title}
          </h2>
          <div className="h-[1px] bg-primary/10 w-16" />

          {/* 描述 */}
          <p className="font-mono text-sm text-secondary leading-relaxed">
            {event.description}
          </p>

          {/* 选项 — 始终可见 */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => onChoose(0)}
              className="flex items-center gap-2 p-3 border border-primary/15 text-left hover:border-blue-400/50 hover:bg-blue-50/30 transition-colors cursor-pointer"
            >
              <span className="font-mono text-[10px] text-blue-400/60 shrink-0">←</span>
              <span className="font-mono text-xs text-primary/70 leading-tight">
                {leftChoice?.text ?? "—"}
              </span>
            </button>

            {rightChoice ? (
              <button
                onClick={() => onChoose(1)}
                className="flex items-center gap-2 p-3 border border-primary/15 text-right hover:border-amber-400/50 hover:bg-amber-50/30 transition-colors cursor-pointer"
              >
                <span className="font-mono text-xs text-primary/70 leading-tight flex-1">
                  {rightChoice.text}
                </span>
                <span className="font-mono text-[10px] text-amber-400/60 shrink-0">→</span>
              </button>
            ) : (
              <div />
            )}
          </div>

          {/* 底部提示 */}
          <div className="flex justify-between items-center pt-1 border-t border-primary/5">
            <span className="font-mono text-[9px] text-secondary/30 uppercase tracking-widest">
              ← 拖动或按键 →
            </span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-primary/15" />
              <div className="w-1 h-1 bg-primary/15" />
              <div className="w-1 h-1 bg-primary/15" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 键盘操作提示 */}
      <p className="text-center mt-5 font-mono text-[10px] text-secondary/25 tracking-widest">
        ← → 方向键选择
      </p>
    </div>
  );
}
