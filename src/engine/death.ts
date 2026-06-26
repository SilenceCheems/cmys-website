// src/engine/death.ts
import type { GameState, AttributeName } from "./types";

const LETHAL_ATTRIBUTES: AttributeName[] = ["appearance", "intelligence", "physique", "wealth"];

const ZERO_PENALTY: Record<string, string> = {
  creativity: "才脉尽失，你的天赋被封印了一个",
  luck: "运势耗尽，前路晦暗不明",
};

export interface DeathCheck {
  isDead: boolean;
  cause?: string;
  penalty?: { attribute: AttributeName; description: string };
  sealedTalent?: boolean; // 才脉归零时封印天赋
  luckCursed?: boolean;   // 运势归零时概率翻倍负面
}

export function checkDeath(state: GameState): DeathCheck {
  const { age, attributes } = state;

  // 婴儿安全期
  if (age <= 5) return { isDead: false };

  // 检查致死属性
  for (const attr of LETHAL_ATTRIBUTES) {
    if (attributes[attr] <= 0) {
      return {
        isDead: true,
        cause: `${attr === "physique" ? "体质衰竭" : attr === "appearance" ? "容颜尽毁" : attr === "intelligence" ? "心智崩溃" : "家道中落"}，生命走到了尽头`,
      };
    }
  }

  // 检查惩罚属性
  if (attributes.creativity <= 0) {
    return {
      isDead: false,
      penalty: { attribute: "creativity", description: ZERO_PENALTY.creativity },
      sealedTalent: true,
    };
  }

  if (attributes.luck <= 0) {
    return {
      isDead: false,
      penalty: { attribute: "luck", description: ZERO_PENALTY.luck },
      luckCursed: true,
    };
  }

  // 自然老死
  if (age >= 100) {
    return { isDead: true, cause: "寿终正寝，百年人生圆满落幕" };
  }

  return { isDead: false };
}

// 体质自然衰减：30岁起每5年-1
export function applyNaturalDecay(age: number): Partial<Record<AttributeName, number>> {
  if (age < 30) return {};
  const decay = Math.floor((age - 30) / 5);
  return { physique: -Math.min(decay, 14) }; // 最多 -14
}
