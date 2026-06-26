// src/data/life/events-anchors.ts
import type { AnchorEvent } from "../../engine/types";
import { createAge } from "../../engine/types";

export const ANCHOR_EVENTS: AnchorEvent[] = [
  // ── 婴幼期 0-5 ──
  {
    type: "anchor", id: "a_birth", title: "初梦未逝",
    description: "你诞生在这个世界上，第一声啼哭惊醒了沉眠的夜色。新乡的天空布满星辰。",
    minAge: createAge(0), maxAge: createAge(0), triggerAge: 0,
    choices: [{ text: "（自动）", effects: { attributes: { physique: 2, luck: 2 } } }],
  },
  {
    type: "anchor", id: "a_firstword", title: "沉默有诗",
    description: "你学会说第一个字，大人们围着你，期待着一个天才的诞生。",
    minAge: createAge(1), maxAge: createAge(1), triggerAge: 1,
    choices: [
      { text: "（自动）", effects: { attributes: { intelligence: 2, creativity: 1 } } },
    ],
  },
  {
    type: "anchor", id: "a_kindergarten", title: "春苗雨苏",
    description: "你进入幼儿园。老师说你是个安静的孩子，但眼睛里藏着星辰大海。",
    minAge: createAge(3), maxAge: createAge(3), triggerAge: 3,
    choices: [{ text: "（自动）", effects: { attributes: { intelligence: 1, creativity: 1 } } }],
  },
  {
    type: "anchor", id: "a_child_end", title: "纯美意识",
    description: "你五岁了，对于世界有了模糊但纯粹的认识。童年的画卷徐徐展开。",
    minAge: createAge(5), maxAge: createAge(5), triggerAge: 5,
    choices: [{ text: "（自动）", effects: { attributes: { intelligence: 2, creativity: 2 } } }],
  },

  // ── 少年期 6-17 ──
  {
    type: "anchor", id: "a_primary", title: "出马应试",
    description: "你进入小学。第一次考试，你握紧铅笔，手心出汗。",
    minAge: createAge(6), maxAge: createAge(6), triggerAge: 6,
    choices: [
      { text: "认真答题", effects: { attributes: { intelligence: 3 } } },
      { text: "偷偷看同桌", effects: { attributes: { intelligence: 1, luck: -2 } } },
    ],
  },
  {
    type: "anchor", id: "a_go_start", title: "揣猫一身",
    description: "你开始学围棋。黑白棋子如星辰布阵，你第一次体会到'势'的感觉。",
    minAge: createAge(7), maxAge: createAge(7), triggerAge: 7,
    choices: [
      { text: "专心学棋", effects: { attributes: { intelligence: 2, creativity: 2 } } },
      { text: "只想随便玩玩", effects: { attributes: { intelligence: 1 } } },
    ],
  },
  {
    type: "anchor", id: "a_mid_school", title: "策马越野",
    description: "你进入初中。新的环境，新的同学，你感到自己正在加速成长。",
    minAge: createAge(12), maxAge: createAge(12), triggerAge: 12,
    choices: [
      { text: "努力学习", effects: { attributes: { intelligence: 3, creativity: 1 } } },
      { text: "多交朋友", effects: { attributes: { appearance: 2, wealth: 1 } } },
    ],
  },
  {
    type: "anchor", id: "a_flood", title: "踩没雨水",
    description: "7·21 新乡特大暴雨。洪水吞噬了街道，你趟过齐腰深的水，帮助邻居搬运物资。",
    minAge: createAge(14), maxAge: createAge(14), triggerAge: 14,
    choices: [
      { text: "全力抗洪救灾", effects: { attributes: { physique: 3, luck: 2 } } },
      { text: "保自己安全为先", effects: { attributes: { physique: 1 } } },
    ],
  },
  {
    type: "anchor", id: "a_high_school", title: "沉默预说",
    description: "进入高中。你担任了班干部，学会了在沉默中观察，在关键时表达。",
    minAge: createAge(15), maxAge: createAge(15), triggerAge: 15,
    choices: [
      { text: "积极管理班级", effects: { attributes: { appearance: 2, intelligence: 1 } } },
      { text: "专注自己学业", effects: { attributes: { intelligence: 3 } } },
    ],
  },

  // ── 青年期 18-30 ──
  {
    type: "anchor", id: "a_gaokao", title: "出马应试",
    description: "高考。十二年磨一剑，你走进考场，笔尖落纸的声音像千军万马。",
    minAge: createAge(18), maxAge: createAge(18), triggerAge: 18,
    choices: [
      { text: "全力以赴", effects: { attributes: { intelligence: 5, luck: 2 } } },
      { text: "心态平和，尽力就好", effects: { attributes: { intelligence: 3, creativity: 2 } } },
    ],
  },
  {
    type: "anchor", id: "a_university", title: "辞母远送",
    description: "你离开家乡上大学。母亲在车站挥手的身影越来越小，你第一次真正感到'独立'的重量。",
    minAge: createAge(19), maxAge: createAge(19), triggerAge: 19,
    choices: [
      { text: "拥抱母亲，承诺常回家", effects: { attributes: { creativity: 2, luck: 2 } } },
      { text: "头也不回地走", effects: { attributes: { intelligence: 3, wealth: -1 } } },
    ],
  },
  {
    type: "anchor", id: "a_love_first", title: "春梦一时",
    description: "第一次心动。那个人出现在图书馆的窗边，阳光正好。",
    minAge: createAge(20), maxAge: createAge(22), triggerAge: 20,
    choices: [
      { text: "鼓起勇气表白", effects: { attributes: { appearance: 2, luck: 3 } } },
      { text: "默默藏在心里", effects: { attributes: { creativity: 2 } } },
    ],
  },
  {
    type: "anchor", id: "a_graduate", title: "歧路无归",
    description: "大学毕业了。同窗四散，各奔前程。你站在校门口，不知道下一步该往哪里走。",
    minAge: createAge(22), maxAge: createAge(23), triggerAge: 22,
    choices: [
      { text: "投身职场，大干一场", effects: { attributes: { wealth: 3, intelligence: 2 } } },
      { text: "继续深造，充实自己", effects: { attributes: { intelligence: 4, creativity: 1 } } },
    ],
  },

  // ── 壮年期 31-60 ──
  {
    type: "anchor", id: "a_mid_peak", title: "仓廪实知",
    description: "事业如日中天。你站在办公室的落地窗前，俯瞰这座城市，想起当年那个懵懂的少年。",
    minAge: createAge(35), maxAge: createAge(40), triggerAge: 38,
    choices: [
      { text: "乘胜追击，再上一层", effects: { attributes: { wealth: 5, physique: -1 } } },
      { text: "开始思考人生的意义", effects: { attributes: { creativity: 3, luck: 2 } } },
    ],
  },

  // ── 晚年期 61-100 ──
  {
    type: "anchor", id: "a_elder_twilight", title: "暮色沉金",
    description: "你老了。某个黄昏，你坐在老屋的门槛上，夕阳把一切都镀成了金色。这一生，值了吗？",
    minAge: createAge(65), maxAge: createAge(70), triggerAge: 68,
    choices: [
      { text: "这一生没有遗憾", effects: { attributes: { luck: 5, creativity: 3 } } },
      { text: "还有太多未完成的事", effects: { attributes: { intelligence: 3, physique: -2 } } },
    ],
  },
];
