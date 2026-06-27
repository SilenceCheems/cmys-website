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
  sealedTalent?: boolean;
  luckCursed?: boolean;
}

/** 分龄获取致死阈值：少年/青年归零才死，壮年/晚年 ≤10 即死 */
export function getLethalThreshold(age: number): number {
  if (age <= 30) return 0;
  return 10;
}

export function checkDeath(state: GameState): DeathCheck {
  const { age, attributes } = state;

  if (age <= 5) return { isDead: false };

  const threshold = getLethalThreshold(age);

  for (const attr of LETHAL_ATTRIBUTES) {
    if (attributes[attr] <= threshold) {
      const causeMap: Record<string, string> = {
        physique: "体质衰竭",
        appearance: "容颜尽毁",
        intelligence: "心智崩溃",
        wealth: "家道中落",
      };
      return {
        isDead: true,
        cause: `${causeMap[attr]}，生命走到了尽头`,
      };
    }
  }

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

  if (age >= 100) {
    return { isDead: true, cause: "寿终正寝，百年人生圆满落幕" };
  }

  return { isDead: false };
}

/** 随机意外死亡：按年龄分概率 */
export function checkRandomDeath(age: number): DeathCheck {
  if (age <= 17) return { isDead: false }; // 少年期无随机死亡

  let probability: number;
  if (age <= 30) probability = 0.01;       // 青年 1%/年
  else if (age <= 60) probability = 0.02;  // 壮年 2%/年
  else probability = 0.03;                  // 晚年 3%/年

  if (Math.random() < probability) {
    const causes = [
      "一场突如其来的车祸夺走了生命",
      "急病发作，医治无效",
      "天有不测风云，意外降临",
      "在睡梦中安然离世——太早了，但命运从不商量",
    ];
    return {
      isDead: true,
      cause: causes[Math.floor(Math.random() * causes.length)],
    };
  }

  return { isDead: false };
}

/** 体质自然衰减：30岁起每5年-1，仅整5年节点触发 */
export function applyNaturalDecay(age: number): Partial<Record<AttributeName, number>> {
  if (age <= 30) return {};
  if ((age - 30) % 5 === 0) return { physique: -1 };
  return {};
}
