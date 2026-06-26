// src/pages/LifePage.tsx
import { useReducer } from "react";
import { createInitialState, gameReducer } from "../engine/reducer";

export function LifePage() {
  const [state, dispatch] = useReducer(gameReducer, null, () => createInitialState());

  return (
    <div className="min-h-screen bg-canvas text-primary font-sans flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-serif text-6xl tracking-tighter mb-4">人生模拟器</h1>
        <p className="font-mono text-sm text-secondary">CMYS Life Simulator</p>
        <button
          onClick={() => dispatch({ type: "START_GAME" })}
          className="mt-8 px-8 py-3 border border-primary font-mono text-xs tracking-[0.3em] uppercase hover:bg-primary hover:text-canvas transition-colors"
        >
          开始人生
        </button>
      </div>
    </div>
  );
}
