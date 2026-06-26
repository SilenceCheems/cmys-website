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
