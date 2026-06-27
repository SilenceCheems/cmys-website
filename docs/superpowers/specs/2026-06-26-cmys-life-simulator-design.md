# CMYS 人生模拟器 — 设计规格

## 概述

在 CMYS 个人网站 `/life` 路由下新增一个"人生重开模拟器"风格的文字冒险游戏。所有事件标题 **必须包含 CMYS 四字汉字缩写**，融合 CMYS 真实经历（半真实半虚构），0~100 岁全生命周期。

---

## 一、核心属性（6 维）

| 属性 | 含义 | 范围 | 致死? |
|------|------|------|-------|
| 颜值 | 外貌吸引力 | 0~100 | **是** |
| 智力 | 学识/逻辑能力 | 0~100 | **是** |
| 体质 | 身体健康度 | 0~100 | **是** |
| 家境 | 经济/家庭资源 | 0~100 | **是** |
| 才脉 | 创造力/艺术天赋 | 0~100 | 否（归零触发严重惩罚） |
| 运势 | 机缘/随机事件偏向 | 0~100 | 否（归零触发严重惩罚） |

**初始值：** 随机基底 D6(2~5) + 玩家分配 5 点，天赋修正叠加。

**属性约束：** 始终 clamp 在 [0, 100]，引擎纯函数保证。

**才脉/运势归零惩罚：** 才脉归零 → 封印 1 个天赋；运势归零 → 正面事件概率减半、负面翻倍，持续至恢复正数。

---

## 二、死亡机制

三种死亡路径，任一触发即结束：

1. **属性归零致死** — 颜值/智力/体质/家境 任一归零 → 死亡
2. **事件致死** — 特定事件分支选择错误 → 死亡
3. **自然老死** — 活到 100 岁 → 自然结算

**婴儿安全期：** 0~5 岁禁止所有死亡判定。

**体质自然衰减：** 从 30 岁起，体质每 5 年 -1（自然衰老），可通过锻炼/医疗事件抵消。

---

## 三、年龄分段（5+1 段 + 终局）

| 段 | 年龄 | 节奏 | 事件数 | 特征 |
|----|------|------|--------|------|
| 婴幼期 | 0~5 | 自动叙事 | 6 年自动推进 | 天赋展现，无玩家选择，不致死 |
| 少年期 | 6~17 | 每岁 1 事件 | 12 个 | 学习/成长，CMYS 真实经历密集 |
| 青年期 | 18~30 | 每岁 1 事件 | 13 个 | 事业起步/关系，真实彩蛋 + 虚构分支 |
| 壮年期 | 31~60 | 每 3 年 1 事件 | 10 个 | 职业巅峰/家庭，综合事件含多分支 |
| 晚年期 | 61~100 | 每 5~10 年 1 事件 | 4~6 个 | 反思模式，callback 前期选择 |
| +1 终局 | 死亡时 | - | 1 | 结算动画 |

**总交互次数：** 约 40~45 次，一局约 12~18 分钟。

---

## 四、天赋系统

### 选择方式
开局 3 轮 × 每轮 3 选 1 = **3 个天赋**。

### 时效性分类
- **童年天赋**（0~17 岁生效）：如"出马应试"
- **壮年天赋**（18~60 岁生效）：如"策马越野"
- **终身天赋**（全年龄生效，效果较弱）：如"揣摩运势"

### 双刃剑设计
每个天赋同时有正面和负面效果，示例：

| 天赋 | 正面 | 负面 |
|------|------|------|
| 出马应试 | 考试/考核事件加成 +15% | 长期压力，体质逐年 -1（至 25 岁） |
| 沉默有诗 | 创作事件产出 +20% | 社交事件成功率 -10% |
| 辞母远送 | 远行/搬迁事件收益翻倍 | 家庭关系基础值 -20 |
| 长眠月食 | 低谷恢复时全属性 +5（持续 3 年） | 低谷期延长 50% |
| 仓廪殷实 | 每回合家境 +20% | 过度安逸，冒险事件概率 -30% |

### 互斥机制
同类标签天赋不可同时选择（如两个"考试"标签天赋互斥）。

### 天赋来源
全部从 CMYS 四字缩写词库（现有 ~99 个 + 新造 ~46~80 个）中选取。

---

## 五、事件系统

### 核心规则
**所有事件标题必须是 CMYS 四字汉字缩写。**

### 三层架构

| 层级 | 数量 | 说明 |
|------|------|------|
| 锚点事件 | ~30 个 | 固定年龄/条件触发，手写叙事，含 CMYS 真实彩蛋 |
| 参数化事件 | ~60 个 | 模板复用 + 条件筛选，覆盖日常场景 |
| 程序事件 | 若干 | 引擎按规则自动生成，纯属性加减，不占标题 |

### 造词规则（新四字缩写）

**模板 A：动作 + 对象**
格式：`[双音节动词] + [双音节名词]`，如"研读古籍""修筑栈道"

**模板 B：意象对仗**
格式：`[前三字场景/后二字结果]`，如"寒梅雪融""孤舟夜泊"

**模板 C：状态 + 行为**
格式：`[双音节状态] + [双音节行为]`，如"独坐观星""静听风吟"

**禁忌：** 禁止现代网络梗、超过 4 字、过于琐碎的词（"吃/喝/猫/鼠"适度使用）。

### 事件数据结构
```typescript
type GameEvent = AnchorEvent | ParametricEvent | ProceduralEvent;

interface EventBase {
  id: string;
  title: string;       // CMYS 四字缩写
  description: string;
  condition?: EventCondition;
}

interface AnchorEvent extends EventBase {
  type: "anchor";
  triggerAge: number | number[];
  choices: EventChoice[];
}

interface ParametricEvent extends EventBase {
  type: "parametric";
  templateSlots: Record<string, string[]>;
  statRequirements?: Partial<Stats>;
  choices: EventChoice[];
}

interface ProceduralEvent extends EventBase {
  type: "procedural";
  generationRule: string;
  autoResolve: true;
}

interface EventChoice {
  text: string;
  effects: {
    attributes?: Partial<Record<AttributeName, number>>;
    grantTalents?: string[];
    removeTalents?: string[];
    triggerEventId?: string;
    relationshipEffect?: { targetId: string; change: number };
  };
}
```

### 事件筛选
两级索引：按年龄段预分组（`Map<decade, GameEvent[]>`），再按属性/天赋条件 filter。每年从符合条件的事件池中加权随机选 3~5 个候选。

### 重复控制
`maxTriggers` 字段控制：0=不限，1=仅一次（如"初恋""高考"），N=最多 N 次。

---

## 六、关系系统（轻量 MVP）

### 知己角色
开局生成 1 个"知己"角色（随机姓名 + 性格标签），好感度 -100~+100。

### 关系事件
部分事件影响知己好感度，好感度影响后续事件的解锁和分支。

### 数据结构
```typescript
interface Relationship {
  id: string;
  name: string;
  tag: string;        // "知己" | "伴侣" | "挚友" | "对手"
  affinity: number;   // -100 ~ +100
}
```

### 后期扩展
v1 仅 1 个知己角色，后续可扩展更多 NPC 类型。

---

## 七、职业路径（轻量 MVP）

### 学业线（0~22 岁）
自动推进，根据智力/才脉属性自动分流：重点高中 / 普通高中 / 职校 / 辍学。

### 三条职业路线（18 岁后根据学业 + 属性自动开启）
| 路线 | 核心属性 | 典型事件 |
|------|---------|---------|
| 学术路线 | 智力 + 才脉 | 科研突破 / 教书育人 / 著作等身 |
| 商贾路线 | 智力 + 家境 | 创业 / 投资 / 产业扩张 |
| 文艺路线 | 才脉 + 颜值 | 创作 / 演出 / 获奖 |

职业不是强制选择，属性达标 + 事件选择自动进入，可跨路线发展。

---

## 八、结局系统

### 评星标准
基于属性总和 + 特殊成就 + 关系深度 + 职业成就综合评分。

### 结局称号（与运势签彻底切割，不使用四字缩写词池）

| 星级 | 风格 | 示例 |
|------|------|------|
| 1★ 悲惨 | 单字 + 状态 | "草木一瞬"、"过客" |
| 2★ 平凡 | 四字短语 | "寂寥旅人"、"安分耕者" |
| 3★ 优秀 | 成语式 | "功成身退"、"诗酒趁年华" |
| 4★ 卓越 | 五言短语 | "沧海一声笑"、"此心安处是吾乡" |
| 5★ 传说 | 骈文对句 | "半生戎马半生花，一世风雨一世霞" |

### 隐藏结局
特定条件触发（如全属性同时归零触发"草木有死"等）。

### 人生回顾
结算展示关键事件时间线 + 属性变化图 + 知己关系总结。

---

## 九、存档策略

**单自动档覆盖写：**
- 每进入新年龄段（6/18/31/61 岁）时静默保存
- localStorage key: `cmys_life_autosave`
- 存储内容：年龄段 + 属性值 + 天赋 + 关键事件 ID 列表
- 开局检测到存档时显示"继续上次的旅程"选项
- **不允许手动存/读档**，守住"不能读档重选"底线
- "重新开始"覆盖旧存档

---

## 十、技术架构

### 文件结构（保持扁平）

```
src/
  engine/
    types.ts           # 所有类型定义
    reducer.ts         # gameReducer 纯函数
    events.ts          # 事件生成/筛选逻辑
    death.ts           # 死亡判定
    talent.ts          # 天赋系统
    career.ts          # 职业路径逻辑
    relationship.ts    # 关系系统逻辑
    ending.ts          # 结局计算
  components/
    LifeGame.tsx        # 主容器（state machine orchestration）
    LifeTalentPicker.tsx
    LifeInfancyStage.tsx
    LifeYouthStage.tsx
    LifeMidlifeStage.tsx
    LifeElderlyStage.tsx
    LifeDeathScreen.tsx
    LifeEventCard.tsx
    LifeSliceCard.tsx
    LifeStatsBars.tsx
  data/
    life/
      events-anchors.ts
      events-parametric.ts
      talents.ts
      endings.ts
  pages/
    LifePage.tsx
```

### 组件职责
- **LifePage.tsx** — 路由入口，挂载 LifeGame
- **LifeGame.tsx** — 持有 useReducer + LifeContext.Provider，根据 phase switch 渲染子组件
- **各 Stage 组件** — 只负责特定年龄段的 UI 渲染和交互
- **引擎文件** — 全部纯函数，不依赖 React

### 状态管理
```typescript
type GamePhase =
  | { type: "talent_selection"; round: number }
  | { type: "playing"; step: "aging" | "event_presenting" | "awaiting_choice" | "effect_resolving" }
  | { type: "dying"; cause: string }
  | { type: "result" };

interface GameState {
  phase: GamePhase;
  age: number;
  attributes: Attributes;
  talents: Talent[];
  relationships: Relationship[];
  career: Career | null;
  eventLog: ResolvedEvent[];
  currentEvent: GameEvent | null;
  pendingChoices: EventChoice[] | null;
  deathRecord: DeathRecord | null;
}

type GameAction =
  | { type: "SELECT_TALENT"; talentId: string }
  | { type: "START_GAME" }
  | { type: "ADVANCE_AGE" }
  | { type: "RESOLVE_EVENT"; choiceIndex: number }
  | { type: "TRIGGER_DEATH"; cause: string }
  | { type: "SHOW_RESULT" }
  | { type: "RESTART" }
  | { type: "LOAD_SAVE"; state: GameState };
```

### 引擎 API（纯函数）
```typescript
function createInitialState(talents: Talent[]): GameState
function getEligibleEvents(state: GameState, pool: GameEvent[]): GameEvent[]
function advanceAge(state: GameState): GameState
function applyEventOutcome(state: GameState, choice: EventChoice): GameState
function checkDeath(state: GameState): { isDead: boolean; cause?: string }
function computeResult(state: GameState): GameResult
function checkCareerAdvancement(state: GameState): Career | null
function updateRelationship(state: GameState, effect: RelationshipEffect): GameState
```

### 路由注册
在 App.tsx 中添加：
```tsx
<Route path="/life" element={<LifePage />} />
```

---

## 十一、UI 风格

沿袭现有解构主义设计：
- 黑/白/灰调色板（canvas / primary / secondary / dark）
- 24 列网格系统
- 毛玻璃卡片（glass-panel）
- 等宽字体（JetBrains Mono / Courier Prime）
- Motion 动画（spring 过渡）
- 1px 装饰线条 + 角落标记
- 自定义滚动条（同 DecorativeScrollbar）

---

## 十二、开发策略

### 阶段 1：核心引擎 + 基础流程
- engine/types.ts 类型定义
- engine/reducer.ts 状态机
- engine/death.ts 死亡判定
- LifePage.tsx 路由 + LifeGame.tsx 容器
- 最小可玩：固定几个事件 + 手动推进

### 阶段 2：天赋 + 事件内容
- 天赋选择 UI + 天赋数据
- 锚点事件（~30）+ 参数化事件（~60）
- 事件筛选 + 属性变化

### 阶段 3：关系 + 职业
- 知己角色生成 + 好感度
- 学业线 + 3 条职业路线
- 壮年期综合事件

### 阶段 4：晚年 + 结局 + 存档
- 晚年反思模式
- 结局计算 + 人生回顾
- 自动存档 + 恢复

### 阶段 5：打磨
- 动画优化
- 边缘情况处理
- 事件池扩充至 200+
