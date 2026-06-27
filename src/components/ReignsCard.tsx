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
  const rotate = useTransform(dragX, [-300, 0, 300], [-15, 0, 15]);
  const bgColor = useTransform(
    dragX,
    [-300, 0, 300],
    ["rgba(0,40,80,0.4)", "rgba(0,0,0,0)", "rgba(80,30,0,0.4)"]
  );

  const handleDragEnd = useCallback(
    (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
      const threshold = window.innerWidth * 0.3;
      const velocity = info.velocity.x;
      const offset = info.offset.x;

      if (offset < -threshold || velocity < -500) {
        // 左滑 → 选左选项 (index 0)
        onChoose(0);
      } else if (offset > threshold || velocity > 500) {
        // 右滑 → 选右选项 (index 1)
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

  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      {/* 背景色跟随拖动变化 */}
      <motion.div
        className="absolute inset-0 -inset-x-32 rounded-lg pointer-events-none"
        style={{ backgroundColor: bgColor }}
      />

      {/* 拖拽方向提示 — 仅拖动时浮现 */}
      <motion.div
        className="absolute inset-0 pointer-events-none flex items-center justify-between px-4 z-20"
        style={{ opacity: useTransform(dragX, [-50, 0, 50], [0.15, 0, 0.15]) }}
      >
        <span className="font-mono text-[10px] text-blue-300/30">◁</span>
        <span className="font-mono text-[10px] text-amber-300/30">▷</span>
      </motion.div>

      {/* 卡片本体 — 复用运势卡视觉风格 */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        style={{
          x: dragX,
          rotate,
          clipPath: "polygon(40px 0%, 100% 0%, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0% 100%, 0% 40px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: "grabbing" }}
        className="relative bg-[#121212] cursor-grab active:cursor-grabbing rounded-sm overflow-hidden"
      >
        {/* 网格线 */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-x-0 top-1/3 h-[1px] bg-white" />
          <div className="absolute inset-x-0 top-2/3 h-[1px] bg-white" />
          <div className="absolute left-1/3 inset-y-0 w-[1px] bg-white" />
          <div className="absolute left-2/3 inset-y-0 w-[1px] bg-white" />
        </div>

        {/* 角装饰 */}
        <div className="absolute top-0 right-0 w-12 h-12 border-r border-t border-primary/20 -translate-y-2 translate-x-2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-l border-b border-primary/20 translate-y-2 -translate-x-2 pointer-events-none" />

        {/* 内容 */}
        <div className="relative z-10 p-8 flex flex-col gap-6">
          {/* 顶部标签 */}
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] tracking-[0.4em] text-white/30 uppercase">
              {stageLabel ?? `${age} 岁`}
            </span>
            <span className="font-mono text-[10px] text-white/15">
              {event.type === "anchor" ? "锚点" : "事件"}
            </span>
          </div>

          {/* 标题 */}
          <h2 className="font-serif text-4xl sm:text-5xl tracking-tighter leading-none text-[#F0F0F0]">
            {event.title}
          </h2>
          <div className="h-[1px] bg-white/15 w-20" />

          {/* 描述 */}
          <p className="font-mono text-sm text-white/50 leading-relaxed">
            {event.description}
          </p>

          {/* 选项 — 始终可见 */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 p-3 border border-white/10 rounded-sm group cursor-pointer hover:border-blue-400/40 transition-colors"
              onClick={() => onChoose(0)}
            >
              <span className="font-mono text-[10px] text-blue-400/50 shrink-0">←</span>
              <span className="font-mono text-xs text-white/60 group-hover:text-white/90 transition-colors leading-tight">
                {choices[0]?.text ?? "—"}
              </span>
            </div>
            {choices.length > 1 && (
              <div className="flex items-center gap-2 p-3 border border-white/10 rounded-sm group cursor-pointer hover:border-amber-400/40 transition-colors text-right"
                onClick={() => onChoose(1)}
              >
                <span className="font-mono text-xs text-white/60 group-hover:text-white/90 transition-colors leading-tight flex-1">
                  {choices[1]?.text ?? "—"}
                </span>
                <span className="font-mono text-[10px] text-amber-400/50 shrink-0">→</span>
              </div>
            )}
            {choices.length <= 1 && <div />}
          </div>

          {/* 底部提示 */}
          <div className="flex justify-between items-center pt-2 border-t border-white/5">
            <span className="font-mono text-[8px] text-white/15 uppercase tracking-widest">
              ← 拖动或按键 →
            </span>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-primary/30" />
              ))}
            </div>
          </div>
        </div>

        {/* 外角装饰线 */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l border-t border-primary/15 -translate-x-3 -translate-y-3 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r border-b border-primary/15 translate-x-3 translate-y-3 pointer-events-none" />
      </motion.div>

      {/* 键盘操作提示 */}
      <p className="text-center mt-6 font-mono text-[10px] text-secondary/40 tracking-widest">
        ← → 方向键选择
      </p>
    </div>
  );
}
