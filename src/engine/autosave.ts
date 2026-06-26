// src/engine/autosave.ts
import type { GameState } from "./types";

const SAVE_KEY = "cmys_life_autosave";

interface SaveData {
  state: GameState;
  timestamp: number;
}

/** 序列化时处理 Set */
function serializeState(state: GameState): string {
  return JSON.stringify({
    ...state,
    triggeredEventIds: [...state.triggeredEventIds],
    currentEvent: state.currentEvent,
    pendingChoices: state.pendingChoices,
  });
}

function deserializeState(json: string): GameState {
  const raw = JSON.parse(json);
  return {
    ...raw,
    triggeredEventIds: new Set(raw.triggeredEventIds ?? []),
  };
}

/**
 * 在关键年龄节点自动存档。
 * 存档年龄点：6岁（小学）、18岁（成年）、31岁（而立）、61岁（退休）。
 */
export function saveGame(state: GameState): void {
  const SAVE_CHECKPOINTS = [6, 18, 31, 61];
  if (!SAVE_CHECKPOINTS.includes(state.age as number)) return;

  try {
    const data: SaveData = { state, timestamp: Date.now() };
    localStorage.setItem(SAVE_KEY, serializeState(state));
  } catch {
    // localStorage 满或不可用，静默失败
  }
}

/** 检查是否存在存档 */
export function hasSave(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}

/** 读取存档，解析失败时自动清除无效存档 */
export function loadGame(): GameState | null {
  try {
    const json = localStorage.getItem(SAVE_KEY);
    if (!json) return null;
    return deserializeState(json);
  } catch {
    clearSave();
    return null;
  }
}

/** 清除存档 */
export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // 静默失败
  }
}
