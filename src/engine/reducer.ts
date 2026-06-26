// src/engine/reducer.ts
import {
  type GameState, type GameAction, type Attributes, type AttributeName, type Age,
  attr, createAge,
} from "./types";
import { checkDeath, applyNaturalDecay } from "./death";
import { selectEvent, shouldTriggerEvent } from "./events";

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

  const bonusEntries = Object.entries(bonusPoints) as [AttributeName, number][];
  for (const [key, val] of bonusEntries) {
    if (val > 0) {
      base[key] = attr(base[key] + val);
    }
  }

  return base;
}

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

function applyAttributeChanges(
  attrs: Attributes,
  changes: Partial<Record<AttributeName, number>>,
): Attributes {
  const next = { ...attrs };
  for (const [key, val] of Object.entries(changes) as [AttributeName, number][]) {
    next[key] = attr(next[key] + val);
  }
  return next;
}

// ── Reducer ──
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case "START_GAME":
      return { ...state, phase: { type: "playing", step: "aging" }, age: createAge(0) };

    case "ADVANCE_AGE": {
      const nextAge = (state.age as number) + 1 > 100 ? 100 : (state.age as number) + 1;
      let attrs = { ...state.attributes };

      // 应用自然衰老
      const decay = applyNaturalDecay(nextAge);
      attrs = applyAttributeChanges(attrs, decay);

      const newState: GameState = {
        ...state,
        age: createAge(nextAge),
        attributes: attrs,
        phase: { type: "playing", step: "aging" },
        currentEvent: null,
        pendingChoices: null,
      };

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
          if (event.type === "procedural") {
            // 程序事件自动结算
            attrs = applyAttributeChanges(attrs, event.effects);
            newState.attributes = attrs;
            newState.eventLog = [...newState.eventLog, {
              age: newState.age,
              eventId: event.id,
              title: event.title,
              choiceText: "（自动）",
              attributeChanges: event.effects,
            }];
            newState.triggeredEventIds = new Set([...newState.triggeredEventIds, event.id]);
          } else {
            // 锚点/参数化事件：展示选项
            newState.pendingChoices = event.choices;
            newState.phase = { type: "playing", step: "event_presenting" };
          }
        }
      }

      return newState;
    }

    case "RESOLVE_EVENT": {
      if (!state.currentEvent || !state.pendingChoices) return state;
      const choice = state.pendingChoices[action.choiceIndex];
      if (!choice) return state;

      let attrs = applyAttributeChanges(state.attributes, choice.effects.attributes ?? {});
      const event = state.currentEvent;
      const newTriggeredIds = new Set([...state.triggeredEventIds]);

      // 锚点/参数化事件记录触发
      if (event.type === "anchor" || event.type === "parametric") {
        newTriggeredIds.add(event.id);
      }

      // 检查选择是否致死
      if (choice.effects.isLethal) {
        return {
          ...state,
          attributes: attrs,
          eventLog: [...state.eventLog, {
            age: state.age,
            eventId: event.id,
            title: event.title,
            choiceText: choice.text,
            attributeChanges: choice.effects.attributes ?? {},
          }],
          triggeredEventIds: newTriggeredIds,
          phase: { type: "dying", cause: `因"${event.title}"而离世` },
          deathRecord: { age: state.age, cause: `因"${event.title}"而离世` },
          currentEvent: null,
          pendingChoices: null,
        };
      }

      // 应用天赋授予/移除
      let talents = [...state.talents];
      if (choice.effects.grantTalents) {
        // 延迟实现
      }
      if (choice.effects.removeTalents) {
        talents = talents.filter((t) => !choice.effects.removeTalents!.includes(t.id));
      }

      const resolvedState: GameState = {
        ...state,
        attributes: attrs,
        talents,
        eventLog: [...state.eventLog, {
          age: state.age,
          eventId: event.id,
          title: event.title,
          choiceText: choice.text,
          attributeChanges: choice.effects.attributes ?? {},
        }],
        triggeredEventIds: newTriggeredIds,
        phase: { type: "playing", step: "effect_resolving" },
        currentEvent: null,
        pendingChoices: null,
      };

      // 选项结算后再次判定死亡
      const postDeathCheck = checkDeath(resolvedState);
      if (postDeathCheck.isDead) {
        return {
          ...resolvedState,
          phase: { type: "dying", cause: postDeathCheck.cause! },
          deathRecord: { age: resolvedState.age, cause: postDeathCheck.cause! },
        };
      }

      return resolvedState;
    }

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

    case "SELECT_TALENT": {
      return state;
    }

    case "LOAD_SAVE": {
      return {
        ...action.state,
        triggeredEventIds: action.state.triggeredEventIds ?? new Set(),
      };
    }

    default:
      return state;
  }
}
