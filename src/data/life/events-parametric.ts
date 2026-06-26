// src/data/life/events-parametric.ts
import type { ParametricEvent } from "../../engine/types";
import { createAge } from "../../engine/types";

export const PARAMETRIC_EVENTS: ParametricEvent[] = [
  // ── 少年期 6-17 ──
  {
    type: "parametric", id: "p_kid_study", title: "沉默有诗",
    description: "你在课堂上写出了一首诗，语文老师惊讶地看着你。",
    minAge: createAge(8), maxAge: createAge(14),
    statRequirements: { creativity: 5 }, weight: 2,
    choices: [
      { text: "继续写作", effects: { attributes: { creativity: 3 } } },
      { text: "觉得没什么大不了", effects: { attributes: {} } },
    ],
  },
  {
    type: "parametric", id: "p_kid_sport", title: "驰鸣羽势",
    description: "学校运动会。你站在百米起跑线上，风在耳边呼啸。",
    minAge: createAge(10), maxAge: createAge(16),
    statRequirements: { physique: 3 }, weight: 2,
    choices: [
      { text: "全力冲刺", effects: { attributes: { physique: 3, appearance: 1 } } },
      { text: "享受比赛", effects: { attributes: { physique: 1, luck: 1 } } },
    ],
  },
  {
    type: "parametric", id: "p_kid_friend", title: "藏猫引蛇",
    description: "你和朋友在巷子里捉迷藏，不小心踩翻了一个蜂窝。",
    minAge: createAge(8), maxAge: createAge(12), weight: 1,
    choices: [
      { text: "带朋友逃跑", effects: { attributes: { physique: 2, luck: -1 } } },
      { text: "用衣服驱赶蜜蜂", effects: { attributes: { physique: -1, intelligence: 1 } } },
    ],
  },
  {
    type: "parametric", id: "p_kid_art", title: "垂目言事",
    description: "学校举办了汉字大赛。你站在台上，目光低垂，心中自有丘壑。",
    minAge: createAge(10), maxAge: createAge(14),
    statRequirements: { intelligence: 5 }, weight: 2,
    choices: [
      { text: "稳定发挥", effects: { attributes: { intelligence: 2, appearance: 1 } } },
      { text: "冒险用生僻字", effects: { attributes: { intelligence: 3, luck: -1 } } },
    ],
  },

  // ── 青年期 18-30 ──
  {
    type: "parametric", id: "p_young_work", title: "策马越野",
    description: "你找到了第一份兼职工作。社会的第一课，比学校残酷。",
    minAge: createAge(19), maxAge: createAge(24),
    statRequirements: { intelligence: 3 }, weight: 3,
    choices: [
      { text: "踏实工作积累经验", effects: { attributes: { wealth: 2, intelligence: 1 } } },
      { text: "投机取巧走捷径", effects: { attributes: { wealth: 3, luck: -2 } } },
    ],
  },
  {
    type: "parametric", id: "p_young_travel", title: "辞母远涉",
    description: "你独自背包旅行。火车穿过陌生的田野，你感到前所未有的自由。",
    minAge: createAge(19), maxAge: createAge(26), weight: 2,
    choices: [
      { text: "深度体验当地文化", effects: { attributes: { creativity: 3, intelligence: 1 } } },
      { text: "拍照打卡发朋友圈", effects: { attributes: { appearance: 2 } } },
    ],
  },
  {
    type: "parametric", id: "p_young_network", title: "诚盟远溯",
    description: "一个重要的社交场合。你遇到了可以改变你职业轨迹的人。",
    minAge: createAge(22), maxAge: createAge(28),
    statRequirements: { appearance: 5 }, weight: 2,
    choices: [
      { text: "真诚介绍自己", effects: { attributes: { wealth: 3, luck: 2 } } },
      { text: "夸夸其谈", effects: { attributes: { wealth: 1, appearance: -1 } } },
    ],
  },
  {
    type: "parametric", id: "p_young_create", title: "纯美意识",
    description: "凌晨三点，你被一个绝妙的创意惊醒。你打开电脑，开始疯狂敲字。",
    minAge: createAge(20), maxAge: createAge(28),
    statRequirements: { creativity: 7 }, weight: 3,
    choices: [
      { text: "通宵完成它", effects: { attributes: { creativity: 5, physique: -2 } } },
      { text: "记录下来明天再说", effects: { attributes: { creativity: 2 } } },
    ],
  },
  {
    type: "parametric", id: "p_young_health", title: "长眠月食",
    description: "你连续熬夜后病倒了。高烧中，你梦见月亮被阴影吞没。",
    minAge: createAge(20), maxAge: createAge(28),
    statRequirements: { physique: 3 }, weight: 2, maxTriggers: 3,
    choices: [
      { text: "好好休养", effects: { attributes: { physique: 3 } } },
      { text: "硬撑着继续工作", effects: { attributes: { physique: -3, intelligence: 1 } } },
    ],
  },
  {
    type: "parametric", id: "p_young_money", title: "错买饮食",
    description: "你心血来潮做了一笔投资，但标的不太对劲。",
    minAge: createAge(22), maxAge: createAge(30), weight: 1,
    choices: [
      { text: "及时止损", effects: { attributes: { wealth: -1, intelligence: 1 } } },
      { text: "加倍投入博反弹", effects: { attributes: { wealth: -3, luck: -2 }, isLethal: false } },
    ],
  },

  // ── 壮年期 31-60 ──
  {
    type: "parametric", id: "p_mid_career", title: "仓廪殷实",
    description: "你的事业到了关键转折点。一个重大项目摆在面前，成则飞升，败则重来。",
    minAge: createAge(31), maxAge: createAge(50), weight: 3,
    choices: [
      { text: "全力以赴", effects: { attributes: { wealth: 5, intelligence: 2, physique: -2 } } },
      { text: "委托团队稳健推进", effects: { attributes: { wealth: 2, luck: 1 } } },
    ],
  },
  {
    type: "parametric", id: "p_mid_family", title: "春梦永世",
    description: "你站在婚礼的殿堂上，看着TA的眼睛。这一生的承诺，从此刻开始。",
    minAge: createAge(25), maxAge: createAge(35), weight: 2,
    maxTriggers: 1,
    choices: [
      { text: "深情宣誓", effects: { attributes: { luck: 3, creativity: 2 } } },
      { text: "务实规划未来", effects: { attributes: { wealth: 2, intelligence: 2 } } },
    ],
  },
  {
    type: "parametric", id: "p_mid_crisis", title: "愁眠雨声",
    description: "中年危机如约而至。你坐在深夜的阳台上，雨声敲打着内心的不安。",
    minAge: createAge(38), maxAge: createAge(50), weight: 2,
    choices: [
      { text: "重新审视人生方向", effects: { attributes: { creativity: 3, intelligence: 2 } } },
      { text: "买一辆跑车", effects: { attributes: { wealth: -2, appearance: 1 } } },
    ],
  },
  {
    type: "parametric", id: "p_mid_health", title: "草木有衰",
    description: "体检报告上出现了几个红字。你盯着它们，第一次认真思考'健康'的意义。",
    minAge: createAge(40), maxAge: createAge(55), weight: 2,
    choices: [
      { text: "开始规律运动", effects: { attributes: { physique: 5 } } },
      { text: "无所谓，继续喝酒", effects: { attributes: { physique: -5, luck: -2 } } },
    ],
  },
  {
    type: "parametric", id: "p_mid_invest", title: "孤注一掷",
    description: "一个朋友拉你合伙创业。你看着商业计划书，热血沸腾。",
    minAge: createAge(32), maxAge: createAge(45),
    statRequirements: { wealth: 5 }, weight: 2,
    choices: [
      { text: "全力投入创业", effects: { attributes: { wealth: 6, intelligence: 2, physique: -3 } } },
      { text: "谨慎注资，不参与管理", effects: { attributes: { wealth: 2, luck: 1 } } },
    ],
  },

  // ── 晚年期 61-100 ──
  {
    type: "parametric", id: "p_elder_retire", title: "垂暮夜色",
    description: "你退休了。数十年的职场生涯在一场简单的告别会上画上句号。",
    minAge: createAge(60), maxAge: createAge(65), weight: 3,
    choices: [
      { text: "开启人生第二春", effects: { attributes: { creativity: 5, luck: 2 } } },
      { text: "享受悠闲时光", effects: { attributes: { physique: 3, wealth: -1 } } },
    ],
  },
  {
    type: "parametric", id: "p_elder_memory", title: "沉默有诗",
    description: "你开始写回忆录。翻看旧照片，每一张都是凝固的时光。",
    minAge: createAge(65), maxAge: createAge(80), weight: 2,
    statRequirements: { creativity: 5 },
    choices: [
      { text: "写出真实的故事", effects: { attributes: { creativity: 5, luck: 2 } } },
      { text: "美化过去", effects: { attributes: { creativity: 2 } } },
    ],
  },
  {
    type: "parametric", id: "p_elder_legacy", title: "草木一生",
    description: "你开始思考这一生留下了什么。后代？作品？还是只是一个故事？",
    minAge: createAge(70), maxAge: createAge(85), weight: 2,
    choices: [
      { text: "把经验传授给年轻人", effects: { attributes: { intelligence: 3, luck: 3 } } },
      { text: "写一份遗嘱清单", effects: { attributes: { wealth: 2 } } },
    ],
  },
  {
    type: "parametric", id: "p_elder_peace", title: "纯美月色",
    description: "某个夜晚，你独自坐在院子里。月光清澈如水，你感到前所未有的平静。",
    minAge: createAge(75), maxAge: createAge(90), weight: 2,
    choices: [
      { text: "享受这片刻宁静", effects: { attributes: { luck: 5, creativity: 2 } } },
      { text: "叫家人一起赏月", effects: { attributes: { appearance: 2, luck: 3 } } },
    ],
  },
  {
    type: "parametric", id: "p_elder_end", title: "尘梦影逝",
    description: "你感到大限将至。这一生的画面如走马灯般闪过。有人说人在死前会看到一生的闪回。",
    minAge: createAge(85), maxAge: createAge(99), weight: 3,
    choices: [
      { text: "坦然面对", effects: { attributes: {}, isLethal: false } },
    ],
  },
];
