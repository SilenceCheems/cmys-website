# CMYS 人生模拟器 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `/life` 路由下构建一个完整的"人生重开模拟器"风格文字冒险游戏。

**Architecture:** 纯函数引擎层（`src/engine/`）持有所有游戏逻辑，React 组件层（`src/components/`）只负责 UI 渲染。状态通过 `useReducer` + Context 管理，引擎不依赖 React。引擎文件按领域拆分（types / reducer / events / death / talent / career / relationship / ending），组件按生命周期阶段拆分。

**Tech Stack:** React 19 + TypeScript + TailwindCSS 4 + Motion + React Router v7 + Vite 6

## Global Constraints

- 所有事件标题必须是 CMYS 四字汉字缩写
- 引擎层全部纯函数，不导入 React
- 保持现有解构主义设计风格（黑/白/灰调、网格线、毛玻璃、等宽字体）
- 组件文件全部扁平放在 `src/components/` 下（不建子目录）
- 数据文件在 `src/data/life/` 下
- localStorage key 前缀统一使用 `cmys_life_`
- TypeScript strict 模式，使用 branded types 约束数值范围

---

## 文件结构总览

```
src/
  engine/
    types.ts              # 所有类型定义、branded types、discriminated unions
    reducer.ts            # gameReducer 纯函数 + GameAction
    events.ts             # 事件筛选、事件生成
    death.ts              # 死亡判定
    talent.ts             # 天赋效果计算
    career.ts             # 职业路径逻辑
    relationship.ts       # 关系系统逻辑
    ending.ts             # 结局计算
    autosave.ts           # 存档/读档
  components/
    LifeGame.tsx           # 主容器（useReducer + Context + phase switch）
    LifeTalentPicker.tsx   # 天赋 3 轮选择
    LifeInfancyStage.tsx   # 婴幼期自动叙事
    LifeYouthStage.tsx     # 少年/青年期（每岁选择）
    LifeMidlifeStage.tsx   # 壮年期（3年切片）
    LifeElderlyStage.tsx   # 晚年反思
    LifeDeathScreen.tsx    # 终局结算
    LifeEventCard.tsx      # 通用事件卡片
    LifeSliceCard.tsx      # 壮年期切片卡片
    LifeStatsBars.tsx      # 6维属性状态条
  data/
    life/
      events-anchors.ts    # 锚点事件数据
      events-parametric.ts # 参数化事件数据
      talents.ts           # 天赋数据
      endings.ts           # 结局称号数据
  pages/
    LifePage.tsx           # 路由入口
```

---

## Phase 1: 核心引擎 + 基础流程

### Task 1: 创建引擎类型定义

**Files:**
- Create: `src/engine/types.ts`

**Interfaces:**
- Produces: `Age`, `AttributeValue`, `AttributeName`, `Attributes`, `Talent`, `GameEvent`, `AnchorEvent`, `ParametricEvent`, `ProceduralEvent`, `EventChoice`, `Relationship`, `Career`, `GamePhase`, `GameState`, `GameAction`, `GameResult`, `ResolvedEvent`, `DeathRecord`

- [ ] **Step 1: 写入类型定义文件**

```typescript
// src/engine/types.ts

// ── Branded types ──
type Age = number & { __brand: "Age" };
type AttributeValue = number & { __brand: "AttributeValue" };

function createAge(n: number): Age {
  if (!Number.isInteger(n) || n < 0 || n > 100) throw new Error(`Invalid age: ${n}`);
  return n as Age;
}

function attr(v: number): AttributeValue {
  if (!Number.isFinite(v)) throw new Error("Invalid attribute value");
  return Math.max(0, Math.min(100, Math.round(v))) as AttributeValue;
}

function incrementAge(a: Age): Age {
  const next = a + 1;
  return next > 100 ? (100 as Age) : (next as Age);
}

// ── Attributes ──
type AttributeName = "appearance" | "intelligence" | "physique" | "wealth" | "creativity" | "luck";
type Attributes = Record<AttributeName, AttributeValue>;

const LETHAL_ATTRIBUTES: AttributeName[] = ["appearance", "intelligence", "physique", "wealth"];

// ── Talent ──
interface Talent {
  id: string;
  name: string;           // CMYS 四字缩写
  description: string;
  category: "childhood" | "prime" | "lifelong";  // 童年 / 壮年 / 终身
  tags: string[];
  positive: Partial<Record<AttributeName, number>>;
  negative: Partial<Record<AttributeName, number>>;
  exclusiveWith?: string[];
}

// ── Events ──
interface EventBase {
  id: string;
  title: string;          // CMYS 四字缩写
  description: string;
  minAge: Age;
  maxAge: Age;
  weight?: number;
}

interface AnchorEvent extends EventBase {
  type: "anchor";
  triggerAge: number | number[];
  choices: EventChoice[];
}

interface ParametricEvent extends EventBase {
  type: "parametric";
  statRequirements?: Partial<Record<AttributeName, number>>;
  requiredTalents?: string[];
  excludedTalents?: string[];
  maxTriggers?: number;
  choices: EventChoice[];
}

interface ProceduralEvent extends EventBase {
  type: "procedural";
  autoResolve: true;
  effects: Partial<Record<AttributeName, number>>;
}

type GameEvent = AnchorEvent | ParametricEvent | ProceduralEvent;

interface EventChoice {
  text: string;
  effects: {
    attributes?: Partial<Record<AttributeName, number>>;
    grantTalents?: string[];
    removeTalents?: string[];
    triggerEventId?: string;
    relationshipEffect?: { targetId: string; change: number };
    isLethal?: boolean;
  };
}

// ── Relationship ──
interface Relationship {
  id: string;
  name: string;
  tag: "confidant" | "partner" | "friend" | "rival";
  affinity: number;   // -100 ~ +100
}

// ── Career ──
type CareerPath = "academic" | "merchant" | "artist" | null;

interface Career {
  path: CareerPath;
  title: string;
  level: number;       // 1~10
  milestones: string[];
}

// ── Game State ──
type GamePhase =
  | { type: "talent_selection"; round: number }
  | { type: "playing"; step: "aging" | "event_presenting" | "awaiting_choice" | "effect_resolving" }
  | { type: "dying"; cause: string }
  | { type: "result" };

interface GameState {
  phase: GamePhase;
  age: Age;
  attributes: Attributes;
  talents: Talent[];
  relationships: Relationship[];
  career: Career | null;
  eventLog: ResolvedEvent[];
  triggeredEventIds: Set<string>;
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

// ── Results ──
interface ResolvedEvent {
  age: Age;
  eventId: string;
  title: string;
  choiceText: string;
  attributeChanges: Partial<Record<AttributeName, number>>;
}

interface DeathRecord {
  age: Age;
  cause: string;
}

interface GameResult {
  starRating: number;       // 1~5
  title: string;            // 结局称号
  description: string;
  totalScore: number;
  highlights: string[];
}
```

- [ ] **Step 2: 验证 TypeScript 编译通过**

```bash
npx tsc --noEmit src/engine/types.ts
```

- [ ] **Step 3: Commit**

```bash
git add src/engine/types.ts
git commit -m "feat: 添加人生模拟器核心类型定义"
```

---

### Task 2: 创建引擎工厂函数和属性初始化

**Files:**
- Create: `src/engine/reducer.ts`

**Interfaces:**
- Consumes: All types from `src/engine/types.ts`
- Produces: `createInitialAttributes()`, `createInitialState()`, `gameReducer()`

- [ ] **Step 1: 写入初始化逻辑和 reducer 骨架**

```typescript
// src/engine/reducer.ts
import {
  type GameState, type GameAction, type Attributes, type AttributeName,
  attr, createAge,
} from "./types";

// ── 属性初始化 ──
function rollD6(): number {
  return Math.floor(Math.random() * 4) + 2; // 2~5
}

export function createInitialAttributes(bonusPoints: Partial<Record<AttributeName, number>> = {}): Attributes {
  const base: Attributes = {
    appearance: attr(rollD6()),
    intelligence: attr(rollD6()),
    physique: attr(rollD6()),
    wealth: attr(rollD6()),
    creativity: attr(rollD6()),
    luck: attr(rollD6()),
  };

  // 应用玩家分配的 5 点
  const bonusEntries = Object.entries(bonusPoints) as [AttributeName, number][];
  for (const [key, val] of bonusEntries) {
    if (val > 0) {
      base[key] = attr(base[key] + val);
    }
  }

  return base;
}

// ── 初始状态 ──
export function createInitialState(talents: string[] = []): GameState {
  return {
    phase: { type: "talent_selection", round: 0 },
    age: createAge(0),
    attributes: createInitialAttributes(),
    talents: [],
    relationships: [],
    career: null,
    eventLog: [],
    triggeredEventIds: new Set(),
    currentEvent: null,
    pendingChoices: null,
    deathRecord: null,
  };
}

// ── Reducer ──
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return { ...state, phase: { type: "playing", step: "aging" }, age: createAge(0) };

    case "ADVANCE_AGE":
      return { ...state, phase: { type: "playing", step: "aging" } };

    case "TRIGGER_DEATH":
      return {
        ...state,
        phase: { type: "dying", cause: action.cause },
        deathRecord: { age: state.age, cause: action.cause },
      };

    case "SHOW_RESULT":
      return { ...state, phase: { type: "result" } };

    case "RESTART":
      return createInitialState();

    default:
      return state;
  }
}
```

- [ ] **Step 2: 验证编译**

```bash
npx tsc --noEmit src/engine/reducer.ts
```

- [ ] **Step 3: Commit**

```bash
git add src/engine/reducer.ts
git commit -m "feat: 添加人生模拟器 reducer 和初始化逻辑"
```

---

### Task 3: 创建死亡判定引擎

**Files:**
- Create: `src/engine/death.ts`

**Interfaces:**
- Consumes: `GameState`, `AttributeName` from `types.ts`
- Produces: `checkDeath()`, `LETHAL_ATTRIBUTES`

- [ ] **Step 1: 写入死亡判定逻辑**

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
```

- [ ] **Step 2: 验证编译**

```bash
npx tsc --noEmit src/engine/death.ts
```

- [ ] **Step 3: Commit**

```bash
git add src/engine/death.ts
git commit -m "feat: 添加死亡判定引擎"
```

---

### Task 4: 创建路由页面入口

**Files:**
- Create: `src/pages/LifePage.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `createInitialState`, `gameReducer` from `reducer.ts`
- Produces: `LifePage` component, `/life` route

- [ ] **Step 1: 创建 LifePage**

```typescript
// src/pages/LifePage.tsx
import { useReducer } from "react";
import { createInitialState, gameReducer } from "../engine/reducer";

export function LifePage() {
  const [state, dispatch] = useReducer(gameReducer, null, () => createInitialState());

  return (
    <div className="min-h-screen bg-canvas text-primary font-sans flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-serif text-6xl tracking-tighter mb-4">人生模拟器</h1>
        <p className="font-mono text-sm text-secondary">CMYS Life Simulator</p>
        <button
          onClick={() => dispatch({ type: "START_GAME" })}
          className="mt-8 px-8 py-3 border border-primary font-mono text-xs tracking-[0.3em] uppercase hover:bg-primary hover:text-canvas transition-colors"
        >
          开始人生
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 注册路由**

在 App.tsx 中导入并添加路由：

```typescript
// src/App.tsx — 在文件顶部 import 区域添加:
import { LifePage } from "./pages/LifePage";

// 在 <Routes> 内部添加:
<Route path="/life" element={<LifePage />} />
```

- [ ] **Step 3: 启动开发服务器验证**

```bash
npm run dev
```

访问 `http://localhost:3000/life`，确认显示"人生模拟器"标题和"开始人生"按钮。

- [ ] **Step 4: Commit**

```bash
git add src/pages/LifePage.tsx src/App.tsx
git commit -m "feat: 添加 /life 路由和 LifePage 入口"
```

---

### Task 5: 创建主游戏容器 LifeGame

**Files:**
- Create: `src/components/LifeGame.tsx`

**Interfaces:**
- Consumes: `GameState`, `GameAction`, `GamePhase` from `types.ts`
- Produces: `LifeGame` component with phase switching

- [ ] **Step 1: 写入 LifeGame 容器**

```typescript
// src/components/LifeGame.tsx
import { useReducer, createContext, useContext } from "react";
import type { GameState, GameAction, GamePhase } from "../engine/types";
import { createInitialState, gameReducer } from "../engine/reducer";
import { checkDeath } from "../engine/death";

interface LifeContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export const LifeContext = createContext<LifeContextValue | null>(null);

export function useLife() {
  const ctx = useContext(LifeContext);
  if (!ctx) throw new Error("useLife must be used within LifeGame");
  return ctx;
}

export function LifeGame() {
  const [state, dispatch] = useReducer(gameReducer, null, () => createInitialState());

  const ctx: LifeContextValue = { state, dispatch };

  const renderPhase = () => {
    const phase = state.phase;

    switch (phase.type) {
      case "talent_selection":
        return (
          <div className="flex items-center justify-center h-full">
            <p className="font-mono text-sm text-secondary">天赋选择 (第 {phase.round + 1} 轮)</p>
          </div>
        );

      case "playing":
        return (
          <div className="flex flex-col items-center justify-center gap-8 h-full">
            <div className="text-center">
              <p className="font-serif text-8xl tracking-tighter">{state.age}</p>
              <p className="font-mono text-xs text-secondary mt-2">岁</p>
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {Object.entries(state.attributes).map(([key, val]) => (
                <div key={key} className="px-3 py-1 border border-primary/20">
                  {key}: {val as number}
                </div>
              ))}
            </div>
            <button
              onClick={() => dispatch({ type: "ADVANCE_AGE" })}
              className="px-6 py-2 border border-primary font-mono text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-canvas transition-colors"
            >
              推进年龄
            </button>
          </div>
        );

      case "dying":
        return (
          <div className="flex flex-col items-center justify-center gap-6">
            <p className="font-serif text-3xl tracking-tighter">生命终结</p>
            <p className="font-mono text-sm text-secondary">{phase.cause}</p>
            <button
              onClick={() => dispatch({ type: "SHOW_RESULT" })}
              className="px-6 py-2 border border-primary font-mono text-xs tracking-[0.2em] uppercase"
            >
              查看结局
            </button>
          </div>
        );

      case "result":
        return (
          <div className="flex flex-col items-center justify-center gap-6">
            <p className="font-serif text-4xl tracking-tighter">人生回顾</p>
            <p className="font-mono text-sm text-secondary">终年 {state.age} 岁</p>
            <button
              onClick={() => dispatch({ type: "RESTART" })}
              className="px-6 py-2 border border-primary font-mono text-xs tracking-[0.2em] uppercase"
            >
              重新开始
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <LifeContext.Provider value={ctx}>
      <div className="relative min-h-screen bg-canvas text-primary font-sans">
        {/* 背景网格 */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          {renderPhase()}
        </div>
      </div>
    </LifeContext.Provider>
  );
}
```

- [ ] **Step 2: 更新 LifePage 使用 LifeGame**

修改 `src/pages/LifePage.tsx`：

```typescript
// src/pages/LifePage.tsx
import { LifeGame } from "../components/LifeGame";

export function LifePage() {
  return <LifeGame />;
}
```

- [ ] **Step 3: 手动验证**

启动 `npm run dev`，访问 `/life`：
- 点击"开始人生"→ 应显示年龄 0 和 6 个属性
- 反复点击"推进年龄"→ 年龄递增
- 点击到 100 → 触发"寿终正寝"

- [ ] **Step 4: Commit**

```bash
git add src/components/LifeGame.tsx src/pages/LifePage.tsx
git commit -m "feat: 添加 LifeGame 主容器和 phase 切换逻辑"
```

---

## Phase 2: 天赋 + 事件内容

### Task 6: 创建天赋引擎

**Files:**
- Create: `src/engine/talent.ts`

**Interfaces:**
- Consumes: `Talent`, `GameState`, `AttributeName` from `types.ts`
- Produces: `applyTalentEffects()`, `getActiveTalents()`, `selectTalentsForRound()`

- [ ] **Step 1: 写入天赋引擎**

```typescript
// src/engine/talent.ts
import type { Talent, GameState, AttributeName, Attributes } from "./types";
import { attr } from "./types";

// 获取当前年龄生效的天赋
export function getActiveTalents(state: GameState): Talent[] {
  const { age, talents } = state;
  return talents.filter((t) => {
    switch (t.category) {
      case "childhood": return age <= 17;
      case "prime": return age >= 18 && age <= 60;
      case "lifelong": return true;
      default: return false;
    }
  });
}

// 应用天赋的属性修正
export function applyTalentModifiers(
  baseEffect: Partial<Record<AttributeName, number>>,
  activeTalents: Talent[]
): Partial<Record<AttributeName, number>> {
  const result: Partial<Record<AttributeName, number>> = { ...baseEffect };

  for (const talent of activeTalents) {
    for (const [key, val] of Object.entries(talent.positive) as [AttributeName, number][]) {
      result[key] = (result[key] ?? 0) + val;
    }
    for (const [key, val] of Object.entries(talent.negative) as [AttributeName, number][]) {
      result[key] = (result[key] ?? 0) + val;
    }
  }

  return result;
}

// 从天赋池中为当前轮次随机选 3 个天赋
export function selectTalentsForRound(
  pool: Talent[],
  selectedIds: string[],
  round: number
): Talent[] {
  const available = pool.filter((t) => {
    if (selectedIds.includes(t.id)) return false;
    // 互斥检查
    const hasConflict = selectedIds.some((sid) => {
      const selectedTalent = pool.find((p) => p.id === sid);
      return selectedTalent?.exclusiveWith?.includes(t.id) || t.exclusiveWith?.includes(sid);
    });
    if (hasConflict) return false;
    return true;
  });

  // 打乱并取前 3 个
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

// 应用单个天赋到属性
export function applyTalentToAttributes(
  attrs: Attributes,
  talent: Talent
): Attributes {
  const next = { ...attrs };
  for (const [key, val] of Object.entries(talent.positive) as [AttributeName, number][]) {
    next[key] = attr(next[key] + val);
  }
  for (const [key, val] of Object.entries(talent.negative) as [AttributeName, number][]) {
    next[key] = attr(next[key] + val);
  }
  return next;
}
```

- [ ] **Step 2: 验证编译**

```bash
npx tsc --noEmit src/engine/talent.ts
```

- [ ] **Step 3: Commit**

```bash
git add src/engine/talent.ts
git commit -m "feat: 添加天赋引擎"
```

---

### Task 7: 创建天赋数据

**Files:**
- Create: `src/data/life/talents.ts`

**Interfaces:**
- Consumes: `Talent` from `types.ts`
- Produces: `TALENT_POOL`

- [ ] **Step 1: 写入天赋数据（首批 12 个）**

```typescript
// src/data/life/talents.ts
import type { Talent } from "../../engine/types";

export const TALENT_POOL: Talent[] = [
  {
    id: "t_chumashiyingshi",
    name: "出马应试",
    description: "考试运极佳，但长期压力损耗身心",
    category: "childhood",
    tags: ["考试", "学业"],
    positive: { intelligence: 3 },
    negative: { physique: -1 },
    exclusiveWith: ["t_chenmoyoushi"],
  },
  {
    id: "t_chenmoyoushi",
    name: "沉默有诗",
    description: "创作灵感丰富，但不善社交",
    category: "childhood",
    tags: ["创作", "文艺"],
    positive: { creativity: 3 },
    negative: { appearance: -1 },
    exclusiveWith: ["t_chumashiyingshi"],
  },
  {
    id: "t_cimuoyuanshe",
    name: "辞母远涉",
    description: "独立能力极强，但家庭羁绊薄弱",
    category: "prime",
    tags: ["远行", "独立"],
    positive: { intelligence: 2, physique: 2 },
    negative: { wealth: -2 },
  },
  {
    id: "t_changmianyueshi",
    name: "长眠月食",
    description: "谷底反弹时爆发力惊人，但低谷更漫长",
    category: "lifelong",
    tags: ["韧性", "高风险"],
    positive: { physique: 2 },
    negative: { luck: -2 },
  },
  {
    id: "t_canglinyinshi",
    name: "仓廪殷实",
    description: "财运亨通，但安逸使人懈怠",
    category: "prime",
    tags: ["财富", "安逸"],
    positive: { wealth: 3 },
    negative: { creativity: -1 },
  },
  {
    id: "t_chunmiaoyusu",
    name: "春苗雨苏",
    description: "如雨后春笋般快速成长",
    category: "childhood",
    tags: ["成长", "生机"],
    positive: { intelligence: 1, physique: 1, creativity: 1 },
    negative: { wealth: -1 },
  },
  {
    id: "t_chunmianyesu",
    name: "春眠夜宿",
    description: "生活安稳节奏缓慢，健康运上升",
    category: "lifelong",
    tags: ["安稳", "健康"],
    positive: { physique: 2 },
    negative: { luck: -1 },
  },
  {
    id: "t_chuimuyanshi",
    name: "垂目言事",
    description: "沉稳说服力强，社交运佳",
    category: "prime",
    tags: ["社交", "说服"],
    positive: { appearance: 2, wealth: 1 },
    negative: { creativity: -1 },
  },
  {
    id: "t_caomuyusheng",
    name: "草木有盛",
    description: "生命力旺盛，体质惊人",
    category: "childhood",
    tags: ["体质", "生长"],
    positive: { physique: 4 },
    negative: { intelligence: -2 },
  },
  {
    id: "t_chunmeiyishi",
    name: "纯美意识",
    description: "内心觉知清澈，心态决定境遇",
    category: "lifelong",
    tags: ["心性", "精神"],
    positive: { creativity: 2, luck: 1 },
    negative: { wealth: -1 },
  },
  {
    id: "t_chuimoyunshi",
    name: "揣摩运势",
    description: "对机遇有独特敏感度",
    category: "lifelong",
    tags: ["运势", "机遇"],
    positive: { luck: 3 },
    negative: { physique: -1 },
  },
  {
    id: "t_cemayueshi",
    name: "策马越野",
    description: "行动力超群，适合冒险开拓",
    category: "prime",
    tags: ["行动", "冒险"],
    positive: { physique: 2, luck: 1 },
    negative: { intelligence: -1 },
  },
];
```

- [ ] **Step 2: 验证编译**

```bash
npx tsc --noEmit src/data/life/talents.ts
```

- [ ] **Step 3: Commit**

```bash
git add src/data/life/talents.ts
git commit -m "feat: 添加首批 12 个天赋数据"
```

---

### Task 8: 创建 LifeTalentPicker 组件

**Files:**
- Create: `src/components/LifeTalentPicker.tsx`
- Modify: `src/components/LifeGame.tsx`

**Interfaces:**
- Consumes: `GameState`, `Talent` from `types.ts`; `TALENT_POOL` from `talents.ts`; `selectTalentsForRound`, `applyTalentToAttributes` from `talent.ts`
- Produces: `LifeTalentPicker` component

- [ ] **Step 1: 写入天赋选择组件**

```typescript
// src/components/LifeTalentPicker.tsx
import { useState } from "react";
import { useLife } from "./LifeGame";
import type { Talent } from "../engine/types";
import { TALENT_POOL } from "../data/life/talents";
import { selectTalentsForRound, applyTalentToAttributes } from "../engine/talent";
import { motion } from "motion/react";

export function LifeTalentPicker() {
  const { state, dispatch } = useLife();
  const round = (state.phase as { type: "talent_selection"; round: number }).round;
  const [selected, setSelected] = useState<Talent[]>([]);

  const candidates = selectTalentsForRound(
    TALENT_POOL,
    state.talents.map((t) => t.id),
    round
  );

  const handleSelect = (talent: Talent) => {
    const newSelected = [...selected, talent];
    setSelected(newSelected);

    const newTalents = [...state.talents, talent];
    const newAttrs = applyTalentToAttributes(state.attributes, talent);

    if (round >= 2) {
      // 最后一轮，开始游戏
      dispatch({
        type: "LOAD_SAVE",
        state: {
          ...state,
          talents: newTalents,
          attributes: newAttrs,
          phase: { type: "playing", step: "aging" },
          age: 0 as import("../engine/types").Age,
        },
      });
    } else {
      dispatch({
        type: "LOAD_SAVE",
        state: {
          ...state,
          talents: newTalents,
          attributes: newAttrs,
          phase: { type: "talent_selection", round: round + 1 },
        },
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-serif text-3xl tracking-tighter"
      >
        选择你的天赋
      </motion.h2>
      <p className="font-mono text-xs text-secondary">
        第 {round + 1} / 3 轮
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {candidates.map((talent, i) => (
          <motion.button
            key={talent.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleSelect(talent)}
            className="group relative p-6 border border-primary/20 text-left hover:border-primary/60 transition-colors glass-panel"
          >
            <h3 className="font-mono text-sm tracking-wider mb-2">{talent.name}</h3>
            <p className="font-mono text-[10px] text-secondary leading-relaxed mb-3">
              {talent.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(talent.positive).map(([k, v]) => (
                <span key={k} className="text-[10px] font-mono text-green-700 px-1">
                  {k}+{v}
                </span>
              ))}
              {Object.entries(talent.negative).map(([k, v]) => (
                <span key={k} className="text-[10px] font-mono text-red-700 px-1">
                  {k}{v}
                </span>
              ))}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 在 LifeGame 中集成**

修改 `src/components/LifeGame.tsx` 中的 `renderPhase`：

```typescript
// 替换 talent_selection case:
case "talent_selection":
  return <LifeTalentPicker />;

// 在文件顶部添加 import:
import { LifeTalentPicker } from "./LifeTalentPicker";
```

- [ ] **Step 3: 修正 reducer 中的 SELECT_TALENT 和 LOAD_SAVE**

修改 `src/engine/reducer.ts`，添加对 `SELECT_TALENT` 和 `LOAD_SAVE` 的完整处理：

```typescript
// 在 gameReducer 的 switch 中添加:
case "SELECT_TALENT": {
  // 由 LifeTalentPicker 通过 LOAD_SAVE 处理
  return state;
}

case "LOAD_SAVE": {
  return {
    ...action.state,
    triggeredEventIds: action.state.triggeredEventIds ?? new Set(),
  };
}
```

- [ ] **Step 4: 手动验证**

启动 `npm run dev`，访问 `/life`：
- 应显示 3 个天赋选项
- 选择一个后进入第 2 轮
- 3 轮后自动进入游戏

- [ ] **Step 5: Commit**

```bash
git add src/components/LifeTalentPicker.tsx src/components/LifeGame.tsx src/engine/reducer.ts
git commit -m "feat: 添加天赋选择组件和流程"
```

---

### Task 9: 创建事件数据和事件引擎

**Files:**
- Create: `src/data/life/events-anchors.ts`
- Create: `src/data/life/events-parametric.ts`
- Create: `src/engine/events.ts`

**Interfaces:**
- Consumes: `GameEvent` types from `types.ts`
- Produces: `ANCHOR_EVENTS`, `PARAMETRIC_EVENTS`, `getEligibleEvents()`, `selectEvent()`

- [ ] **Step 1: 写入锚点事件数据（首批 15 个）**

```typescript
// src/data/life/events-anchors.ts
import type { AnchorEvent } from "../../engine/types";
import { createAge } from "../../engine/types";

export const ANCHOR_EVENTS: AnchorEvent[] = [
  // ── 婴幼期 0-5 ──
  {
    type: "anchor", id: "a_birth", title: "初梦已逝",
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
];
```

- [ ] **Step 2: 写入参数化事件数据（首批 20 个）**

```typescript
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
    statRequirements: { physique: 3, maxTriggers: 3 }, weight: 2,
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
```

- [ ] **Step 3: 写入事件引擎**

```typescript
// src/engine/events.ts
import type { GameState, GameEvent, AttributeName } from "./types";
import { ANCHOR_EVENTS } from "../data/life/events-anchors";
import { PARAMETRIC_EVENTS } from "../data/life/events-parametric";

// 构建年龄段索引
function buildEventIndex(): Map<number, GameEvent[]> {
  const all: GameEvent[] = [...ANCHOR_EVENTS, ...PARAMETRIC_EVENTS];
  const index = new Map<number, GameEvent[]>();

  for (const event of all) {
    const decadeKey = Math.floor(event.minAge / 10) * 10;
    if (!index.has(decadeKey)) index.set(decadeKey, []);
    index.get(decadeKey)!.push(event);
  }

  return index;
}

let eventIndexCache: Map<number, GameEvent[]> | null = null;

function getEventIndex(): Map<number, GameEvent[]> {
  if (!eventIndexCache) eventIndexCache = buildEventIndex();
  return eventIndexCache;
}

// 检查事件是否可触发
function isEventEligible(event: GameEvent, state: GameState): boolean {
  const { age, attributes, triggeredEventIds, talents } = state;

  // 年龄范围
  if (age < event.minAge || age > event.maxAge) return false;

  // 锚点事件：检查是否在精确年龄
  if (event.type === "anchor") {
    const triggers = Array.isArray(event.triggerAge) ? event.triggerAge : [event.triggerAge];
    if (!triggers.includes(age as number)) return false;
  }

  // 参数化事件：属性要求
  if (event.type === "parametric") {
    if (event.statRequirements) {
      for (const [key, val] of Object.entries(event.statRequirements) as [AttributeName, number][]) {
        if (attributes[key] < val) return false;
      }
    }
    if (event.requiredTalents) {
      const talentIds = talents.map((t) => t.id);
      if (!event.requiredTalents.every((tid) => talentIds.includes(tid))) return false;
    }
    if (event.excludedTalents) {
      const talentIds = talents.map((t) => t.id);
      if (event.excludedTalents.some((tid) => talentIds.includes(tid))) return false;
    }
    // 触发次数限制
    if (event.maxTriggers !== undefined && event.maxTriggers > 0) {
      const count = [...triggeredEventIds].filter((id) => id === event.id).length;
      if (count >= event.maxTriggers) return false;
    }
  }

  return true;
}

// 获取符合条件的可触发事件
export function getEligibleEvents(state: GameState): GameEvent[] {
  const index = getEventIndex();
  const decadeKey = Math.floor(state.age / 10) * 10;

  // 查询当前 decade 和相邻 decade
  const candidates: GameEvent[] = [];
  for (const dk of [decadeKey - 10, decadeKey, decadeKey + 10]) {
    const events = index.get(dk);
    if (events) candidates.push(...events);
  }

  return candidates.filter((e) => isEventEligible(e, state));
}

// 加权随机选择事件
export function selectEvent(state: GameState): GameEvent | null {
  const eligible = getEligibleEvents(state);
  if (eligible.length === 0) return null;

  // 按权重加权随机
  const totalWeight = eligible.reduce((sum, e) => sum + (e.weight ?? 1), 0);
  let random = Math.random() * totalWeight;

  for (const event of eligible) {
    random -= event.weight ?? 1;
    if (random <= 0) return event;
  }

  return eligible[0];
}

// 判断当前年龄是否应该触发事件
export function shouldTriggerEvent(age: number): boolean {
  if (age <= 5) return false; // 婴幼期自动叙事，不走事件引擎
  if (age <= 30) return true;  // 少年/青年期每岁
  if (age <= 60) return (age - 31) % 3 === 0; // 壮年期每3年
  return (age - 61) % 5 === 0 || (age - 61) % 7 === 0; // 晚年期每5~10年
}
```

- [ ] **Step 4: 验证编译**

```bash
npx tsc --noEmit src/engine/events.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/data/life/events-anchors.ts src/data/life/events-parametric.ts src/engine/events.ts
git commit -m "feat: 添加事件数据和事件引擎（首批35个事件）"
```

---

### Task 10: 在 LifeGame 中集成事件驱动流程

**Files:**
- Modify: `src/components/LifeGame.tsx`

**Interfaces:**
- Consumes: `selectEvent`, `shouldTriggerEvent` from `events.ts`; `checkDeath` from `death.ts`
- Produces: 完整的 playing phase 事件循环

- [ ] **Step 1: 更新 reducer 的 ADVANCE_AGE 处理**

修改 `src/engine/reducer.ts`：

```typescript
// 添加 import:
import { checkDeath, applyNaturalDecay } from "./death";
import { selectEvent, shouldTriggerEvent } from "./events";
import { attr } from "./types";

// 替换 ADVANCE_AGE 处理:
case "ADVANCE_AGE": {
  const nextAge = state.age + 1 > 100 ? 100 : state.age + 1;
  const newState: GameState = {
    ...state,
    age: nextAge as Age,
    phase: { type: "playing", step: "aging" },
  };

  // 应用自然衰老
  const decay = applyNaturalDecay(nextAge);
  for (const [key, val] of Object.entries(decay) as [AttributeName, number][]) {
    newState.attributes = {
      ...newState.attributes,
      [key]: attr(newState.attributes[key] + val),
    };
  }

  // 死亡判定
  const deathCheck = checkDeath(newState);
  if (deathCheck.isDead) {
    return {
      ...newState,
      phase: { type: "dying", cause: deathCheck.cause! },
      deathRecord: { age: newState.age, cause: deathCheck.cause! },
    };
  }

  // 是否需要触发事件
  if (shouldTriggerEvent(nextAge)) {
    const event = selectEvent(newState);
    if (event) {
      newState.currentEvent = event;
      newState.pendingChoices = "choices" in event ? event.choices : null;
      newState.phase = { type: "playing", step: "event_presenting" };
    }
  }

  return newState;
}

// 添加 RESOLVE_EVENT 处理:
case "RESOLVE_EVENT": {
  if (!state.currentEvent || !state.pendingChoices) return state;
  const choice = state.pendingChoices[action.choiceIndex];
  if (!choice) return state;

  const newAttrs = { ...state.attributes };
  if (choice.effects.attributes) {
    for (const [key, val] of Object.entries(choice.effects.attributes) as [AttributeName, number][]) {
      newAttrs[key] = attr(newAttrs[key] + val);
    }
  }

  // 检查选择是否致死
  if (choice.effects.isLethal) {
    return {
      ...state,
      attributes: newAttrs,
      eventLog: [...state.eventLog, {
        age: state.age,
        eventId: state.currentEvent.id,
        title: state.currentEvent.title,
        choiceText: choice.text,
        attributeChanges: choice.effects.attributes ?? {},
      }],
      triggeredEventIds: new Set([...state.triggeredEventIds, state.currentEvent.id]),
      phase: { type: "dying", cause: `因"${state.currentEvent.title}"中的选择而离世` },
      deathRecord: { age: state.age, cause: `因"${state.currentEvent.title}"中的选择而离世` },
      currentEvent: null,
      pendingChoices: null,
    };
  }

  return {
    ...state,
    attributes: newAttrs,
    eventLog: [...state.eventLog, {
      age: state.age,
      eventId: state.currentEvent.id,
      title: state.currentEvent.title,
      choiceText: choice.text,
      attributeChanges: choice.effects.attributes ?? {},
    }],
    triggeredEventIds: new Set([...state.triggeredEventIds, state.currentEvent.id]),
    phase: { type: "playing", step: "effect_resolving" },
    currentEvent: null,
    pendingChoices: null,
  };
}
```

- [ ] **Step 2: 更新 LifeGame 中的 playing phase UI**

修改 `src/components/LifeGame.tsx` 中的 `playing` case：

```typescript
case "playing": {
  const { step } = phase;
  const event = state.currentEvent;
  const choices = state.pendingChoices;

  if (step === "event_presenting" && event && choices) {
    return (
      <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
        <div className="text-center">
          <p className="font-mono text-[10px] text-secondary tracking-widest uppercase mb-2">
            {state.age} 岁
          </p>
          <h2 className="font-serif text-3xl tracking-tighter mb-2">{event.title}</h2>
          <p className="font-mono text-sm text-secondary leading-relaxed">{event.description}</p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          {choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => dispatch({ type: "RESOLVE_EVENT", choiceIndex: i })}
              className="w-full p-4 border border-primary/20 text-left font-mono text-sm hover:border-primary/60 hover:bg-primary/5 transition-colors glass-panel"
            >
              {choice.text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="text-center">
        <p className="font-serif text-8xl tracking-tighter">{state.age}</p>
        <p className="font-mono text-xs text-secondary mt-2">岁</p>
      </div>
      <LifeStatsBars attributes={state.attributes} />
      <button
        onClick={() => dispatch({ type: "ADVANCE_AGE" })}
        className="px-6 py-2 border border-primary font-mono text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-canvas transition-colors"
      >
        推进
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/engine/reducer.ts src/components/LifeGame.tsx
git commit -m "feat: 集成事件驱动流程到 LifeGame"
```

---

## Phase 3: 关系 + 职业

### Task 11: 创建关系和职业引擎

**Files:**
- Create: `src/engine/relationship.ts`
- Create: `src/engine/career.ts`

- [ ] **Step 1: 关系引擎**

```typescript
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
```

- [ ] **Step 2: 职业引擎**

```typescript
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
```

- [ ] **Step 3: Commit**

```bash
git add src/engine/relationship.ts src/engine/career.ts
git commit -m "feat: 添加关系和职业引擎"
```

---

### Task 12: 创建 LifeStatsBars 组件

**Files:**
- Create: `src/components/LifeStatsBars.tsx`

- [ ] **Step 1: 写入属性状态条组件**

```typescript
// src/components/LifeStatsBars.tsx
import { motion, AnimatePresence } from "motion/react";
import type { Attributes, AttributeName } from "../engine/types";

const LABELS: Record<AttributeName, string> = {
  appearance: "颜值",
  intelligence: "智力",
  physique: "体质",
  wealth: "家境",
  creativity: "才脉",
  luck: "运势",
};

const LETHAL = new Set<AttributeName>(["appearance", "intelligence", "physique", "wealth"]);

interface Props {
  attributes: Attributes;
}

export function LifeStatsBars({ attributes }: Props) {
  return (
    <div className="w-full max-w-xs grid grid-cols-2 gap-2">
      {(Object.entries(attributes) as [AttributeName, number][]).map(([key, val]) => (
        <div key={key} className="flex items-center gap-2">
          <span className={`font-mono text-[10px] w-8 text-right ${LETHAL.has(key) ? "text-primary" : "text-secondary"}`}>
            {LABELS[key]}
          </span>
          <div className="flex-1 h-2 bg-primary/5 relative overflow-hidden">
            <motion.div
              className={`absolute inset-y-0 left-0 ${LETHAL.has(key) ? "bg-primary" : "bg-primary/40"}`}
              initial={{ width: 0 }}
              animate={{ width: `${val}%` }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
            />
          </div>
          <span className={`font-mono text-[10px] w-6 ${val <= 10 ? "text-red-700" : "text-secondary"}`}>
            {val}
          </span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LifeStatsBars.tsx
git commit -m "feat: 添加属性状态条组件"
```

---

## Phase 4: 阶段 UI 组件 + 结局 + 存档

### Task 13: 创建婴幼期、少年/青年期、壮年期阶段组件

**Files:**
- Create: `src/components/LifeInfancyStage.tsx`
- Create: `src/components/LifeYouthStage.tsx`
- Create: `src/components/LifeMidlifeStage.tsx`
- Create: `src/components/LifeEventCard.tsx`
- Modify: `src/components/LifeGame.tsx`

- [ ] **Step 1: LifeEventCard 通用组件**

```typescript
// src/components/LifeEventCard.tsx
import { motion } from "motion/react";
import type { GameEvent, EventChoice } from "../engine/types";

interface Props {
  event: GameEvent;
  choices: EventChoice[];
  age: number;
  onChoose: (index: number) => void;
}

export function LifeEventCard({ event, choices, age, onChoose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl flex flex-col gap-8"
    >
      <div className="text-center">
        <p className="font-mono text-[10px] text-secondary tracking-widest uppercase mb-2">
          {age} 岁
        </p>
        <h2 className="font-serif text-3xl tracking-tighter mb-3">{event.title}</h2>
        <div className="h-[1px] w-16 bg-primary/20 mx-auto mb-3" />
        <p className="font-mono text-sm text-secondary leading-relaxed max-w-lg mx-auto">
          {event.description}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {choices.map((choice, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            onClick={() => onChoose(i)}
            className="w-full p-4 border border-primary/20 text-left font-mono text-sm hover:border-primary/60 hover:bg-primary/5 transition-colors glass-panel group"
          >
            <span className="text-[10px] text-secondary mr-2">0{i + 1}</span>
            {choice.text}
            <span className="float-right opacity-0 group-hover:opacity-100 transition-opacity text-secondary">
              →
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: LifeInfancyStage 婴幼期自动叙事**

```typescript
// src/components/LifeInfancyStage.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLife } from "./LifeGame";
import { ANCHOR_EVENTS } from "../data/life/events-anchors";

export function LifeInfancyStage() {
  const { state, dispatch } = useLife();
  const [narrationIndex, setNarrationIndex] = useState(0);

  const infancyEvents = ANCHOR_EVENTS
    .filter((e) => e.maxAge <= 5)
    .sort((a, b) => (a.triggerAge as number) - (b.triggerAge as number));

  useEffect(() => {
    if (narrationIndex >= infancyEvents.length) {
      // 婴幼期结束，进入少年期
      const timer = setTimeout(() => dispatch({ type: "ADVANCE_AGE" }), 500);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setNarrationIndex((i) => i + 1);
    }, 2500);

    return () => clearTimeout(timer);
  }, [narrationIndex]);

  const currentEvent = infancyEvents[narrationIndex];

  if (!currentEvent) {
    return (
      <div className="flex items-center justify-center">
        <p className="font-mono text-xs text-secondary animate-pulse">成长中...</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentEvent.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center gap-6 text-center max-w-lg"
      >
        <p className="font-serif text-5xl tracking-tighter">{currentEvent.title}</p>
        <div className="h-[1px] w-12 bg-primary/20" />
        <p className="font-mono text-sm text-secondary leading-relaxed">
          {currentEvent.description}
        </p>
        <p className="font-mono text-xs text-secondary/50">
          {narrationIndex + 1} / {infancyEvents.length}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: LifeYouthStage（少年/青年期复用）**

```typescript
// src/components/LifeYouthStage.tsx
import { useLife } from "./LifeGame";
import { LifeEventCard } from "./LifeEventCard";
import { LifeStatsBars } from "./LifeStatsBars";

export function LifeYouthStage() {
  const { state, dispatch } = useLife();
  const { currentEvent, pendingChoices, age } = state;

  if (currentEvent && pendingChoices) {
    return (
      <LifeEventCard
        event={currentEvent}
        choices={pendingChoices}
        age={age}
        onChoose={(i) => dispatch({ type: "RESOLVE_EVENT", choiceIndex: i })}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="text-center">
        <p className="font-serif text-8xl tracking-tighter">{age}</p>
        <p className="font-mono text-xs text-secondary mt-2">岁</p>
      </div>
      <LifeStatsBars attributes={state.attributes} />
      <button
        onClick={() => dispatch({ type: "ADVANCE_AGE" })}
        className="px-6 py-2 border border-primary font-mono text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-canvas transition-colors"
      >
        继续
      </button>
    </div>
  );
}
```

- [ ] **Step 4: LifeMidlifeStage 壮年期（3年切片）**

```typescript
// src/components/LifeMidlifeStage.tsx
import { useLife } from "./LifeGame";
import { LifeEventCard } from "./LifeEventCard";
import { LifeStatsBars } from "./LifeStatsBars";
import { motion } from "motion/react";

export function LifeMidlifeStage() {
  const { state, dispatch } = useLife();
  const { currentEvent, pendingChoices, age } = state;

  if (currentEvent && pendingChoices) {
    return (
      <div className="flex flex-col gap-6 items-center w-full max-w-2xl">
        <p className="font-mono text-[10px] text-secondary tracking-widest uppercase">
          切片事件 · {age - 2}~{age} 岁
        </p>
        <LifeEventCard
          event={currentEvent}
          choices={pendingChoices}
          age={age}
          onChoose={(i) => dispatch({ type: "RESOLVE_EVENT", choiceIndex: i })}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="text-center">
        <p className="font-serif text-8xl tracking-tighter">{age}</p>
        <p className="font-mono text-xs text-secondary mt-2">岁</p>
        <p className="font-mono text-[10px] text-secondary/50 mt-1">壮年期 · 黄金时代</p>
      </div>
      <LifeStatsBars attributes={state.attributes} />
      {state.career && (
        <div className="text-center">
          <p className="font-mono text-[10px] text-secondary uppercase tracking-widest">职业</p>
          <p className="font-mono text-sm">{state.career.title}</p>
        </div>
      )}
      <button
        onClick={() => dispatch({ type: "ADVANCE_AGE" })}
        className="px-6 py-2 border border-primary font-mono text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-canvas transition-colors"
      >
        继续（+3岁）
      </button>
    </div>
  );
}
```

- [ ] **Step 5: 更新 LifeGame 根据年龄段渲染不同 Stage**

修改 `src/components/LifeGame.tsx` 的 `playing` case：

```typescript
case "playing": {
  const { age } = state;

  if (age <= 5) return <LifeInfancyStage />;
  if (age <= 30) return <LifeYouthStage />;
  if (age <= 60) return <LifeMidlifeStage />;
  return <LifeYouthStage />; // 晚年期暂时复用
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/LifeEventCard.tsx src/components/LifeInfancyStage.tsx src/components/LifeYouthStage.tsx src/components/LifeMidlifeStage.tsx src/components/LifeGame.tsx
git commit -m "feat: 添加各年龄段阶段组件和事件卡片"
```

---

### Task 14: 创建结局引擎和结算画面

**Files:**
- Create: `src/engine/ending.ts`
- Create: `src/data/life/endings.ts`
- Create: `src/components/LifeDeathScreen.tsx`
- Modify: `src/components/LifeGame.tsx`

- [ ] **Step 1: 结局引擎**

```typescript
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
```

- [ ] **Step 2: 结局数据**

```typescript
// src/data/life/endings.ts
export const ENDING_FLAVOR_TEXTS: Record<number, string> = {
  1: "人生如草木一瞬，短暂但有光。",
  2: "平凡也是一种答案。",
  3: "你活出了自己的样子。",
  4: "这一生，值得被记住。",
  5: "传奇。",
};
```

- [ ] **Step 3: LifeDeathScreen 结算画面**

```typescript
// src/components/LifeDeathScreen.tsx
import { motion } from "motion/react";
import { useLife } from "./LifeGame";
import { computeResult } from "../engine/ending";
import { ENDING_FLAVOR_TEXTS } from "../data/life/endings";

export function LifeDeathScreen() {
  const { state, dispatch } = useLife();
  const result = computeResult(state);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-8 max-w-2xl w-full"
    >
      {/* 星级 */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-3xl ${star <= result.starRating ? "text-primary" : "text-primary/10"}`}
          >
            ★
          </span>
        ))}
      </div>

      {/* 称号 */}
      <h2 className="font-serif text-5xl tracking-tighter text-center">{result.title}</h2>
      <div className="h-[1px] w-24 bg-primary/20" />

      {/* 描述 */}
      <p className="font-mono text-sm text-secondary">{result.description}</p>

      {/* 风味文本 */}
      <p className="font-serif text-lg italic text-primary/60">
        {ENDING_FLAVOR_TEXTS[result.starRating]}
      </p>

      {/* 高亮 */}
      {result.highlights.length > 0 && (
        <div className="flex flex-col gap-2 w-full">
          {result.highlights.map((h, i) => (
            <div key={i} className="p-3 border border-primary/10 font-mono text-xs text-secondary text-center">
              {h}
            </div>
          ))}
        </div>
      )}

      {/* 人生回顾 */}
      {state.eventLog.length > 0 && (
        <div className="w-full border-t border-primary/10 pt-6">
          <p className="font-mono text-[10px] text-secondary tracking-widest uppercase mb-4 text-center">
            人生回顾
          </p>
          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
            {state.eventLog.map((e, i) => (
              <div key={i} className="flex gap-4 font-mono text-[10px] text-secondary/60 hover:text-secondary transition-colors">
                <span className="w-8 text-right shrink-0">{e.age}岁</span>
                <span className="shrink-0">{e.title}</span>
                <span className="truncate">— {e.choiceText}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 重新开始 */}
      <button
        onClick={() => dispatch({ type: "RESTART" })}
        className="px-8 py-3 border border-primary font-mono text-xs tracking-[0.3em] uppercase hover:bg-primary hover:text-canvas transition-colors mt-4"
      >
        再来一局
      </button>
    </motion.div>
  );
}
```

- [ ] **Step 4: 更新 LifeGame 的 result phase**

```typescript
case "result":
  return <LifeDeathScreen />;
```

- [ ] **Step 5: Commit**

```bash
git add src/engine/ending.ts src/data/life/endings.ts src/components/LifeDeathScreen.tsx src/components/LifeGame.tsx
git commit -m "feat: 添加结局系统和结算画面"
```

---

### Task 15: 创建自动存档引擎

**Files:**
- Create: `src/engine/autosave.ts`
- Modify: `src/components/LifeGame.tsx`

- [ ] **Step 1: 存档引擎**

```typescript
// src/engine/autosave.ts
import type { GameState } from "./types";

const SAVE_KEY = "cmys_life_autosave";

interface SaveData {
  state: GameState;
  timestamp: number;
}

// 序列化时处理 Set
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

export function hasSave(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}

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

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {}
}
```

- [ ] **Step 2: 集成存档到 LifeGame**

修改 `src/components/LifeGame.tsx`：

```typescript
// 在 useReducer 初始化时读取存档:
import { hasSave, loadGame, saveGame, clearSave } from "../engine/autosave";

// 替换 useReducer 行:
const [state, dispatch] = useReducer(
  gameReducer,
  null,
  () => hasSave() ? loadGame()! : createInitialState()
);

// 在 dispatch 包装函数中自动保存:
const dispatchWithSave = (action: GameAction) => {
  dispatch(action);
  // 需要读取更新后的 state... 用 useEffect 代替
};

// 改用 useEffect 监听年龄段变化自动保存:
import { useEffect } from "react";

// 在 LifeGame 组件内:
useEffect(() => {
  saveGame(state);
}, [state.age]);
```

- [ ] **Step 3: 添加"继续上次"入口**

在 LifePage.tsx（或 LifeGame 的 idle 状态）中：

```typescript
import { hasSave, loadGame, clearSave } from "../engine/autosave";

// 在开始按钮旁边:
{hasSave() && (
  <button
    onClick={() => {
      const saved = loadGame();
      if (saved) dispatch({ type: "LOAD_SAVE", state: saved });
    }}
    className="..."
  >
    继续上次的旅程
  </button>
)}
```

- [ ] **Step 4: Commit**

```bash
git add src/engine/autosave.ts src/components/LifeGame.tsx src/pages/LifePage.tsx
git commit -m "feat: 添加自动存档和恢复功能"
```

---

## Phase 5: 打磨

### Task 16: 边缘情况处理和完善

**Files:**
- Modify: `src/engine/reducer.ts`
- Modify: `src/components/LifeGame.tsx`

- [ ] **Step 1: 添加属性 clamp 和边界保护**

在 reducer 的 RESOLVE_EVENT 中确保属性不越界（已在 `attr()` 函数中处理）。

- [ ] **Step 2: 处理事件池耗尽**

如果某年龄段事件不足，fallback 到程序事件：

```typescript
// src/engine/events.ts 中添加:
export function generateProceduralEvent(age: number, state: GameState): ProceduralEvent {
  const titles = ["沉默有诗", "春苗雨苏", "纯美意识", "草木一生", "草茂雨水"];
  const title = titles[Math.floor(Math.random() * titles.length)];

  return {
    type: "procedural",
    id: `proc_${age}_${Date.now()}`,
    title,
    minAge: age as Age,
    maxAge: age as Age,
    description: `这是你 ${age} 岁的一年。时光静静流淌。`,
    autoResolve: true,
    effects: {
      intelligence: Math.floor(Math.random() * 3) - 1,
      luck: Math.floor(Math.random() * 3) - 1,
    },
  };
}
```

- [ ] **Step 3: 晚年反思阶段**

```typescript
// 在 LifeGame 的 playing case 中，晚年期 (age > 60) 使用特殊渲染
if (age > 60) {
  return <LifeYouthStage />; // 暂时复用，后续替换为 LifeElderlyStage
}
```

- [ ] **Step 4: Commit**

```bash
git add src/engine/events.ts src/components/LifeGame.tsx
git commit -m "fix: 添加事件池耗尽fallback和边缘保护"
```

---

### Task 17: 最终集成测试和 Header 导航

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: 添加 /life 导航到 Header**

修改 `src/components/Header.tsx` 的 `navLinks` 数组：

```typescript
const navLinks = [
  { name: "纯墨韵声", section: "roots", type: "anchor" as const },
  { name: "驰鸣羽势", section: "growth", type: "anchor" as const },
  { name: "诚盟远溯", section: "now", type: "anchor" as const },
  { name: "聪明一世", path: "/gacha", type: "route" as const },
  { name: "人生模拟", path: "/life", type: "route" as const },
];
```

- [ ] **Step 2: 全流程手动测试**

```bash
npm run dev
```

测试清单：
- [ ] `/life` 页面可访问
- [ ] 天赋 3 轮选择正常
- [ ] 婴幼期自动叙事播放
- [ ] 少年/青年期每岁事件触发
- [ ] 属性变化正确反映在 StatsBars
- [ ] 壮年期 3 年切片事件
- [ ] 属性归零触发死亡
- [ ] 100 岁自然老死
- [ ] 结局结算：星级 + 称号 + 回顾
- [ ] "再来一局"正常
- [ ] 自动存档恢复
- [ ] 从 Header 导航到 /life 和返回

- [ ] **Step 3: TypeScript 编译检查**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: Header 添加 /life 导航入口"
```

---

## 后续迭代计划

- **事件池扩展至 200+：** 继续按模板 A/B/C 造新 CMYS 四字缩写，填充事件
- **LifeElderlyStage 反思模式：** 检查 eventLog 历史，生成 callback 叙事
- **知己关系 UI：** 好感度可视化和关系事件展示
- **职业路径 UI：** 职业树可视化和里程碑展示
- **图鉴系统：** 结局称号收藏册，天赋逐步解锁
- **FortuneSystem 联动：** 每日运势影响 LifeSim 事件权重
