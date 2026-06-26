// src/components/LifeGame.tsx
import { useReducer, createContext, useContext, type Dispatch } from "react";
import type { GameState, GameAction, GamePhase } from "../engine/types";
import { createInitialState, gameReducer } from "../engine/reducer";
import { checkDeath } from "../engine/death";

interface LifeContextValue {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export const LifeContext = createContext<LifeContextValue | null>(null);

export function useLife() {
  const ctx = useContext(LifeContext);
  if (!ctx) throw new Error("useLife must be used within LifeGame");
  return ctx;
}

export function LifeGame() {
  const [state, dispatch] = useReducer(gameReducer, null, () => createInitialState());

  const ctx: LifeContextValue = { state, dispatch };

  const renderPhase = () => {
    const phase = state.phase;

    switch (phase.type) {
      case "talent_selection":
        return (
          <div className="flex items-center justify-center h-full">
            <p className="font-mono text-sm text-secondary">天赋选择 (第 {phase.round + 1} 轮)</p>
          </div>
        );

      case "playing":
        return (
          <div className="flex flex-col items-center justify-center gap-8 h-full">
            <div className="text-center">
              <p className="font-serif text-8xl tracking-tighter">{state.age}</p>
              <p className="font-mono text-xs text-secondary mt-2">岁</p>
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {Object.entries(state.attributes).map(([key, val]) => (
                <div key={key} className="px-3 py-1 border border-primary/20">
                  {key}: {val as number}
                </div>
              ))}
            </div>
            <button
              onClick={() => dispatch({ type: "ADVANCE_AGE" })}
              className="px-6 py-2 border border-primary font-mono text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-canvas transition-colors"
            >
              推进年龄
            </button>
          </div>
        );

      case "dying":
        return (
          <div className="flex flex-col items-center justify-center gap-6">
            <p className="font-serif text-3xl tracking-tighter">生命终结</p>
            <p className="font-mono text-sm text-secondary">{phase.cause}</p>
            <button
              onClick={() => dispatch({ type: "SHOW_RESULT" })}
              className="px-6 py-2 border border-primary font-mono text-xs tracking-[0.2em] uppercase"
            >
              查看结局
            </button>
          </div>
        );

      case "result":
        return (
          <div className="flex flex-col items-center justify-center gap-6">
            <p className="font-serif text-4xl tracking-tighter">人生回顾</p>
            <p className="font-mono text-sm text-secondary">终年 {state.age} 岁</p>
            <button
              onClick={() => dispatch({ type: "RESTART" })}
              className="px-6 py-2 border border-primary font-mono text-xs tracking-[0.2em] uppercase"
            >
              重新开始
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <LifeContext.Provider value={ctx}>
      <div className="relative min-h-screen bg-canvas text-primary font-sans">
        {/* 背景网格 */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          {renderPhase()}
        </div>
      </div>
    </LifeContext.Provider>
  );
}
