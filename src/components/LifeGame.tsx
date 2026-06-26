// src/components/LifeGame.tsx
import { useReducer, createContext, useContext, useEffect, type Dispatch } from "react";
import type { GameState, GameAction } from "../engine/types";
import { createInitialState, gameReducer } from "../engine/reducer";
import { saveGame, hasSave, loadGame } from "../engine/autosave";
import { LifeTalentPicker } from "./LifeTalentPicker";
import { LifeInfancyStage } from "./LifeInfancyStage";
import { LifeYouthStage } from "./LifeYouthStage";
import { LifeMidlifeStage } from "./LifeMidlifeStage";
import { LifeDeathScreen } from "./LifeDeathScreen";

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
  const [state, dispatch] = useReducer(
    gameReducer,
    null,
    () => hasSave() ? loadGame()! : createInitialState(),
  );

  // 年龄段切换时自动保存
  useEffect(() => {
    saveGame(state);
  }, [state.age]);

  const ctx: LifeContextValue = { state, dispatch };

  const renderPhase = () => {
    const phase = state.phase;

    switch (phase.type) {
      case "talent_selection":
        return <LifeTalentPicker />;

      case "playing": {
        const { age } = state;
        const { currentEvent, pendingChoices } = state;

        // 按年龄段路由到不同组件
        if (age <= 5) return <LifeInfancyStage />;
        if (age <= 30) {
          if (currentEvent && pendingChoices) {
            return (
              <LifeYouthStage />
            );
          }
          return <LifeYouthStage />;
        }
        if (age <= 60) return <LifeMidlifeStage />;
        // 晚年期暂时复用 youth stage
        return <LifeYouthStage />;
      }

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
        return <LifeDeathScreen />;

      default:
        return null;
    }
  };

  return (
    <LifeContext.Provider value={ctx}>
      <div className="relative min-h-screen bg-canvas text-primary font-sans">
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
