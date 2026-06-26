// src/engine/reducer.ts
import {
  type GameState, type GameAction, type Attributes, type AttributeName,
  attr, createAge,
} from "./types";

// ── 属性初始化 ──
function rollD6(): number {
  return Math.floor(Math.random() * 4) + 2; // 2~5
}

export function createInitialAttributes(bonusPoints: Partial<Record<AttributeName, number>> = {}): Attributes {
  const base: Attributes = {
    appearance: attr(rollD6()),
    intelligence: attr(rollD6()),
    physique: attr(rollD6()),
    wealth: attr(rollD6()),
    creativity: attr(rollD6()),
    luck: attr(rollD6()),
  };

  // 应用玩家分配的 5 点
  const bonusEntries = Object.entries(bonusPoints) as [AttributeName, number][];
  for (const [key, val] of bonusEntries) {
    if (val > 0) {
      base[key] = attr(base[key] + val);
    }
  }

  return base;
}

// ── 初始状态 ──
export function createInitialState(talents: string[] = []): GameState {
  return {
    phase: { type: "talent_selection", round: 0 },
    age: createAge(0),
    attributes: createInitialAttributes(),
    talents: [],
    relationships: [],
    career: null,
    eventLog: [],
    triggeredEventIds: new Set(),
    currentEvent: null,
    pendingChoices: null,
    deathRecord: null,
  };
}

// ── Reducer ──
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return { ...state, phase: { type: "playing", step: "aging" }, age: createAge(0) };

    case "ADVANCE_AGE":
      return { ...state, phase: { type: "playing", step: "aging" } };

    case "TRIGGER_DEATH":
      return {
        ...state,
        phase: { type: "dying", cause: action.cause },
        deathRecord: { age: state.age, cause: action.cause },
      };

    case "SHOW_RESULT":
      return { ...state, phase: { type: "result" } };

    case "RESTART":
      return createInitialState();

    default:
      return state;
  }
}
