// src/engine/career.ts
import type { Career, CareerPath, GameState, AttributeName } from "./types";

const CAREER_TITLES: Record<NonNullable<CareerPath>, Record<number, string>> = {
  academic: {
    1: "求知学徒", 3: "青年学者", 5: "副教授", 7: "学术带头人", 10: "一代宗师",
  },
  merchant: {
    1: "小商小贩", 3: "创业者", 5: "企业家", 7: "行业翘楚", 10: "商业巨擘",
  },
  artist: {
    1: "文艺青年", 3: "小有名气", 5: "知名创作者", 7: "大师级", 10: "传奇艺术家",
  },
};

export function determineCareerPath(state: GameState): CareerPath {
  const { attributes } = state;
  const academicScore = attributes.intelligence + attributes.creativity;
  const merchantScore = attributes.intelligence + attributes.wealth;
  const artistScore = attributes.creativity + attributes.appearance;

  if (academicScore >= merchantScore && academicScore >= artistScore) return "academic";
  if (merchantScore >= artistScore) return "merchant";
  return "artist";
}

export function checkCareerAdvancement(state: GameState): Career | null {
  if (state.age < 18) return null;

  const current = state.career;
  const path = current?.path ?? determineCareerPath(state);

  if (!path) return null;

  // 基础等级：年龄和智力相关
  let level = Math.min(10, Math.floor((state.age - 18) / 4) + 1);

  // 属性加成
  const attrs = state.attributes;
  if (path === "academic") level = Math.min(10, level + Math.floor((attrs.intelligence - 5) / 3));
  if (path === "merchant") level = Math.min(10, level + Math.floor((attrs.wealth - 5) / 3));
  if (path === "artist") level = Math.min(10, level + Math.floor((attrs.creativity - 5) / 3));

  level = Math.max(1, level);

  // 找到对应称号
  const milestones = Object.entries(CAREER_TITLES[path])
    .filter(([lvl]) => level >= Number(lvl))
    .map(([lvl, title]) => title);

  let title = CAREER_TITLES[path][1]!;
  for (const [lvl, t] of Object.entries(CAREER_TITLES[path])) {
    if (level >= Number(lvl)) title = t!;
  }

  return { path, title, level, milestones };
}
