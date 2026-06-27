// src/components/LifeContext.tsx
import { createContext, useContext, type Dispatch } from "react";
import type { GameState, GameAction } from "../engine/types";

export interface LifeContextValue {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

export const LifeContext = createContext<LifeContextValue | null>(null);

export function useLife() {
  const ctx = useContext(LifeContext);
  if (!ctx) throw new Error("useLife must be used within LifeGame");
  return ctx;
}
