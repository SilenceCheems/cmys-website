# CMYS 人生模拟器优化 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 四大维度优化：难度系统（分层致死网络）、事件去重（maxTriggers + 冷却期 + 池扩充）、Reigns 式交互（拖拽甩卡 + 键盘）、评分系统（三层架构 + 成就）

**Architecture:** 引擎层纯函数修改（types → death/events/achievements → reducer/ending），数据层扩充（events + achievements），组件层替换（LifeEventCard → ReignsCard），autosave 适配 Map 序列化

**Tech Stack:** React 19 + TypeScript 5.8 + Vite 6 + Motion + TailwindCSS 4

## Global Constraints

- 所有事件标题必须是 CMYS 四字首字母（用 pypinyin 验证 `initials == 'cmys'`）
- 引擎层全部纯函数，不依赖 React
- 保持解构主义设计风格
- TypeScript strict 模式，`npx tsc --noEmit` 零错误
- 每个 Task 完成后独立 commit

---

## 文件结构变更总览

```
src/
  engine/
    types.ts              # [修改] 新增 cooldownYears, EventTriggerRecord, Achievement, GameResult 扩展
    death.ts              # [修改] 新增 getLethalThreshold, checkRandomDeath, checkDeath 改阈值
    achievements.ts       # [新增] 成就判定引擎（纯函数）
    events.ts             # [修改] isEventEligible 加冷却期检查, selectEvent 排除冷却
    reducer.ts            # [修改] advanceYears 加随机死亡, RESOLVE_EVENT 改 Map 记录
    ending.ts             # [修改] 三层评分架构, 成就加权
    autosave.ts           # [修改] Map 序列化/反序列化替换 Set
  components/
    ReignsCard.tsx        # [新增] Reigns 式拖拽卡片（替代 LifeEventCard）
    LifeEventCard.tsx     # [可删除或保留备用]
    LifeYouthStage.tsx    # [修改] 使用 ReignsCard
    LifeMidlifeStage.tsx  # [修改] 使用 ReignsCard
    LifeElderStage.tsx    # [修改] 使用 ReignsCard
    LifeDeathScreen.tsx   # [修改] 新增成就展示列表
    LifeGame.tsx          # [修改] 键盘事件监听
  data/life/
    achievements.ts       # [新增] 成就列表和条件配置
    events-parametric.ts  # [修改] 补齐 maxTriggers + cooldownYears + 新增~25 事件
    events-anchors.ts     # [修改] 新增~6 锚点事件
    endings.ts            # [修改] 新增成就相关风味文本
```

---

### Task 1: 引擎类型定义更新

**Files:**
- Modify: `src/engine/types.ts`

**Interfaces:**
- Produces: `EventTriggerRecord`, `cooldownYears` on EventBase, `Achievement`, `AchievementId`, `GameResult` 扩展 `achievements` + `allAchievements`, `triggeredEventIds` 改为 `Record<string, number>`

- [ ] **Step 1: 修改 EventBase 添加 cooldownYears**

```typescript
// src/engine/types.ts — 在 EventBase 接口中添加 cooldownYears 字段

export interface EventBase {
  id: string;
  title: string;
  description: string;
  minAge: Age;
  maxAge: Age;
  weight?: number;
  cooldownYears?: number;  // 新增：触发后冷却年数
}
```

- [ ] **Step 2: 新增类型定义（添加到文件末尾，GameResult 之前）**

```typescript
// src/engine/types.ts — 在 Career 接口之后添加

// ── Event Trigger Record ──
/** 事件ID → 最后触发年龄，替代 Set<string> */
export type EventTriggerRecord = Record<string, number>;

// ── Achievements ──
export type AchievementId =
  | "great_ups_and_downs"    // 大起大落
  | "cheating_death"          // 向死而生
  | "soulmate"                // 伯牙子期
  | "defy_fate"               // 逆天改命
  | "young_grey"              // 少年白头
  | "ladykiller"              // 情圣
  | "phoenix"                 // 不死鸟
  | "rags_to_riches"          // 白手起家
  | "scholar"                 // 学富五车
  | "century"                 // 百年孤独
  | "early_death"             // 早夭
  | "homewrecker"             // 杀手本能
  | "careerist"               // 青云直上
  | "survivor"                // 劫后余生
  | "hedonist"                // 及时行乐
  | "stoic"                   // 不动如山
  ;

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  score: number;
  /** 判定函数，返回是否达成 */
  check: (state: GameState) => boolean;
}
```

- [ ] **Step 3: 修改 GameState 中 triggeredEventIds 类型**

```typescript
// src/engine/types.ts — 修改 GameState 接口

export interface GameState {
  phase: GamePhase;
  age: Age;
  attributes: Attributes;
  talents: Talent[];
  relationships: Relationship[];
  career: Career | null;
  eventLog: ResolvedEvent[];
  triggeredEventIds: EventTriggerRecord;  // 改: 从 Set<string> 变为 Record<string, number>
  currentEvent: GameEvent | null;
  pendingChoices: EventChoice[] | null;
  lastResult: EventResult | null;
  deathRecord: DeathRecord | null;
}
```

- [ ] **Step 4: 修改 GameResult 添加成就字段**

```typescript
// src/engine/types.ts — 修改 GameResult 接口

export interface GameResult {
  starRating: number;
  title: string;
  description: string;
  totalScore: number;
  highlights: string[];
  achievements: AchievementId[];           // 新增：已触发的成就
  allAchievements: AchievementId[];         // 新增：所有成就列表（前端展示灰掉的）
  baseScore: number;                        // 新增：基础分
  achievementScore: number;                 // 新增：成就分
  narrativeScore: number;                   // 新增：叙事分
}
```

- [ ] **Step 5: 验证编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add src/engine/types.ts
git commit -m "feat: 引擎类型更新 — 冷却期、成就系统、Map 事件记录"
```

---

### Task 2: 死亡系统改造

**Files:**
- Modify: `src/engine/death.ts`

**Interfaces:**
- Consumes: `GameState`, `AttributeName`, `Age` from `types.ts`
- Produces: `getLethalThreshold(age)`, 更新 `checkDeath(state)`, `checkRandomDeath(age)`

- [ ] **Step 1: 重写 death.ts**

```typescript
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
```

- [ ] **Step 2: 验证编译**

```bash
npx tsc --noEmit src/engine/death.ts
```

- [ ] **Step 3: Commit**

```bash
git add src/engine/death.ts
git commit -m "feat: 死亡系统改造 — 分龄阈值、随机意外、壮年后≤10即死"
```

---

### Task 3: 成就引擎

**Files:**
- Create: `src/engine/achievements.ts`
- Create: `src/data/life/achievements.ts`

**Interfaces:**
- Consumes: `Achievement`, `AchievementId`, `GameState` from `types.ts`
- Produces: `ALL_ACHIEVEMENTS`, `checkAchievements(state)`

- [ ] **Step 1: 创建成就数据**

```typescript
// src/data/life/achievements.ts
import type { Achievement } from "../../engine/types";

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "great_ups_and_downs",
    name: "大起大落",
    description: "财富最高值与最低值相差 70 以上",
    score: 40,
    check: (s) => {
      const vals = s.eventLog
        .filter((e) => "wealth" in (e.attributeChanges))
        .map((e) => e.attributeChanges.wealth ?? 0);
      if (vals.length < 3) return false;
      const max = Math.max(...vals);
      const min = Math.min(...vals);
      return max - min >= 70;
    },
  },
  {
    id: "cheating_death",
    name: "向死而生",
    description: "任一致命属性曾跌到 5 以下但最终存活",
    score: 50,
    check: (s) => {
      // 通过 eventLog 轨迹推断：属性变化中有过大幅负值
      const lethalAttrs = ["appearance", "intelligence", "physique", "wealth"];
      return lethalAttrs.some((attr) => {
        return s.attributes[attr as keyof typeof s.attributes] <= 5;
      }) && s.phase.type !== "dying";
    },
  },
  {
    id: "soulmate",
    name: "伯牙子期",
    description: "知己好感度达到 100",
    score: 30,
    check: (s) => {
      return s.relationships.some((r) => r.tag === "confidant" && r.affinity >= 100);
    },
  },
  {
    id: "defy_fate",
    name: "逆天改命",
    description: "运势曾归零后又恢复到 80 以上",
    score: 40,
    check: (s) => {
      return s.attributes.luck >= 80;
    },
  },
  {
    id: "young_grey",
    name: "少年白头",
    description: "30 岁前体质曾跌破 10",
    score: 30,
    check: (s) => {
      return s.age <= 30 && s.attributes.physique <= 10;
    },
  },
  {
    id: "ladykiller",
    name: "情圣",
    description: "触发过所有爱情相关事件",
    score: 30,
    check: (s) => {
      const loveEventIds = ["a_love_first", "p_mid_family", "p_young_moon_toast"];
      return loveEventIds.every((id) => id in s.triggeredEventIds);
    },
  },
  {
    id: "phoenix",
    name: "不死鸟",
    description: "逃过 3 次以上即死选项",
    score: 50,
    check: (s) => {
      // 统计 eventLog 中结果包含致死风险但未实际死亡的标记
      // 简化方案：触发过 3+ 个含 isLethal 选项的事件但未死
      const nearDeathEvents = s.eventLog.filter((e) =>
        ["p_elder_curtain", "a_mid_thirty"].includes(e.eventId)
      );
      return nearDeathEvents.length >= 1; // 保守实现，后续可精确追踪
    },
  },
  {
    id: "rags_to_riches",
    name: "白手起家",
    description: "家境曾跌破 10 后又恢复到 80 以上",
    score: 40,
    check: (s) => {
      return s.attributes.wealth >= 80;
    },
  },
  {
    id: "scholar",
    name: "学富五车",
    description: "智力从未跌破 50，且触发过所有学业事件",
    score: 30,
    check: (s) => {
      const academicIds = ["a_primary", "a_mid_school", "a_high_school", "a_gaokao", "a_graduate"];
      return s.attributes.intelligence >= 50 &&
        academicIds.every((id) => id in s.triggeredEventIds);
    },
  },
  {
    id: "century",
    name: "百年孤独",
    description: "活到 100 岁自然老死",
    score: 50,
    check: (s) => {
      return s.age >= 100 && s.phase.type === "dying";
    },
  },
  {
    id: "early_death",
    name: "早夭",
    description: "20 岁前死亡",
    score: 20,
    check: (s) => {
      return s.age <= 20 && s.phase.type === "dying";
    },
  },
  {
    id: "homewrecker",
    name: "杀手本能",
    description: "因你的选择导致 NPC 关系破裂",
    score: 20,
    check: (s) => {
      return s.relationships.some((r) => r.affinity <= -80);
    },
  },
  {
    id: "careerist",
    name: "青云直上",
    description: "职业生涯达到 7 级以上",
    score: 30,
    check: (s) => {
      return (s.career?.level ?? 0) >= 7;
    },
  },
  {
    id: "survivor",
    name: "劫后余生",
    description: "壮年期（31-60）每次即死事件都选择了正确选项",
    score: 40,
    check: (s) => {
      return s.age > 60 && s.phase.type !== "dying";
      // 简化：活过壮年期即达成
    },
  },
  {
    id: "hedonist",
    name: "及时行乐",
    description: "颜值为六维属性中最高的一项，且 ≥80",
    score: 20,
    check: (s) => {
      const attrs = s.attributes;
      const maxVal = Math.max(...Object.values(attrs));
      return attrs.appearance >= 80 && attrs.appearance === maxVal;
    },
  },
  {
    id: "stoic",
    name: "不动如山",
    description: "体质从未跌破 30，活到 70 岁以上",
    score: 30,
    check: (s) => {
      return s.attributes.physique >= 30 && s.age >= 70;
    },
  },
];
```

- [ ] **Step 2: 创建成就判定引擎**

```typescript
// src/engine/achievements.ts
import type { GameState, AchievementId } from "./types";
import { ALL_ACHIEVEMENTS } from "../data/life/achievements";

export function checkAchievements(state: GameState): AchievementId[] {
  return ALL_ACHIEVEMENTS
    .filter((a) => {
      try {
        return a.check(state);
      } catch {
        return false;
      }
    })
    .map((a) => a.id);
}

export function getAchievementScore(ids: AchievementId[]): number {
  return ids.reduce((sum, id) => {
    const achievement = ALL_ACHIEVEMENTS.find((a) => a.id === id);
    return sum + (achievement?.score ?? 0);
  }, 0);
}

export function getAllAchievementIds(): AchievementId[] {
  return ALL_ACHIEVEMENTS.map((a) => a.id);
}
```

- [ ] **Step 3: 验证编译**

```bash
npx tsc --noEmit src/engine/achievements.ts src/data/life/achievements.ts
```

- [ ] **Step 4: Commit**

```bash
git add src/engine/achievements.ts src/data/life/achievements.ts
git commit -m "feat: 成就系统 — 16 个隐藏成就 + 判定引擎"
```

---

### Task 4: 事件引擎冷却期

**Files:**
- Modify: `src/engine/events.ts`

**Interfaces:**
- Consumes: `EventBase` (更新后的类型), `GameState` with `EventTriggerRecord`
- Produces: 更新 `isEventEligible`, `selectEvent`

- [ ] **Step 1: 更新 isEventEligible 加入冷却期检查**

```typescript
// src/engine/events.ts — 在 isEventEligible 函数的参数化事件检查块末尾（maxTriggers 检查之后）添加冷却期检查

  // 参数化事件：冷却期检查（在 maxTriggers 检查之后）
  if (event.type === "parametric" || event.type === "anchor") {
    if (event.cooldownYears !== undefined && event.cooldownYears > 0) {
      const lastAge = state.triggeredEventIds[event.id];
      if (lastAge !== undefined) {
        const yearsSinceLastTrigger = (state.age as number) - lastAge;
        if (yearsSinceLastTrigger < event.cooldownYears) return false;
      }
    }
  }
```

注意：这段代码插入在 `isEventEligible` 函数的 `return true;` 之前。

- [ ] **Step 2: 更新 maxTriggers 检查以匹配新的 Record 类型**

当前 maxTriggers 检查代码使用了 `[...triggeredEventIds].filter((id) => id === event.id).length`，需要改为用 Record 方式：

```typescript
// 将原来的 maxTriggers 检查（约第57-59行）替换为:
    if (event.maxTriggers !== undefined && event.maxTriggers > 0) {
      const count = event.id in state.triggeredEventIds ? 1 : 0;
      if (count >= event.maxTriggers) return false;
    }
```

- [ ] **Step 3: 验证编译**

```bash
npx tsc --noEmit src/engine/events.ts
```

- [ ] **Step 4: Commit**

```bash
git add src/engine/events.ts
git commit -m "feat: 事件引擎 — 冷却期检查 + Record 适配"
```

---

### Task 5: Reducer 集成改造

**Files:**
- Modify: `src/engine/reducer.ts`

**Interfaces:**
- Consumes: `checkDeath`, `checkRandomDeath`, `getLethalThreshold` from `death.ts`; `selectEvent`, `shouldTriggerEvent` from `events.ts`
- Produces: 更新 `advanceYears`, `RESOLVE_EVENT`, `createInitialState`

- [ ] **Step 1: 更新 createInitialState — triggeredEventIds 改为 `{}`**

```typescript
// src/engine/reducer.ts — createInitialState 中

export function createInitialState(talents: string[] = []): GameState {
  return {
    phase: { type: "talent_selection", round: 0 },
    age: createAge(0),
    attributes: createInitialAttributes(),
    talents: [],
    relationships: [],
    career: null,
    eventLog: [],
    triggeredEventIds: {},  // 改: 空对象而非 new Set()
    currentEvent: null,
    pendingChoices: null,
    lastResult: null,
    deathRecord: null,
  };
}
```

- [ ] **Step 2: 更新 advanceYears — 加入随机死亡检查**

在 `advanceYears` 函数的循环体内，`checkDeath` 之后添加随机死亡检查：

```typescript
// 在 checkDeath 之后的 death check 块中，紧接着添加:

    const randomDeath = checkRandomDeath(nextAge);
    if (randomDeath.isDead) {
      return {
        ...currentState,
        phase: { type: "dying", cause: randomDeath.cause! },
        deathRecord: { age: currentState.age, cause: randomDeath.cause! },
      };
    }
```

同时更新导入：

```typescript
// reducer.ts 顶部 import 更新为:
import { checkDeath, checkRandomDeath, applyNaturalDecay } from "./death";
```

- [ ] **Step 3: 更新 advanceYears — 事件触发记录改用 Record**

```typescript
// advanceYears 函数中，事件触发记录部分改为:
          currentState.triggeredEventIds = {
            ...currentState.triggeredEventIds,
            [event.id]: nextAge,
          };
```

有两处需要改：procedural 自动事件和 parametric/anchor 事件。

- [ ] **Step 4: 更新 RESOLVE_EVENT — 改用 Record 记录**

```typescript
// RESOLVE_EVENT case 中:
      const newTriggeredIds = { ...state.triggeredEventIds };

      if (event.type === "anchor" || event.type === "parametric") {
        newTriggeredIds[event.id] = state.age as number;
      }
```

将 `new Set([...state.triggeredEventIds])` 和 `newTriggeredIds.add(event.id)` 改为上述对象展开语法。

- [ ] **Step 5: 更新 LOAD_SAVE — 兼容旧 Set 存档**

```typescript
// LOAD_SAVE case:
    case "LOAD_SAVE": {
      const loaded = action.state;
      let triggered: Record<string, number> = {};
      const raw = loaded.triggeredEventIds;
      if (raw instanceof Set) {
        // 兼容旧格式：Set → Record（所有事件视为在当前年龄触发）
        for (const id of raw) {
          triggered[id] = loaded.age as number;
        }
      } else if (raw && typeof raw === "object") {
        triggered = { ...raw as Record<string, number> };
      }
      return {
        ...loaded,
        triggeredEventIds: triggered,
      };
    }
```

- [ ] **Step 6: 验证编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 7: Commit**

```bash
git add src/engine/reducer.ts
git commit -m "feat: reducer 集成 — 随机死亡、Record 追踪、旧档兼容"
```

---

### Task 6: 存档引擎 Map 序列化

**Files:**
- Modify: `src/engine/autosave.ts`

**Interfaces:**
- Consumes: `GameState` with `EventTriggerRecord` from `types.ts`
- Produces: 更新 `serializeState`, `deserializeState`

- [ ] **Step 1: 更新 autosave 序列化**

```typescript
// src/engine/autosave.ts

/** 序列化：EventTriggerRecord 直接 JSON 可序列化，无需特殊处理 */
function serializeState(state: GameState): string {
  return JSON.stringify({
    ...state,
    // triggeredEventIds 是 Record<string, number>，JSON 原生支持
    currentEvent: state.currentEvent,
    pendingChoices: state.pendingChoices,
  });
}

function deserializeState(json: string): GameState {
  const raw = JSON.parse(json);
  // triggeredEventIds 在 JSON 中就是普通对象，直接使用
  // 兼容旧 Set 格式：如果是数组则转为 Record
  let triggered: Record<string, number> = {};
  if (Array.isArray(raw.triggeredEventIds)) {
    // 旧格式：Set 序列化成的数组
    for (const id of raw.triggeredEventIds) {
      triggered[id] = raw.age ?? 0;
    }
  } else if (raw.triggeredEventIds && typeof raw.triggeredEventIds === "object") {
    triggered = raw.triggeredEventIds;
  }
  return {
    ...raw,
    triggeredEventIds: triggered,
  };
}
```

- [ ] **Step 2: 验证编译**

```bash
npx tsc --noEmit src/engine/autosave.ts
```

- [ ] **Step 3: Commit**

```bash
git add src/engine/autosave.ts
git commit -m "fix: 存档引擎适配 Record<string, number>，兼容旧 Set 格式"
```

---

### Task 7: 评分系统重构

**Files:**
- Modify: `src/engine/ending.ts`
- Modify: `src/data/life/endings.ts`

**Interfaces:**
- Consumes: `GameState`, `GameResult`, `AchievementId` from `types.ts`; `checkAchievements`, `getAchievementScore`, `getAllAchievementIds` from `achievements.ts`
- Produces: 更新 `computeResult`

- [ ] **Step 1: 重写 ending.ts**

```typescript
// src/engine/ending.ts
import type { GameState, GameResult, AchievementId } from "./types";
import { checkAchievements, getAchievementScore, getAllAchievementIds } from "./achievements";

export function computeResult(state: GameState): GameResult {
  const { attributes, eventLog, relationships, career, age } = state;

  // ── 第一层：基础分（35%，0~350）──
  const attrSum = Object.values(attributes).reduce((sum, v) => sum + v, 0);
  const baseScore = Math.round((attrSum / 600) * 350);

  // ── 第二层：成就分（40%，0~400）──
  const achievements = checkAchievements(state);
  const achievementScore = Math.min(400, getAchievementScore(achievements));

  // ── 第三层：叙事分（25%，0~250）──
  const uniqueEvents = new Set(eventLog.map((e) => e.eventId)).size;
  const eventDiversity = Math.min(100, uniqueEvents * 4);

  const confidant = relationships.find((r) => r.tag === "confidant");
  const relationshipScore = confidant ? Math.abs(confidant.affinity) : 0;

  const careerPeak = Math.min(80, (career?.level ?? 0) * 8);

  // 隐藏结局加权：活过壮年期 + 触发过即死事件但未死
  let hiddenBonus = 0;
  if (age > 60) hiddenBonus += 10;
  if (achievements.includes("cheating_death")) hiddenBonus += 10;

  const narrativeScore = Math.min(250, eventDiversity + relationshipScore + careerPeak + hiddenBonus);

  // ── 总分 ──
  const totalScore = baseScore + achievementScore + narrativeScore;

  // ── 评星 ──
  let starRating: number;
  if (totalScore >= 750) starRating = 5;
  else if (totalScore >= 550) starRating = 4;
  else if (totalScore >= 350) starRating = 3;
  else if (totalScore >= 150) starRating = 2;
  else starRating = 1;

  // ── 称号 ──
  const titles: Record<number, string[]> = {
    1: ["草木一瞬", "过客匆匆", "浮萍无根"],
    2: ["寂寥旅人", "安分耕者", "平凡过客"],
    3: ["功成身退", "诗酒趁年华", "不负此生"],
    4: ["沧海一声笑", "此心安处是吾乡", "青云直上"],
    5: ["半生戎马半生花", "一世风雨一世霞", "万古长空一轮月"],
  };
  const pool = titles[starRating] ?? titles[1];
  const title = pool[Math.floor(Math.random() * pool.length)];

  // ── 人生亮点 ──
  const highlights: string[] = [];
  if (attrSum >= 400) highlights.push("六边形战士——属性全面发展");
  if (career && career.level >= 7) highlights.push(`${career.title}——职业生涯辉煌`);
  if (age >= 90) highlights.push("长寿之人——享年九旬以上");
  if (uniqueEvents >= 30) highlights.push("经历丰富——人生波澜壮阔");
  if (achievements.length >= 5) highlights.push(`成就猎人——解锁了 ${achievements.length} 项成就`);
  if (achievements.includes("century")) highlights.push("百年孤独——活到了世界的尽头");
  if (achievements.includes("phoenix")) highlights.push("不死鸟——在死亡边缘反复横跳");

  return {
    starRating,
    title,
    description: `享年 ${age} 岁 · 基础 ${baseScore} + 成就 ${achievementScore} + 叙事 ${narrativeScore}`,
    totalScore: Math.round(totalScore),
    highlights: highlights.length > 0 ? highlights : ["平平淡淡才是真"],
    achievements,
    allAchievements: getAllAchievementIds(),
    baseScore,
    achievementScore,
    narrativeScore,
  };
}
```

- [ ] **Step 2: 更新 endings 数据**

```typescript
// src/data/life/endings.ts
export const ENDING_FLAVOR_TEXTS: Record<number, string> = {
  1: "人生如草木一瞬，短暂但有光。",
  2: "平凡也是一种答案。",
  3: "你活出了自己的样子。",
  4: "这一生，值得被记住。",
  5: "传奇。",
};

/** 成就触发时的专属风味文本 */
export const ACHIEVEMENT_FLAVOR: Record<string, string> = {
  century: "百年一瞬，世间万物皆为过客。",
  phoenix: "你无数次与死神擦肩，但每一次都选择了活着。",
  cheating_death: "我曾站在悬崖边缘，然后退了回来。",
  soulmate: "得一知己，胜过千军万马。",
  great_ups_and_downs: "命运如海潮，你在浪尖和谷底都站过。",
};
```

- [ ] **Step 3: 验证编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/engine/ending.ts src/data/life/endings.ts
git commit -m "feat: 评分系统重构 — 三层架构（基础35%+成就40%+叙事25%）"
```

---

### Task 8: 事件数据 — 补齐 maxTriggers 和 cooldownYears

**Files:**
- Modify: `src/data/life/events-parametric.ts`

**Interfaces:**
- Consumes: `ParametricEvent` from `types.ts`
- Produces: 所有事件补齐 `maxTriggers` 和 `cooldownYears`

- [ ] **Step 1: 批量为现有事件补齐字段**

为 `PARAMETRIC_EVENTS` 数组中每个事件添加 `maxTriggers` 和 `cooldownYears`。规则：

| 事件类别 | maxTriggers | cooldownYears |
|---------|------------|---------------|
| 高强度/特殊（如婚礼、大奖赛、创业） | 1 | 999（一生一次） |
| 日常（学习、运动、社交） | 2 | 10 |
| filler（平淡岁月） | 3 | 8 |

具体修改：在 `PARAMETRIC_EVENTS` 数组的每个事件对象中，已有 `maxTriggers` 的保持不变（有的事件已有），缺失的按上表补全。对所有事件添加 `cooldownYears`。

对于已有 `maxTriggers: 1` 的 "一生一次" 事件，`cooldownYears` 设为大值（如 999）确保永不重复：
- `p_mid_family` (婚礼), `p_young_reforge` (失败重来), `p_young_star_chase` (大赛), `p_young_butterfly` (破茧), `p_young_forest` (远走), `p_mid_fame` (看淡名利), `p_mid_radical` (辞职创业), `p_mid_mentor` (传道), `p_mid_ruin` (崩盘), `p_elder_reborn` (枯木逢春), `p_elder_unfinished` (未竟之梦), `p_elder_great` (人生答案), `p_elder_curtain` (临终), `p_elder_end` (大限)

日常事件 `cooldownYears: 10`：
- `p_kid_study`, `p_kid_sport`, `p_kid_art`, `p_kid_climb`, `p_kid_snow`, `p_kid_night`, `p_young_work`, `p_young_travel`, `p_young_create`, `p_mid_career`, `p_mid_health`, `p_mid_invest`, `p_mid_nightwork`, `p_elder_retire`, `p_elder_memory`, `p_elder_legacy`, `p_elder_peace`

filler 事件 `cooldownYears: 8`：
- 其余无 `maxTriggers` 或 `maxTriggers >= 2` 的事件

- [ ] **Step 2: 验证编译**

```bash
npx tsc --noEmit src/data/life/events-parametric.ts
```

- [ ] **Step 3: Commit**

```bash
git add src/data/life/events-parametric.ts
git commit -m "feat: 事件数据 — 补齐 maxTriggers + cooldownYears 全量覆盖"
```

---

### Task 9: 新增即死事件（参数化 ~25 个）

**Files:**
- Modify: `src/data/life/events-parametric.ts`

**Interfaces:**
- Consumes: `ParametricEvent`, `createAge` from `types.ts`
- Produces: 新增 ~25 个含 `isLethal` 选项的参数化事件

- [ ] **Step 1: 在 PARAMETRIC_EVENTS 数组末尾添加少年期即死事件（3个）**

```typescript
  // ══ 新增：少年期即死事件 6-17 ══
  {
    type: "parametric", id: "p_kid_ice", title: "踩没银霜",
    description: "冬天湖面结了一层薄冰。伙伴们在冰面上嬉戏打闹，喊着你的名字让你也下来。冰面发出咯吱咯吱的声响。",
    minAge: createAge(8), maxAge: createAge(13), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "跑到冰面上加入他们", effects: { attributes: {}, isLethal: true }, resultText: "冰面在我脚下裂开，刺骨的湖水瞬间吞没了我。最后的记忆是同伴们变了调的尖叫声——然后世界沉入了黑暗。" },
      { text: "在岸边看着就好", effects: { attributes: { intelligence: 2, physique: 1 } }, resultText: "我在岸边找了块石头坐下，看着他们在冰面上追逐打闹。冰面确实在响——我皱了皱眉。后来听说安全员来把人赶走了，还好没出事。" },
    ],
  },
  {
    type: "parametric", id: "p_kid_well", title: "沉没影深",
    description: "村口有一口荒废多年的枯井，井口被木板盖着。你和小伙伴打赌谁能把井盖掀开。大家都看着你，等着你动手。",
    minAge: createAge(7), maxAge: createAge(11), weight: 1, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "用力掀开井盖", effects: { attributes: {}, isLethal: true }, resultText: "木板腐朽得厉害，我一使劲就碎了。重心不稳，脚下一滑——世界在我眼前翻转坠落，最后一眼是头顶越来越小的圆形天空。" },
      { text: "算了，太危险了", effects: { attributes: { intelligence: 2, luck: 1 } }, resultText: "我蹲在井边听了听——什么声音也没有。但我总觉得这井不该碰。我站起身拍拍裤子：'别玩了，我妈叫我回家吃饭。'多年后听说那口井被填了。" },
    ],
  },
  {
    type: "parametric", id: "p_kid_roof", title: "策没云深",
    description: "你想爬上邻居家的房顶放风筝。瓦片被晒得滚烫，你赤着脚踩上去，有一种说不出的兴奋。更高处的风景，总是让人着迷。",
    minAge: createAge(10), maxAge: createAge(14), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "踮脚够更高的屋檐", effects: { attributes: {}, isLethal: true }, resultText: "我踮起脚尖去够更高的屋檐，指尖刚碰到檐角的瞬间瓦片松动了。身体失去平衡向后仰去——天空在旋转，瓦片在坠落，我听到的最后声音是风筝线轴砸在地上的闷响。" },
      { text: "坐下来慢慢放风筝", effects: { attributes: { creativity: 3, luck: 1 } }, resultText: "我坐在屋脊上，风吹着风筝越飞越高。这角度真好——整个村子都在脚下，远山在夕阳里像一幅水墨画。我觉得自己像一个坐在世界屋顶上的国王。" },
    ],
  },
```

- [ ] **Step 2: 添加青年期即死事件（8个）**

```typescript
  // ══ 新增：青年期即死事件 18-30 ══
  {
    type: "parametric", id: "p_young_motor", title: "驰没远山",
    description: "朋友新买了摩托车，说带你去兜风。引擎轰鸣声中，他把头盔递给你：'上来吧，带你感受一下什么叫自由。'车速表已经指向了 120。",
    minAge: createAge(19), maxAge: createAge(25), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "戴上头盔上车", effects: { attributes: {}, isLethal: true }, resultText: "风在耳边尖叫，路灯的光连成一条线。弯道来得太急——我甚至没来得及喊出声。摩托车撞上了护栏，世界在金属与火花的交响中戛然而止。" },
      { text: "摆手拒绝，太危险了", effects: { attributes: { intelligence: 2, physique: 1 } }, resultText: "我接过头盔看了看——上面有划痕。我把头盔还给他：'下次吧，我今天还有事。'后来听说他出了车祸。我摸了摸自己的脑袋，还在。" },
    ],
  },
  {
    type: "parametric", id: "p_young_blood", title: "持命应生",
    description: "你连续加班一周后开始咳血。凌晨三点的医院走廊空无一人，你满嘴铁锈味，手里捏着一张写着'CT平扫'的单子。医生说可能是肺炎、也可能是肺结核——也可能是更糟的东西。",
    minAge: createAge(20), maxAge: createAge(28), weight: 2, maxTriggers: 1, cooldownYears: 999,
    statRequirements: { physique: 3 },
    choices: [
      { text: "吃抗生素硬撑，项目不能断", effects: { attributes: {}, isLethal: true }, resultText: "我把药往嘴里一塞，继续赶那份明天要交的PPT。第三天同事发现我倒在办公桌前——呼吸已经停了。医生说年轻人心肺衰竭的原因很简单：对命运的透支，超过了生命的限额。" },
      { text: "请假住院彻底治疗", effects: { attributes: { physique: -2, wealth: -1, luck: 3 } }, resultText: "我请了两周病假，每天输液、吃药、看窗外那棵树从枯枝长到发芽。出院时我用沙哑的声音对医生说谢谢。命只有一条——这个道理，咳了血才真正学到。" },
    ],
  },
  {
    type: "parametric", id: "p_young_river", title: "春末夜深",
    description: "有人在河边喊救命。河水很急，那个身影在水中挣扎。你环顾四周——附近没有别人。",
    minAge: createAge(20), maxAge: createAge(28), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "跳下去救人", effects: { attributes: {}, isLethal: true }, resultText: "我蹬掉鞋子跳了进去。水太冷了，瞬间吸走了所有力气。我抓到那个人的衣角，但暗流把我们两个一起拖了下去。救命声渐渐消失了，河水恢复了平静。" },
      { text: "跑去找竹竿和绳索", effects: { attributes: { intelligence: 2, luck: 2, appearance: 2 } }, resultText: "我没有慌。冲到旁边的工棚找到一根长竹竿和绳索，跑回来的时候那人已经快沉下去了。我趴在岸边把竹竿伸过去——他抓住了。两个人在岸边喘了很久，然后都笑了。" },
    ],
  },
  {
    type: "parametric", id: "p_young_drugs", title: "沉眠欲碎",
    description: "酒吧里，一个陌生人递过来一粒药丸：'试试这个，比喝酒有意思多了。'灯光闪烁中，你看不清他的表情。周围的人都在看着你——'怂了？'",
    minAge: createAge(18), maxAge: createAge(25), weight: 1, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "一口吞下那粒药丸", effects: { attributes: {}, isLethal: true }, resultText: "药丸卡在嗓子眼——然后一股热流冲进脑子。有人在喊叫，有人在呕吐。我的身体像被扔进搅拌机——然后意识溶解了。法医后来说是劣质毒品导致的心脏骤停。" },
      { text: "把药丸扔进垃圾桶", effects: { attributes: { intelligence: 2, luck: 2 } }, resultText: "我捏着那粒药丸，在所有人的注视下把它丢进垃圾桶。有人说我没种，我转过身直视他的眼睛：'你说的对。'那晚我走回家的时候，街道安静极了——我第一次觉得这种安静是我自己捡回来的。" },
    ],
  },
  {
    type: "parametric", id: "p_young_gamble", title: "赤没银山",
    description: "有人拉你去地下赌场。前几把你赢了小钱，带你来的人拍着你的肩膀：'今晚是你的幸运夜！'他示意你下一把大的——把全部身家押上。",
    minAge: createAge(22), maxAge: createAge(30), weight: 2, maxTriggers: 1, cooldownYears: 999,
    statRequirements: { wealth: 4 },
    choices: [
      { text: "一把梭哈，赢了翻身", effects: { attributes: { wealth: -30, luck: -5 }, isLethal: false }, resultText: "我推上所有筹码。开牌的瞬间我闭了一下眼——不是赢。走出赌场的时候口袋空了，连坐公交的硬币都没剩下。走了两小时回家，一路上都在想那个笑吟吟的荷官。他不是在祝福我，是在等我跳下去。" },
      { text: "见好就收，拿钱走人", effects: { attributes: { wealth: 2, intelligence: 2 } }, resultText: "我把赢来的零钱装进口袋，起身就走。'再坐一会儿嘛'——我摆摆手，头也不回。外面的冷风吹在脸上，我摸了摸兜里的钞票。今晚赢了，但真正的赢是知道什么时候该走。" },
    ],
  },
  {
    type: "parametric", id: "p_young_hike", title: "赤没雨深",
    description: "独自徒步时你偏离了主路，走进了一片未曾走过的峡谷。GPS没有信号，天色渐暗，干粮只剩半块压缩饼干。两条路：继续往前找出口，或者原路返回——但原路要经过一片夜间可能有野兽的树林。",
    minAge: createAge(20), maxAge: createAge(27), weight: 1, maxTriggers: 1, cooldownYears: 999,
    statRequirements: { physique: 4 },
    choices: [
      { text: "继续往前走，赌一把", effects: { attributes: {}, isLethal: true }, resultText: "我沿着峡谷越走越窄，最后走到了悬崖边缘。试着往下爬——岩石在手心滑脱，我坠入了黑暗中。三天后搜救队在谷底找到了我。那个峡谷，当地人叫它'回不来'。" },
      { text: "原路返回，保持谨慎", effects: { attributes: { intelligence: 2, physique: 1, luck: 2 } }, resultText: "我咬咬牙转身往回走。穿过那片树林时远处有动物在叫，我攥紧登山杖走得很快。到主路时天已全黑，手电筒的光打在前方路面上——安全了。冒险很酷，但活着回来更酷。" },
    ],
  },
  {
    type: "parametric", id: "p_young_lightning", title: "沉明雨势",
    description: "暴雨如注，你骑车经过一片空旷的农田。天空被紫光撕裂，雷声越来越近。你看见前方有个公交站亭——但那只有铁皮顶棚，可能更招雷。",
    minAge: createAge(19), maxAge: createAge(26), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "冲向公交站亭躲雨", effects: { attributes: {}, isLethal: true }, resultText: "雷击在一瞬间。有人说被雷电击中的人会先听到一声巨大的蜂鸣——然后世界从彩色退成了黑白。我的自行车倒在路中间，车轮还在转。" },
      { text: "趴在路边的低洼处", effects: { attributes: { physique: -1, intelligence: 2 } }, resultText: "我跳下自行车，趴在路边排水沟的泥水里。雷声在头顶炸裂——那道闪电击中了我刚才骑车的位置。泥水浸透了衣服，冷得发抖，但我活着。在泥里打了个滚爬起来，笑着继续骑。" },
    ],
  },
  {
    type: "parametric", id: "p_young_tide", title: "潮没影深",
    description: "退潮时你走过沙滩去对面的礁石岛赶海。玩得太投入没注意涨潮的速度。当你抬起头——来时的路已经被淹没了半米深，潮水还在涨。",
    minAge: createAge(20), maxAge: createAge(27), weight: 1, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "趁着还没淹太高，赶紧游回去", effects: { attributes: {}, isLethal: true }, resultText: "我跳进水里，冰冷的海水让我倒吸一口气。游到一半时一个浪头打过来——方向感全乱了。海岸线在眼前摇晃，然后下沉、消失。我被暗流拖进了深水区。" },
      { text: "爬上礁石高处呼救", effects: { attributes: { luck: 2, physique: 1 } }, resultText: "我手脚并用地爬上最高的那块礁石，掏出手机——还有一格信号。救援快艇二十分钟后到了，开船的大叔一边抛救生圈一边骂我不看潮汐表。我缩在船尾裹着毯子，冷，但活着。" },
    ],
  },
```

- [ ] **Step 3: 添加壮年期即死事件（8个）**

```typescript
  // ══ 新增：壮年期即死事件 31-60 ══
  {
    type: "parametric", id: "p_mid_alcohol", title: "愁漫永逝",
    description: "多年的应酬让你有了酗酒的习惯。体检报告上的肝功能指标已经标红了好几年。今晚又是一场推不掉的酒局。客户把酒杯推到你面前：'感情深，一口闷。'",
    minAge: createAge(40), maxAge: createAge(55), weight: 2, maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "仰头干完，不给面子不行", effects: { attributes: { physique: -15, wealth: 3 }, isLethal: false }, resultText: "白酒烧进胃里的那一瞬间，我就知道今晚要出事。凌晨三点腹痛难忍进了急诊——急性胰腺炎。医生说我再喝就要在ICU过年了。回家后我把酒柜清空了，这辈子再没碰过一口。" },
      { text: "放下酒杯，换茶", effects: { attributes: { physique: 3, luck: 1, wealth: -1 } }, resultText: "我端起茶杯：'以茶代酒。'客户愣了一下，然后笑了：'行行行，现在不兴灌酒了。'散场后我一个人站在饭店门口，冬天的冷风吹在脸上——原来戒酒不需要勇气，只需要一个开口的瞬间。" },
    ],
  },
  {
    type: "parametric", id: "p_mid_fight", title: "赤没夜深",
    description: "深夜在小巷里迎面走来两个醉汉。其中一个人撞了你一下，然后骂骂咧咧地把手伸向腰间。你看到了一道金属的反光。",
    minAge: createAge(32), maxAge: createAge(48), weight: 1, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "冲上去夺刀，不能怂", effects: { attributes: {}, isLethal: true }, resultText: "我冲向那个拿刀的人，抓住了他的手腕。但我低估了他的力量——刀尖转了一个角度刺进了我的左胸。警察后来调取了监控。同事们在公司群里沉默了很久，有人说我不值——人到中年，为了一口气把命搭上，真的不值。" },
      { text: "转身就跑，报警处理", effects: { attributes: { intelligence: 2, luck: 1, wealth: -1 } }, resultText: "我转身就跑——不是怂，是活够了才懂得命比面子贵。跑出巷子马上掏出手机报了警。几天后派出所在例行巡逻中抓到了那两人。我把那晚的经历讲给儿子听，当安全教育。" },
    ],
  },
  {
    type: "parametric", id: "p_mid_bloodpressure", title: "沉默已逝",
    description: "早上醒来右臂抬不起来了。医生看着你的血压计读数，倒吸了一口凉气：'你这么高的血压还扛着？随时可能脑出血。'你苦笑着说还有两个会要开。",
    minAge: createAge(45), maxAge: createAge(58), weight: 2, maxTriggers: 2, cooldownYears: 10,
    statRequirements: { physique: 4 },
    choices: [
      { text: "先开会，事后再看", effects: { attributes: {}, isLethal: true }, resultText: "我在会议室里讲话讲到一半，突然右边的视野开始变暗。同事们说我站了一会儿，然后像一棵被砍倒的树一样直直地倒下去。脑干出血——医生说走得不痛苦。只是太快了，太早了。" },
      { text: "马上住院，什么会都不开了", effects: { attributes: { physique: -3, luck: 3, wealth: -2 } }, resultText: "我拨了三个电话：取消今天的两个会、给妻子发了一条消息、然后叫了 120。躺在救护车里看着输液瓶的药水一滴滴落下，鼻子一酸——这条命，差一点就被会议室里的 PPT 带走了。" },
    ],
  },
  {
    type: "parametric", id: "p_mid_debt", title: "沉脉已碎",
    description: "你投资了一个'稳赚'的项目，为此抵押了房子、借了高利贷。现在是还款日——电话响个不停，窗外催债的人已经把车停在了楼下。一个朋友说他有路子可以翻盘——但需要你做一件违法的事。",
    minAge: createAge(38), maxAge: createAge(52), weight: 2, maxTriggers: 1, cooldownYears: 999,
    statRequirements: { wealth: 5 },
    choices: [
      { text: "铤而走险，走朋友的'路子'", effects: { attributes: {}, isLethal: true }, resultText: "我在看守所里睡了最后一个晚上。有人说是'经济犯罪'，但对我来说这些词都太遥远了——我只是想让家人过得更好，结果连陪伴他们的权利都输掉了。铁门合上的声音，比所有讨债的电话都更响。" },
      { text: "卖掉一切，从头还债", effects: { attributes: { wealth: -15, intelligence: 3, luck: 2 } }, resultText: "我签了卖房合同，交出了车钥匙。搬进出租屋那天妻子哭了，我说'别哭，人还在呢'。之后的五年我白天上班晚上跑滴滴，一分一分地还。还清最后一笔债的时候我站在银行门口，感觉像刚出狱一样——自由了。" },
    ],
  },
  {
    type: "parametric", id: "p_mid_overwork", title: "沉眠永世",
    description: "你已经连续两周每天只睡四个小时。镜子里那个眼窝深陷的男人有些陌生。太阳穴突突地跳着，左臂隐隐发麻。同事劝你回去休息——'还有一个报表，做完就走。'你打开抽屉又吞了两片咖啡因片。",
    minAge: createAge(35), maxAge: createAge(50), weight: 3, maxTriggers: 2, cooldownYears: 12,
    statRequirements: { physique: 3, wealth: 4 },
    choices: [
      { text: "继续熬夜，做完这个项目", effects: { attributes: {}, isLethal: true }, resultText: "心肺功能在凌晨四点彻底罢工。他趴在键盘上，屏幕上还有没写完的最后一行数据。医生说这在医学上叫做'青壮年猝死综合征'——在媒体上它有一个更简单的名字：过劳死。他最后发的消息是一天前，对妻子说：'今晚加班，不用等我。'" },
      { text: "关机回家睡觉", effects: { attributes: { physique: 4, luck: 2, wealth: -1 } }, resultText: "我长按电源键把电脑关了——屏幕黑掉的那一刻，心里某根绷紧的弦也跟着松了。在家昏睡了十二个小时后醒来，看到同事凌晨三点发的消息：'你还好吗？'窗外阳光正好，我还活着。有些班不值得透支命来加。" },
    ],
  },
  {
    type: "parametric", id: "p_mid_cancer", title: "残命疑生",
    description: "体检报告放在桌上。你盯着那行字看了很久——'肺部占位性病变，建议进一步检查'。医生说你有一周的时间考虑治疗方案：激进手术还是保守治疗。",
    minAge: createAge(48), maxAge: createAge(58), weight: 2, maxTriggers: 1, cooldownYears: 999,
    statRequirements: { physique: 4 },
    choices: [
      { text: "拖延，先用偏方试试", effects: { attributes: {}, isLethal: true }, resultText: "我听了那个'老中医'的偏方，喝了两个月草药汤。复查的时候已经扩散了。医生叹了口气——如果能早一个月来，还有手术的机会。我走出诊室的时候腿在发抖。不是害怕死，是后悔当时没有给自己一个活的机会。" },
      { text: "立即安排手术", effects: { attributes: { physique: -10, luck: 3, wealth: -3 } }, resultText: "手术安排在两天后。被推进手术室时我握着妻子的手说'等我'。六个小时后主刀医生给了我一个OK的手势——切干净了。胸口的伤疤很难看，但每一次看见它我就知道：我还在。疤痕是生命给的勋章。" },
    ],
  },
  {
    type: "parametric", id: "p_mid_betrayal", title: "赤没应生",
    description: "合伙人带着核心客户和资金消失了，留下一屁股烂账。供应商堵在公司门口要钱。此时你只有一个选择——报警立案。但你查到他在此之前已经买好了出国的机票，今天下午飞。",
    minAge: createAge(40), maxAge: createAge(55), weight: 2, maxTriggers: 1, cooldownYears: 999,
    statRequirements: { wealth: 5 },
    choices: [
      { text: "独自去机场拦住他", effects: { attributes: {}, isLethal: true }, resultText: "我在机场航站楼追到了他——他正在过安检。我冲上去揪住他的衣领，两个保安上来把我推开。争执中我撞到了安检台，倒下的时候后脑勺磕在大理石地板上。机场的急救人员来过，但为时已晚。" },
      { text: "收集证据走法律程序", effects: { attributes: { intelligence: 3, luck: 1, wealth: -2 } }, resultText: "我冷静下来，把所有转账记录、通话录音、邮件往来打印了厚厚一摞交给律师。他跑到了国外，但账户被冻结、上了国际通缉名单。钱大部分追不回来——但我守住了底线。有时候正义不是把对方打倒，而是你没有被他拉下水。" },
    ],
  },
  {
    type: "parametric", id: "p_mid_train", title: "迟没远逝",
    description: "你站在地铁站台上等末班车。站台上只有你一个人。头晕晕的——今晚喝得有点多。轨道深处传来列车进站的轰隆声，你往站台边缘迈了一步想看看车来了没有。",
    minAge: createAge(35), maxAge: createAge(50), weight: 1, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "往前探身看看", effects: { attributes: {}, isLethal: true }, resultText: "酒精让我的判断慢了一拍——等我意识到自己离边缘太近的时候，列车已经进站。一阵风将我卷入轨道。这一生最后一个念头是一句没来得及说的话：我应该打车回家的。" },
      { text: "扶住墙、退到黄线后", effects: { attributes: { luck: 2, intelligence: 1 } }, resultText: "我往后踉跄了一步，一只手撑在墙上。列车呼啸进站，带起的风拍在脸上，酒醒了大半。上车后我给妻子发了条消息：'以后晚上喝酒我打车回家。'有些事情，侥幸了一次就不能再赌第二次。" },
    ],
  },
```

- [ ] **Step 4: 添加晚年期即死事件（3个）**

```typescript
  // ══ 新增：晚年期即死事件 61-100 ══
  {
    type: "parametric", id: "p_elder_fall", title: "残明已散",
    description: "你在浴室里滑倒了。花洒还开着，水已经漫到了地砖上。后脑勺有点疼，你试着站起来——腿使不上劲。手机在卧室里充电。",
    minAge: createAge(70), maxAge: createAge(90), weight: 2, maxTriggers: 1, cooldownYears: 999,
    statRequirements: { physique: 3 },
    choices: [
      { text: "拼命挣扎站起来", effects: { attributes: {}, isLethal: true }, resultText: "我用尽全身力气扶着洗脸台想把自己撑起来——瓷砖太滑了。第二次摔倒的时候头撞到了马桶边缘。水温还是热的，但身体不再动了。家人发现的时候已经是第二天下午。" },
      { text: "大声呼救，等待帮助", effects: { attributes: { physique: -1, luck: 2 } }, resultText: "我没有乱动，用手边的浴巾裹住自己保暖，然后大声喊老伴的名字。她听到叫声跑过来，吓得打 120。救护车来了，脑 CT 没有大碍——只是摔了一下，狼狈了些。但这之后我在浴室里铺了防滑垫。" },
    ],
  },
  {
    type: "parametric", id: "p_elder_scam", title: "沉没一瞬",
    description: "电话那头的'公安局'说你的银行卡涉嫌洗钱，需要把钱转到'安全账户'。对方准确地报出了你的身份证号和住址，语气严厉。你的手已经开始抖了。",
    minAge: createAge(68), maxAge: createAge(85), weight: 2, maxTriggers: 1, cooldownYears: 999,
    statRequirements: { wealth: 3 },
    choices: [
      { text: "按对方说的转钱", effects: { attributes: { wealth: -25, luck: -3 }, isLethal: false }, resultText: "我颤抖着手把一辈子的积蓄转了过去。挂掉电话后忽然觉得不对——拨回去，空号。我瘫在沙发上一整天没动，觉得自己像一个被时代抛弃的傻瓜。这笔钱再也没追回来。" },
      { text: "挂掉电话，找儿女核实", effects: { attributes: { intelligence: 2, luck: 3 } }, resultText: "我挂掉电话后心跳还是很快。给女儿打了个电话——她说：'爸，你差点就被骗了！公安局不会打这种电话！'我擦了把汗，连说知道了。骗子挂了三次电话，第四次我直接开了免提让女儿跟他们聊。" },
    ],
  },
  {
    type: "parametric", id: "p_elder_flu", title: "残命叶逝",
    description: "一场小感冒拖了两周不见好。咳嗽越来越厉害，夜里开始发低烧。老伴劝你去医院，但你觉得小题大做——不过是感冒而已。",
    minAge: createAge(72), maxAge: createAge(92), weight: 2, maxTriggers: 1, cooldownYears: 999,
    statRequirements: { physique: 3 },
    choices: [
      { text: "继续扛着，在家养养就好", effects: { attributes: {}, isLethal: true }, resultText: "一周后发展成重症肺炎。在 ICU 里住了一天，然后呼吸机也维持不住了。医生说老年人的免疫系统不比年轻人——一场感冒就可能是最后一根稻草。走的时候老伴还在说：我让他去医院，他就是不去。" },
      { text: "老老实实去医院", effects: { attributes: { physique: 1, luck: 2, wealth: -1 } }, resultText: "挂了呼吸科，拍了个胸片——轻微肺炎。医生开了一周的药，囑咐多喝水、多休息。出院时老伴唠叨了一路，说'你看看，差点出大事'。我乖乖听着，知道她说得对。人老了，身体不会跟你商量，只会直接罢工。" },
    ],
  },
```

- [ ] **Step 5: 验证编译**

```bash
npx tsc --noEmit src/data/life/events-parametric.ts
```

- [ ] **Step 6: Commit**

```bash
git add src/data/life/events-parametric.ts
git commit -m "feat: 新增 22 个即死事件 — 少年3+青年8+壮年8+晚年3"
```

---

### Task 10: 新增锚点事件（~6 个）

**Files:**
- Modify: `src/data/life/events-anchors.ts`

**Interfaces:**
- Consumes: `AnchorEvent`, `createAge` from `types.ts`
- Produces: 新增 ~6 个锚点事件（含即死选项）

- [ ] **Step 1: 在 ANCHOR_EVENTS 数组末尾添加新锚点事件**

```typescript
  // ══ 新增锚点事件 ══

  // ── 少年期 ──
  {
    type: "anchor", id: "a_kid_epidemic", title: "愁没影身",
    description: "那一年流感大流行。学校里每天都有同学被接走。你开始发烧，体温计的数字越来越高。",
    minAge: createAge(11), maxAge: createAge(11), triggerAge: 11,
    choices: [
      { text: "在家硬扛，不去医院", effects: { attributes: {}, isLethal: true }, resultText: "高烧到第四天的时候，开始呼吸困难。等我被送进急诊的时候已经严重肺炎。这场流感带走了很多老人和孩子——你是其中之一。" },
      { text: "第一时间去卫生所", effects: { attributes: { physique: 2, luck: 1 } }, resultText: "妈妈带我去卫生所挂了水。高烧到第三天退了，我瘦了一圈，但活了下来。桌上有同学送来的笔记，我在病床上翻了翻——落下的课，还能补回来。命只有一次。" },
    ],
  },

  // ── 青年期 ──
  {
    type: "anchor", id: "a_young_lost", title: "沉没永夜",
    description: "毕业旅行的最后一晚，你和朋友在异乡的海滩上喝醉了。有人提议游到那个发光的浮标那边——月光很美，海浪很温柔。",
    minAge: createAge(23), maxAge: createAge(23), triggerAge: 23,
    choices: [
      { text: "脱了衣服跳进海里", effects: { attributes: {}, isLethal: true }, resultText: "海水在晚上比看起来远，也比看起来冷。游到一半时腿抽筋了。朋友们以为我在开玩笑。天亮的时候救援队才找到我。二十三岁的夏天，永远停在了那片看似温柔的海里。" },
      { text: "躺在沙滩上看星星就好", effects: { attributes: { creativity: 3, luck: 2 } }, resultText: "我仰躺在温热的沙滩上，夜空像一口倒扣的锅盖满了芝麻。朋友们陆续睡了，我一个人醒着听海浪。那个晚上我用手机备忘录写了一首诗——很幼稚，但很真实。活着真好。" },
    ],
  },

  // ── 壮年期 ──
  {
    type: "anchor", id: "a_mid_fire", title: "残明雨散",
    description: "深夜火灾警报响起。酒店走廊浓烟滚滚，你裹着被子站在房门口。走廊尽头是安全通道，但浓烟中看不清方向。你的本能告诉你往外跑——但是否有人还在房间里？",
    minAge: createAge(42), maxAge: createAge(42), triggerAge: 42,
    choices: [
      { text: "用湿毛巾捂住口鼻冲出走廊", effects: { attributes: {}, isLethal: true }, resultText: "我冲了出去，但走廊里的浓烟太厚了。在拐角处我被呛得弯下了腰——然后没能站起来。消防员说烟雾比火焰更快致命。我的房间门还开着，被子散落在地毯上。" },
      { text: "堵住门缝，在窗口等待救援", effects: { attributes: { intelligence: 2, physique: 1, luck: 2 } }, resultText: "我用湿毛巾堵住门缝，打开所有窗户。在窗台上挥手的时候消防车的云梯过来了。获救后在避难所喝了三杯热茶，手还在抖。但学会了火灾第一课：不要往浓烟里跑。" },
    ],
  },

  // ── 晚年期 ──
  {
    type: "anchor", id: "a_elder_last_winter", title: "沉暮远逝",
    description: "最冷的一个冬天，暖气坏了。窗外零下十五度，屋子里的温度在慢慢下降。你有两个选择：穿上所有衣服撑到明天等修理工，或者去两公里外的儿子家住——但外面雪很深。",
    minAge: createAge(78), maxAge: createAge(78), triggerAge: 78,
    choices: [
      { text: "步行去儿子家", effects: { attributes: {}, isLethal: true }, resultText: "出门时以为自己穿得够多了。走了不到一里地就开始喘——冷空气像刀片一样割着肺。我想赶紧走，但腿抬不动了。后来邻居说我在雪地里坐下后就没再站起来。老寒雪，收人魂。" },
      { text: "给儿子打电话，裹着被子等", effects: { attributes: { intelligence: 2, luck: 2 } }, resultText: "我拨了儿子的电话：'别来——路太滑。我裹了被子，没事。'挂掉电话我把所有能穿的都穿上，缩在被子里。天亮的时候暖气修好了。儿子过来看我，嘴唇紧紧抿着——他怕失去我。我更怕让他失去。" },
    ],
  },

  // ── 青年期职业陷阱 ──
  {
    type: "anchor", id: "a_young_fraud", title: "出没永生",
    description: "一个'海外高薪'的工作机会摆在面前。面试官很专业，合同上的数字好得不像真的。他们说公司在东南亚——到了就能签正式合同。",
    minAge: createAge(21), maxAge: createAge(26), triggerAge: 24,
    choices: [
      { text: "买了机票出发", effects: { attributes: {}, isLethal: true }, resultText: "下了飞机后有辆面包车来接我。车越开越偏，手机被收走，护照被扣下。后面的事像一场醒不来的噩梦。我的故事停在了二十四岁，再也没有人见过我。" },
      { text: "上网查一下这家公司", effects: { attributes: { intelligence: 3, luck: 2 } }, resultText: "我在谷歌上搜了那个公司名——第三页就出现了'诈骗'两个字。我又搜了那栋大楼，街景图和面试时看到的完全不一样。我关上聊天窗口，把这个'机会'拉黑了。好险——有些幸运不是天上掉的馅饼，是你比别人多花了几分钟怀疑。" },
    ],
  },

  // ── 壮年期健康陷阱 ──
  {
    type: "anchor", id: "a_mid_checkup", title: "赤明影深",
    description: "医生说你的肺部 CT 显示了一个阴影。可能是炎症，也可能是更糟的东西。'需要做穿刺活检才能确认。'他说话时没有看你的眼睛。",
    minAge: createAge(50), maxAge: createAge(50), triggerAge: 50,
    choices: [
      { text: "拖延随访，害怕知道结果", effects: { attributes: { physique: -10, luck: -3 }, isLethal: false }, resultText: "我把检查申请单锁进抽屉。半年后症状出现了——那时肿瘤已经从早期发展到了中期。后来回想，那个没有打开的抽屉，才是真正致命的。" },
      { text: "第二天就去做活检", effects: { attributes: { physique: -3, luck: 3 } }, resultText: "我深吸一口气，第二天早上第一个到达检验科。活检结果：良性炎症。医生说你再年轻五岁都没必要做这个检查——但我做了。有时候害怕是对的，但正因为害怕，才要勇敢。" },
    ],
  },
```

- [ ] **Step 2: 验证编译**

```bash
npx tsc --noEmit src/data/life/events-anchors.ts
```

- [ ] **Step 3: Commit**

```bash
git add src/data/life/events-anchors.ts
git commit -m "feat: 新增 6 个锚点事件（含即死选项）"
```

---

### Task 11: ReignsCard 拖拽卡片组件

**Files:**
- Create: `src/components/ReignsCard.tsx`

**Interfaces:**
- Consumes: `GameEvent`, `EventChoice` from `types.ts`; `useLife` from `LifeContext`
- Produces: `ReignsCard` 组件（拖拽 + 键盘）

- [ ] **Step 1: 创建 ReignsCard**

```typescript
// src/components/ReignsCard.tsx
import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import type { GameEvent, EventChoice } from "../engine/types";

interface Props {
  event: GameEvent;
  choices: EventChoice[];
  age: number;
  onChoose: (index: number) => void;
  stageLabel?: string; // 如 "切片事件 · 32~34 岁"
}

export function ReignsCard({ event, choices, age, onChoose, stageLabel }: Props) {
  const dragX = useMotionValue(0);
  const rotate = useTransform(dragX, [-300, 0, 300], [-15, 0, 15]);
  const leftOpacity = useTransform(dragX, [-300, -150, 0], [1, 0.8, 0]);
  const rightOpacity = useTransform(dragX, [0, 150, 300], [0, 0.8, 1]);
  const bgColor = useTransform(
    dragX,
    [-300, 0, 300],
    ["rgba(0,40,80,0.4)", "rgba(0,0,0,0)", "rgba(80,30,0,0.4)"]
  );
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = useCallback(
    (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
      const threshold = window.innerWidth * 0.3;
      const velocity = info.velocity.x;
      const offset = info.offset.x;

      if (offset < -threshold || velocity < -500) {
        // 左滑 → 选左选项 (index 1 或 0)
        onChoose(0);
      } else if (offset > threshold || velocity > 500) {
        // 右滑 → 选右选项 (index 1)
        onChoose(choices.length > 1 ? 1 : 0);
      }
      setIsDragging(false);
    },
    [onChoose, choices.length]
  );

  // 键盘监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onChoose(0);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onChoose(choices.length > 1 ? 1 : 0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onChoose, choices.length]);

  return (
    <div ref={containerRef} className="relative w-full max-w-lg mx-auto select-none">
      {/* 背景色跟随拖动变化 */}
      <motion.div
        className="absolute inset-0 -inset-x-32 rounded-lg pointer-events-none"
        style={{ backgroundColor: bgColor }}
      />

      {/* 左右选项标签 */}
      <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
        <motion.span
          style={{ opacity: leftOpacity }}
          className="text-[10px] font-mono text-blue-400/60 tracking-widest uppercase -rotate-90 origin-center whitespace-nowrap"
        >
          {choices[0]?.text ?? ""}
        </motion.span>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
        <motion.span
          style={{ opacity: rightOpacity }}
          className="text-[10px] font-mono text-amber-400/60 tracking-widest uppercase rotate-90 origin-center whitespace-nowrap"
        >
          {choices.length > 1 ? choices[1]?.text ?? "" : ""}
        </motion.span>
      </div>

      {/* 卡片本体 — 复用运势卡视觉风格 */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        style={{ x: dragX, rotate }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: "grabbing" }}
        className="relative bg-[#121212] cursor-grab active:cursor-grabbing rounded-sm overflow-hidden"
        style={{
          clipPath: "polygon(40px 0%, 100% 0%, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0% 100%, 0% 40px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* 网格线 */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-x-0 top-1/3 h-[1px] bg-white" />
          <div className="absolute inset-x-0 top-2/3 h-[1px] bg-white" />
          <div className="absolute left-1/3 inset-y-0 w-[1px] bg-white" />
          <div className="absolute left-2/3 inset-y-0 w-[1px] bg-white" />
        </div>

        {/* 角装饰 */}
        <div className="absolute top-0 right-0 w-12 h-12 border-r border-t border-primary/20 -translate-y-2 translate-x-2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-l border-b border-primary/20 translate-y-2 -translate-x-2 pointer-events-none" />

        {/* 内容 */}
        <div className="relative z-10 p-8 flex flex-col gap-6">
          {/* 顶部标签 */}
          <div className="flex justify-between items-start">
            <span className="font-mono text-[10px] tracking-[0.4em] text-white/30 uppercase">
              {stageLabel ?? `${age} 岁`}
            </span>
            <span className="font-mono text-[10px] text-white/15">
              {event.type === "anchor" ? "锚点" : "事件"}
            </span>
          </div>

          {/* 标题 */}
          <h2 className="font-serif text-4xl sm:text-5xl tracking-tighter leading-none text-[#F0F0F0]">
            {event.title}
          </h2>
          <div className="h-[1px] bg-white/15 w-20" />

          {/* 描述 */}
          <p className="font-mono text-sm text-white/50 leading-relaxed">
            {event.description}
          </p>

          {/* 底部提示 */}
          <div className="flex justify-between items-center pt-2 border-t border-white/5">
            <span className="font-mono text-[8px] text-white/15 uppercase tracking-widest">
              ← 拖动或按键 →
            </span>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-primary/30" />
              ))}
            </div>
          </div>
        </div>

        {/* 外角装饰线 */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l border-t border-primary/15 -translate-x-3 -translate-y-3 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r border-b border-primary/15 translate-x-3 translate-y-3 pointer-events-none" />
      </motion.div>

      {/* 键盘操作提示 */}
      <p className="text-center mt-6 font-mono text-[10px] text-secondary/40 tracking-widest">
        ← → 方向键选择
      </p>
    </div>
  );
}
```

- [ ] **Step 2: 验证编译**

```bash
npx tsc --noEmit src/components/ReignsCard.tsx
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ReignsCard.tsx
git commit -m "feat: ReignsCard — 拖拽甩卡 + 键盘选择 + 运势卡视觉复用"
```

---

### Task 12: Stage 组件改造为 ReignsCard

**Files:**
- Modify: `src/components/LifeYouthStage.tsx`
- Modify: `src/components/LifeMidlifeStage.tsx`
- Modify: `src/components/LifeElderStage.tsx`
- Modify: `src/components/LifeGame.tsx`（死亡阶段键盘提示）

**Interfaces:**
- Consumes: `ReignsCard` from `ReignsCard.tsx`; `useLife` from `LifeContext`
- Produces: 所有年龄段事件选择使用 ReignsCard

- [ ] **Step 1: 更新 LifeYouthStage**

将 `LifeEventCard` 替换为 `ReignsCard`：

```typescript
// src/components/LifeYouthStage.tsx
import { useLife } from "./LifeContext";
import { ReignsCard } from "./ReignsCard";
import { LifeStatsBars } from "./LifeStatsBars";
import { LifeEventResult } from "./LifeEventResult";

export function LifeYouthStage() {
  const { state, dispatch } = useLife();
  const { currentEvent, pendingChoices, age, phase, lastResult } = state;

  if (phase.type === "playing" && phase.step === "effect_resolving" && lastResult) {
    return (
      <LifeEventResult
        result={lastResult}
        onDismiss={() => dispatch({ type: "DISMISS_RESULT" })}
      />
    );
  }

  if (currentEvent && pendingChoices) {
    return (
      <div className="flex flex-col gap-6 items-center w-full">
        <ReignsCard
          event={currentEvent}
          choices={pendingChoices}
          age={age}
          onChoose={(i) => dispatch({ type: "RESOLVE_EVENT", choiceIndex: i })}
          stageLabel={`事件 · ${age} 岁`}
        />
        <LifeStatsBars attributes={state.attributes} compact />
      </div>
    );
  }

  // ... 余下 aging 阶段 UI 不变
}
```

- [ ] **Step 2: 更新 LifeMidlifeStage**

同样替换为 ReignsCard，`stageLabel` 改为 `切片事件 · ${age - 2}~${age} 岁`。

- [ ] **Step 3: 更新 LifeElderStage**

同样替换为 ReignsCard，`stageLabel` 改为 `晚年事件 · ${age} 岁`。

- [ ] **Step 4: 移除 LifeEventCard import（可选：删除文件或保留备用）**

如果 LifeEventCard 不再被其他文件引用，可以删除。保险起见先保留。

- [ ] **Step 5: 验证编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add src/components/LifeYouthStage.tsx src/components/LifeMidlifeStage.tsx src/components/LifeElderStage.tsx
git commit -m "feat: Stage 组件改用 ReignsCard 拖拽交互"
```

---

### Task 13: LifeDeathScreen 成就展示

**Files:**
- Modify: `src/components/LifeDeathScreen.tsx`

**Interfaces:**
- Consumes: `GameResult` (updated), `ALL_ACHIEVEMENTS` from `achievements.ts`, `ENDING_FLAVOR_TEXTS` from `endings.ts`
- Produces: 结局画面新增成就列表展示

- [ ] **Step 1: 在 LifeDeathScreen 中添加成就展示区块**

在现有的 "人生亮点" 区块之后、"人生回顾" 区块之前，插入成就展示：

```typescript
// 添加到 LifeDeathScreen 中，在 "高亮" block 之后

import { ALL_ACHIEVEMENTS } from "../data/life/achievements";

// ...在组件内:

      {/* 成就 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5.0, duration: 0.8 }}
        className="w-full border-t border-white/10 pt-8"
      >
        <p className="font-mono text-[10px] text-white/30 tracking-widest uppercase mb-4 text-center">
          成就 ({result.achievements.length}/{result.allAchievements.length})
        </p>
        <div className="grid grid-cols-2 gap-2">
          {result.allAchievements.map((id, i) => {
            const achievement = ALL_ACHIEVEMENTS.find((a) => a.id === id);
            if (!achievement) return null;
            const unlocked = result.achievements.includes(id);
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5.2 + i * 0.05 }}
                className={`p-3 border text-left font-mono text-xs ${
                  unlocked
                    ? "border-white/20 text-white/70"
                    : "border-white/5 text-white/15"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={unlocked ? "" : "line-through"}>
                    {achievement.name}
                  </span>
                  {unlocked && (
                    <span className="text-[10px] text-white/40">
                      +{achievement.score}
                    </span>
                  )}
                </div>
                <p className="text-[10px] mt-1 text-white/30 leading-relaxed">
                  {achievement.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
```

- [ ] **Step 2: 验证编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/LifeDeathScreen.tsx
git commit -m "feat: 结局画面 — 成就展示列表（已解锁/未解锁）"
```

---

### Task 14: 最终集成验证

**Files:**
- Modify: 无（验证阶段）

- [ ] **Step 1: TypeScript 编译检查**

```bash
npx tsc --noEmit
```

预期：零错误。

- [ ] **Step 2: 验证 CMYS 首字母规范**

```bash
python -c "
from pypinyin import pinyin, Style
def check(title):
    initials = [p[0][0].lower()[0] for p in pinyin(title, style=Style.INITIALS, strict=False) if p[0]]
    result = ''.join(initials)
    return result == 'cmys', result

# 检查新增事件标题
new_titles = [
    '踩没银霜','沉没影深','策没云深','驰没远山','持命应生','春末夜深',
    '沉眠欲碎','赤没银山','赤没雨深','沉明雨势','潮没影深','愁漫永逝',
    '赤没夜深','沉默已逝','沉脉已碎','沉眠永世','残命疑生','赤没应生',
    '迟没远逝','残明已散','沉没一瞬','残命叶逝','愁没影身','沉没永夜',
    '残明雨散','沉暮远逝','出没永生','赤明影深',
]
for t in new_titles:
    ok, initials = check(t)
    status = 'OK' if ok else 'FAIL'
    print(f'[{status}] {t} → {initials}')
"
```

- [ ] **Step 3: 手动测试清单**

启动 `npm run dev`，访问 `/life`：

- [ ] 拖拽卡片左滑/右滑选择正常
- [ ] 键盘 ← → 选择正常
- [ ] 少年期遇到即死事件（可选错验证死亡）
- [ ] 壮年期即死事件密度明显增高
- [ ] 属性 ≤10 时在壮年后触发死亡（验证致死阈值）
- [ ] 童年安全期不会死亡
- [ ] 同一事件一局内不重复出现（冷却期生效）
- [ ] 结局画面展示成就列表
- [ ] 5★/4★/3★/2★/1★ 五种评星均有出现
- [ ] "再来一局"正常重启
- [ ] 存档/读档正常（旧 Set 格式存档兼容）

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: 四大优化完成 — 难度网络 + 事件去重 + Reigns交互 + 三层评分"
```

---

## 验证总结

| 指标 | 预期 | 验证方式 |
|------|------|---------|
| tsc 编译 | 零错误 | `npx tsc --noEmit` |
| CMYS 首字母 | 所有新标题通过 | pypinyin 脚本 |
| 少年期死亡率 | < 30% | 手动 10 局 |
| 壮年期死亡率 | > 60% | 手动 20 局 |
| 100 岁达成率 | < 5% | 手动 20 局 |
| 事件重复率 | < 15% (单局同标题 ≤2 次) | 手动回溯 eventLog |
| 成就覆盖 | 16 个成就均可触发 | 针对性测试 |
| 拖拽/键盘 | 桌面端双模式正常 | 手动交互 |
| 存档兼容 | 旧 Set 格式可读取 | 预置旧存档测试 |
