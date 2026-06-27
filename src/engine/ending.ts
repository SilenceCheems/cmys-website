// src/engine/ending.ts
import type { GameState, GameResult } from "./types";

export function computeResult(state: GameState): GameResult {
  const { attributes, eventLog, relationships, career, age } = state;

  // 属性总评分（0~600）
  const attrSum = Object.values(attributes).reduce((sum, v) => sum + v, 0);

  // 职业加成
  const careerBonus = career ? career.level * 5 : 0;

  // 关系加成
  const relBonus = relationships.reduce((sum, r) => sum + Math.max(0, r.affinity), 0) / 2;

  // 事件多样性加成
  const uniqueEvents = new Set(eventLog.map((e) => e.eventId)).size;
  const eventBonus = Math.min(50, uniqueEvents * 2);

  const totalScore = attrSum + careerBonus + relBonus + eventBonus;

  // 评星
  let starRating: number;
  if (totalScore >= 500) starRating = 5;
  else if (totalScore >= 400) starRating = 4;
  else if (totalScore >= 250) starRating = 3;
  else if (totalScore >= 150) starRating = 2;
  else starRating = 1;

  // 生成标题
  const titles: Record<number, string[]> = {
    1: ["草木一瞬", "过客匆匆", "浮萍无根"],
    2: ["寂寥旅人", "安分耕者", "平凡过客"],
    3: ["功成身退", "诗酒趁年华", "不负此生"],
    4: ["沧海一声笑", "此心安处是吾乡", "青云直上"],
    5: ["半生戎马半生花", "一世风雨一世霞", "万古长空一轮月"],
  };

  const pool = titles[starRating] ?? titles[1];
  const title = pool[Math.floor(Math.random() * pool.length)];

  // 人生亮点
  const highlights: string[] = [];
  if (attrSum >= 400) highlights.push("六边形战士——属性全面发展");
  if (career && career.level >= 7) highlights.push(`${career.title}——职业生涯辉煌`);
  if (age >= 90) highlights.push("长寿之人——享年九旬以上");
  if (uniqueEvents >= 30) highlights.push("经历丰富——人生波澜壮阔");

  return {
    starRating,
    title,
    description: `享年 ${age} 岁，总评分 ${Math.round(totalScore)}`,
    totalScore: Math.round(totalScore),
    highlights: highlights.length > 0 ? highlights : ["平平淡淡才是真"],
  };
}
