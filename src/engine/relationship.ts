// src/engine/relationship.ts
import type { Relationship, GameState, AttributeName } from "./types";

const CONFIANT_NAMES = ["林默语", "苏夜白", "叶知秋", "墨染霜", "柳如烟", "江暮云"];
const CONFIANT_TAGS = ["温润如玉", "锋芒毕露", "淡泊如水", "炽烈如火", "深藏不露"];

export function generateConfidant(): Relationship {
  return {
    id: `rel_${Date.now()}`,
    name: CONFIANT_NAMES[Math.floor(Math.random() * CONFIANT_NAMES.length)],
    tag: "confidant",
    affinity: Math.floor(Math.random() * 41) - 20, // -20 ~ +20 初始好感
  };
}

export function updateAffinity(
  rel: Relationship,
  change: number
): Relationship {
  return {
    ...rel,
    affinity: Math.max(-100, Math.min(100, rel.affinity + change)),
  };
}

export function getConfidant(state: GameState): Relationship | null {
  return state.relationships.find((r) => r.tag === "confidant") ?? null;
}
