# 成就支撑事件 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增 25 个事件 + 3 个引擎改动，确保全部 16 个成就均可触发

**Architecture:** types（添加字段）→ reducer（处理新 effect）+ achievements（修复判定）→ 事件数据（25个新事件写入）

**Tech Stack:** React 19 + TypeScript 5.8 + Vite 6 + Motion

## Global Constraints

- 所有事件标题 CMYS 四字首字母（pypinyin 验证 `initials == 'cmys'`）
- 引擎层纯函数
- TypeScript strict，`npx tsc --noEmit` 零错误
- 每个事件含完整 description / choices / resultText
- 关系事件必须含 `relationshipEffect`
- CMYS 标题不得与已有事件重复

---

## 文件结构

```
src/
  engine/
    types.ts              # [修改] EventChoice.effects 加 careerLevelDelta，GameState 加 nearDeathCount
    reducer.ts            # [修改] relationshipEffect + careerLevelDelta 处理，nearDeathCount 追踪
  data/life/
    achievements.ts       # [修改] phoenix 改用 nearDeathCount，ladykiller loveEventIds 改为5个
    events-parametric.ts  # [修改] 追加 25 个新事件
```

---

### Task 1: 类型定义 + Reducer 引擎改动

**Files:**
- Modify: `src/engine/types.ts`
- Modify: `src/engine/reducer.ts`

**Interfaces:**
- Produces: `EventChoice.effects.careerLevelDelta?: number`、`GameState.nearDeathCount: number`
- Consumes: `updateAffinity` from `relationship.ts`

- [ ] **Step 1: types.ts — EventChoice.effects 添加 careerLevelDelta**

在 `src/engine/types.ts` 第 82 行 `relationshipEffect` 之后插入：

```typescript
    careerLevelDelta?: number;  // 新增：职业等级变化
```

- [ ] **Step 2: types.ts — GameState 添加 nearDeathCount**

在 `src/engine/types.ts` 的 `GameState` 接口中，`deathRecord` 之前添加：

```typescript
  nearDeathCount: number;  // 新增：遭遇即死选项的次数
```

- [ ] **Step 3: reducer.ts — createInitialState 添加 nearDeathCount: 0**

在 `src/engine/reducer.ts` 的 `createInitialState` 返回对象中，`deathRecord: null` 之前添加：

```typescript
    nearDeathCount: 0,
```

- [ ] **Step 4: reducer.ts — RESOLVE_EVENT 处理 relationshipEffect**

在 `RESOLVE_EVENT` 中，`// 应用天赋授予/移除` 代码块之前，添加关系处理：

```typescript
      // 应用关系效果
      let relationships = [...state.relationships];
      if (choice.effects.relationshipEffect) {
        const { targetId, change } = choice.effects.relationshipEffect;
        relationships = relationships.map((r) => {
          if (r.id === targetId || (targetId === "confidant" && r.tag === "confidant")) {
            return updateAffinity(r, change);
          }
          return r;
        });
      }
```

并在文件顶部导入 `updateAffinity`（已从 `./relationship` 导入 `generateConfidant`，追加 `updateAffinity`）：

```typescript
import { generateConfidant, updateAffinity } from "./relationship";
```

- [ ] **Step 5: reducer.ts — RESOLVE_EVENT 处理 careerLevelDelta**

在关系处理之后、天赋处理之前，添加职业等级处理：

```typescript
      // 应用职业等级变化
      let career = state.career;
      if (choice.effects.careerLevelDelta && career) {
        const newLevel = Math.max(1, Math.min(10, career.level + choice.effects.careerLevelDelta));
        career = { ...career, level: newLevel };
      }
```

- [ ] **Step 6: reducer.ts — nearDeathCount 追踪**

在 `RESOLVE_EVENT` 的 `resolvedState` 构建中，检查当前事件是否含 `isLethal` 选项：

```typescript
      // 检查当前事件是否包含致死选项（用于不死鸟成就追踪）
      const eventHasLethalOption = (event.type === "anchor" || event.type === "parametric") &&
        (event as any).choices?.some((c: any) => c.effects?.isLethal);
```

将此逻辑整合进 `resolvedState` 的构建中，在 `resolvedState` 对象里添加：

```typescript
        nearDeathCount: state.nearDeathCount + (eventHasLethalOption ? 1 : 0),
```

- [ ] **Step 7: 整合 resolvedState**

修改 `resolvedState` 构建，加入所有新字段：

```typescript
      const resolvedState: GameState = {
        ...state,
        attributes: attrs,
        talents,
        relationships,
        career,
        eventLog: [...state.eventLog, {
          age: state.age,
          eventId: event.id,
          title: event.title,
          choiceText: choice.text,
          attributeChanges: choice.effects.attributes ?? {},
        }],
        triggeredEventIds: newTriggeredIds,
        nearDeathCount: state.nearDeathCount + (eventHasLethalOption ? 1 : 0),
        phase: { type: "playing", step: "effect_resolving" },
        currentEvent: null,
        pendingChoices: null,
        lastResult: {
          text: choice.resultText ?? `你选择了"${choice.text}"。`,
          attributeChanges: choice.effects.attributes ?? {},
        },
      };
```

注意：`talents`、`relationships`、`career` 变量从步骤 4-5 中获取。

- [ ] **Step 8: LOAD_SAVE 兼容 nearDeathCount**

在 `LOAD_SAVE` case 中确保 `nearDeathCount` 有默认值：

```typescript
    case "LOAD_SAVE": {
      const loaded = action.state;
      let triggered: Record<string, number> = {};
      const raw = loaded.triggeredEventIds;
      if (raw instanceof Set) {
        for (const id of raw) { triggered[id] = loaded.age as number; }
      } else if (raw && typeof raw === "object") {
        triggered = { ...raw as Record<string, number> };
      }
      return {
        ...loaded,
        triggeredEventIds: triggered,
        nearDeathCount: loaded.nearDeathCount ?? 0,
      };
    }
```

- [ ] **Step 9: 验证编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 10: Commit**

```bash
git add src/engine/types.ts src/engine/reducer.ts
git commit -m "feat: 引擎支持关系效果、职业等级变化、不死鸟追踪"
```

---

### Task 2: 成就判定修复

**Files:**
- Modify: `src/data/life/achievements.ts`

- [ ] **Step 1: ladykiller — 爱情事件 ID 扩展为 5 个**

将 `ladykiller` 的 `loveEventIds` 从 3 个改为 5 个：

```typescript
      const loveEventIds = ["a_love_first", "p_mid_family", "p_young_moon_toast", "p_love_unrequited", "p_love_reunion"];
```

- [ ] **Step 2: phoenix — 改用 nearDeathCount**

```typescript
    check: (s) => {
      return s.nearDeathCount >= 3 && s.deathRecord === null;
    },
```

- [ ] **Step 3: 验证编译**

```bash
npx tsc --noEmit src/data/life/achievements.ts
```

- [ ] **Step 4: Commit**

```bash
git add src/data/life/achievements.ts
git commit -m "fix: 成就判定修复 — phoenix 用 nearDeathCount, ladykiller 扩展为5个爱情事件"
```

---

### Task 3: 新增 25 个事件

**Files:**
- Modify: `src/data/life/events-parametric.ts`

**Interfaces:**
- Consumes: `ParametricEvent`, `createAge` from `types.ts`
- Produces: 25 个新事件追加到 PARAMETRIC_EVENTS 数组

- [ ] **Step 1: 追加知己关系事件（8 个）**

在 `PARAMETRIC_EVENTS` 数组末尾（最后一个 `];` 之前）添加：

```typescript
  // ══ 知己关系事件（esu狗子）══
  {
    type: "parametric", id: "p_rel_kid_friend", title: "赤没影深",
    description: "你和新来的转学生 esu狗子 成了同桌。他教你把课本立在桌上挡住老师的视线，在下面传小纸条。那是你第一次觉得——上学也没那么无聊。",
    minAge: createAge(8), maxAge: createAge(14), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "跟他一起逃课去操场", effects: { relationshipEffect: { targetId: "confidant", change: 20 }, attributes: { creativity: 2 } }, resultText: "我们翻过围墙溜到后操场上，躺在草地上看云。狗子说他以后想当飞行员，问我想干什么。我认真想了想——好像想干什么都行，只要跟他一块。友谊这种东西，来得没道理，但好像一来了就再没走过。" },
      { text: "劝他回教室好好上课", effects: { relationshipEffect: { targetId: "confidant", change: 5 }, attributes: { intelligence: 2 } }, resultText: "我把他拽回教室。狗子嘟囔了一整节课，但最后还是把笔记抄整齐了。放学时他说：'你管我，但管得还行。'我翻了个白眼，心里却有点暖。" },
    ],
  },
  {
    type: "parametric", id: "p_rel_kid_fight", title: "沉默雨散",
    description: "你们因为一件小事闹翻了——你忘了在狗子生日那天赴约。他在雨中等了你两个多小时。第二天见面时，他一声不吭，看都不看你一眼。",
    minAge: createAge(10), maxAge: createAge(16), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "买了他最喜欢的零食去道歉", effects: { relationshipEffect: { targetId: "confidant", change: 10 }, attributes: { appearance: 1 } }, resultText: "我拎着一袋旺仔牛奶蹲在他家门口。他开了门，看了我一眼，又看了看旺仔——没忍住笑了一下。然后板着脸说：'进来。'那个夏天的雨下了很久，但我们的冷战只撑了四天。" },
      { text: "我没错，他不来是他小气", effects: { relationshipEffect: { targetId: "confidant", change: -15 }, attributes: { creativity: 1 } }, resultText: "我们又冷战了两周。在走廊上擦肩而过假装不认识，体育课分组也各站一边。后来有人告诉我狗子家里出了事——那个生日是他最需要一个朋友的一次。我站在操场角落沉默了半个下午。" },
    ],
  },
  {
    type: "parametric", id: "p_rel_young_drunk", title: "赤没夜深",
    description: "大学那年你失恋喝得烂醉如泥。凌晨两点手机响了——是狗子打来的。他什么都没问就说了一句：'你在哪，我来接你。'",
    minAge: createAge(18), maxAge: createAge(25), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "在电话里把所有的委屈都倒出来", effects: { relationshipEffect: { targetId: "confidant", change: 25 }, attributes: { creativity: 2 } }, resultText: "他骑着电动车过来接我，我坐在后座上抱着他的腰哭了一路。回到他家后他给我泡了碗泡面，坐在旁边听我语无伦次地说了一夜——关于那个人，关于愚蠢的爱情，关于我到底有多傻。天亮的时候他说：'没事，我在这。'" },
      { text: "说没事，挂掉电话自己走回家", effects: { relationshipEffect: { targetId: "confidant", change: 5 }, attributes: { physique: 1 } }, resultText: "我挂了电话，一个人歪歪扭扭地走了四十分钟回家。第二天狗子发了一长串消息，都是问号。我回了句'没事啊昨晚喝多了就睡了'。他没有再追问，但我总觉得那条消息里藏着一种我没能开口的孤独。" },
    ],
  },
  {
    type: "parametric", id: "p_rel_young_debt", title: "沉没应逝",
    description: "你毕业后手头紧，从狗子那里借了一笔钱。说好三个月还，现在已经拖了九个月。你没脸接他的电话，他的消息也越回越短。今天他直接站在了你出租屋门口。",
    minAge: createAge(20), maxAge: createAge(28), weight: 2, maxTriggers: 1, cooldownYears: 999,
    statRequirements: { wealth: 3 },
    choices: [
      { text: "开门面对，把实情说出来", effects: { relationshipEffect: { targetId: "confidant", change: -5 }, attributes: { wealth: -3, intelligence: 1 } }, resultText: "我开了门，把我们实习公司欠薪的事全说了。狗子坐在我那张塌了半个角的沙发上，沉默了半分钟，然后说：'你早说啊。'他没说不要我还，只说了句：'有钱了再还，不着急。'我知道这段关系里我欠了一笔账——不只是钱。" },
      { text: "编个借口从后窗溜走", effects: { relationshipEffect: { targetId: "confidant", change: -20 }, attributes: { luck: -2 } }, resultText: "我从后窗翻了出去，给他的手机发了一句'不在家'。过了一个小时他回了一个字：'哦。'从那以后这个字成了我们之间最常见的聊天内容——哦。哦。哦。我们之间终于只剩下了一个语气词。" },
    ],
  },
  {
    type: "parametric", id: "p_rel_mid_brother", title: "赤明永生",
    description: "你出了事——具体什么事已经不重要了。重要的是你躺在医院里，第一个出现在病房门口的是狗子。他看起来一夜没睡，手里拎着一袋水果，表情很难看。",
    minAge: createAge(32), maxAge: createAge(48), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "抓住他的手，说一声\"兄弟\"", effects: { relationshipEffect: { targetId: "confidant", change: 20 }, attributes: { luck: 3 } }, resultText: "我伸出手，狗子握住了。他的掌心很粗糙——这些年他过得也不容易。我们什么都没说，但好像什么都说了。他递给我一个橘子：'给你剥好了。'橘子很甜，比医院食堂的饭菜好吃一万倍。" },
      { text: "强撑着说没事，让他走", effects: { relationshipEffect: { targetId: "confidant", change: 5 }, attributes: { physique: 2 } }, resultText: "我说'没事你回去吧'，他看了我一眼，放下水果转身走了。走廊里他的脚步停了大概两秒，然后又响了起来。后来他再也没有主动来看过我。我想叫他，但话始终堵在喉咙里。" },
    ],
  },
  {
    type: "parametric", id: "p_rel_mid_betray", title: "沉默欲碎",
    description: "一个你们共同的朋友在你和狗子之间传了话——两边各说了一半，两边都觉得自己被背叛了。狗子发了一条很长的消息来质问你，字字句句都带着你从未见过的冰冷。",
    minAge: createAge(35), maxAge: createAge(50), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "去找他当面把话说清楚", effects: { relationshipEffect: { targetId: "confidant", change: -10 }, attributes: { intelligence: 2 } }, resultText: "我开车去了他家，在楼下等了两个小时。他最终下来了，眼睛有点红。我们在小区长椅上把事情从头捋了一遍——发现那个'共同朋友'两边都在撒谎。误会解开了，但裂痕还在。有些话说出口就收不回来，即使你知道那不是真的。" },
      { text: "回一条更狠的消息，绝交", effects: { relationshipEffect: { targetId: "confidant", change: -25 }, attributes: { creativity: -2 } }, resultText: "我写了一千字的长消息回过去，最后一句是'你要是这么想，那没什么好说的了'。发出去之后我看着手机屏幕从亮变暗，他没有再回复。后来听说他换了城市。那句话成了我们之间的句号。" },
    ],
  },
  {
    type: "parametric", id: "p_rel_elder_reunion", title: "沉暮永生",
    description: "多年以后在街上遇到了狗子。他头发白了，你也白了。你们站在原地互相看了很久——然后都笑了。时间把很多恩怨都冲刷成了砂砾，金子在阳光下还在发亮。",
    minAge: createAge(62), maxAge: createAge(78), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "请他到家里吃一顿饭", effects: { relationshipEffect: { targetId: "confidant", change: 25 }, attributes: { luck: 3, creativity: 2 } }, resultText: "老伴做了一桌子菜，狗子带了瓶老酒。我们喝到深夜，把年轻时的事一件一件翻出来——那些当时觉得天大的事，现在看来都像笑话。他临走的时候拍着我的肩膀说：'这辈子交你这个朋友，值了。'我站在门口看着他的车灯消失，眼眶有点热。" },
      { text: "寒暄两句然后告别", effects: { relationshipEffect: { targetId: "confidant", change: 5 }, attributes: { luck: 1 } }, resultText: "我们站在街边聊了十分钟——工作、孩子、身体。然后他说要赶公交，转身走了。我看着他的背影，想起几十年前在操场上等我的那个少年。有些关系像河，不刻意维护就会干涸——而我们两个都太久没有浇过水了。" },
    ],
  },
  {
    type: "parametric", id: "p_rel_elder_help", title: "赤没永逝",
    description: "狗子病重了。他的家人打电话给你——说他一直在念叨你的名字。你赶到医院，他躺在病床上，人瘦了一圈，但看见你的时候眼睛亮了一下。",
    minAge: createAge(65), maxAge: createAge(82), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "每天来医院陪他，直到最后", effects: { relationshipEffect: { targetId: "confidant", change: 30 }, attributes: { luck: 5, wealth: -5 }, resultText: "我每天下午来医院，给他读报纸、讲笑话、唠叨他的药有没有按时吃。有一天他忽然说：'谢谢你。'声音很轻，但我知道这是他这辈子对我说过最重的话。后来他走了。走的时候握着我的手。我很久没有哭过了——但那天哭了。" },
      { text: "来看了几次，但生活实在太忙了", effects: { relationshipEffect: { targetId: "confidant", change: -30 }, attributes: { wealth: 2 } }, resultText: "我来了三次——第一次、第二次、然后过了很久才来第三次。他的家人说他已经不怎么能说话了。我站在病床前，他睁眼看着我，嘴动了动——不知道是在叫我，还是在说算了。我走出医院大楼的时候，觉得有什么东西永远留在了那间病房里。" },
    ],
  },
```

- [ ] **Step 2: 追加财富大波动事件（6 个）**

```typescript
  // ══ 财富大波动事件 ══
  {
    type: "parametric", id: "p_wealth_scam", title: "沉没银山",
    description: "一个老同学突然联系你，说带你去'听课'，可以快速致富。你心里知道这听起来不太对，但看着满场热血沸腾的演讲，你的理智开始摇摆。",
    minAge: createAge(22), maxAge: createAge(28), weight: 2, maxTriggers: 1, cooldownYears: 999,
    statRequirements: { intelligence: 2 },
    choices: [
      { text: "投入全部积蓄\"创业\"", effects: { attributes: { wealth: -25, intelligence: 2 } }, resultText: "我把工作两年攒的八万块投了进去。一个月后，那个'公司'被查封了——传销。老同学的微信头像变成了灰色。我站在出租屋里的镜子前看着自己，觉得这个教训比任何一堂课都贵——但至少，我以后不会再上同样的当了。" },
      { text: "觉得不对劲，拒绝离开", effects: { attributes: { intelligence: 3, wealth: 2 } }, resultText: "我悄悄拿出手机搜了一下那个'项目'的名字——第一条结果就是'诈骗'。我趁上厕所的机会溜了。后来听说那个人骗了好几个老同学的钱，最多的投了二十万。我庆幸自己的那一瞬间犹豫。" },
    ],
  },
  {
    type: "parametric", id: "p_wealth_invest", title: "赤明银生",
    description: "一个做技术的朋友让你投一笔钱到他刚做的项目。你不太懂技术，但他说十个点——十个点就是翻倍。你看着账上那笔存款，想：万一这次是真的呢？",
    minAge: createAge(24), maxAge: createAge(30), weight: 2, maxTriggers: 1, cooldownYears: 999,
    statRequirements: { wealth: 3 },
    choices: [
      { text: "投一半试试", effects: { attributes: { wealth: 30, luck: 3 } }, resultText: "我投了五万。半年后他发来截图——产品被收购了。五万变成了二十一万。我盯着银行短信看了五分钟，然后给家里打了个电话。这是我人生中第一次不是因为借钱才打回家的电话。这种感觉太他妈好了。" },
      { text: "保守，还是存定期吧", effects: { attributes: { wealth: 3, luck: -1 } }, resultText: "我把那笔钱存了定期。三年后朋友的公司上市了——新闻上说他身价翻了二十倍。我举着报纸看了很久，然后把那杯咖啡喝完了。不是后悔，只是有点羡慕当初那个敢赌一把的自己。" },
    ],
  },
  {
    type: "parametric", id: "p_wealth_fail", title: "沉没银碎",
    description: "你和人合伙开了公司。起初每天都是希望——见客户、签合同、扩张招人。但这一年风向变了，客户回款断了，合伙人开始频频请假。今天推开办公室门，保险箱开着，电脑硬盘被拆走，桌上只剩下一张纸条：'对不起。'",
    minAge: createAge(32), maxAge: createAge(45), weight: 2, maxTriggers: 1, cooldownYears: 999,
    statRequirements: { wealth: 4 },
    choices: [
      { text: "报警、清算、重新开始", effects: { attributes: { wealth: -30, intelligence: 3, luck: 2 } }, resultText: "我给律师打了电话，整理好所有的财务记录报了案。公司清算那天我站在空荡荡的办公室里抽了根烟——然后拨通了第一个新客户的电话。三年后我在同一栋楼里重新开了公司。那块玻璃上刻着的公司名换了一个字——但这次我学会了怎么看人。" },
      { text: "算了，认栽。找份工作安稳过", effects: { attributes: { wealth: -15, luck: 1, physique: 1 } }, resultText: "我拿了最后的工资走人。新工作薪水不高但稳定——不用再担心回款和工资。坐在格子间里有时候会想起以前创业的日子，像一场梦。说实话，有时晚上睡不着会想象——如果我没放弃会怎样？但没有如果了。" },
    ],
  },
  {
    type: "parametric", id: "p_wealth_house", title: "仓满银实",
    description: "老家来电话说那片老宅要拆迁了。政策很优惠——补偿金不是一笔小数目。父母把决定权交给你。",
    minAge: createAge(35), maxAge: createAge(50), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "签字，拿补偿金改善生活", effects: { attributes: { wealth: 35, creativity: -1 } }, resultText: "签完字那天我站在那片即将消失的巷子里发了一会呆。小时候在这里捉迷藏、放风筝、挨过打也挨过糖。那些记忆换了一笔钱——我知道这不公平，但日子还要过。我用那笔钱付了房子的首付，剩下的存给了孩子。" },
      { text: "不签，留住老宅", effects: { attributes: { wealth: 5, luck: 3, creativity: 3 } }, resultText: "我在协议上写了'不同意'三个字交还给了工作组。后来那片老宅被政府保留改成了文化街区——我每次回去都觉得，那不仅是留住了一栋房子，是留住了一段不会被拆迁的记忆。钱可以再赚，但有些东西没了就真的没了。" },
    ],
  },
  {
    type: "parametric", id: "p_wealth_illness", title: "残明银逝",
    description: "医院走廊的白炽灯嗡嗡响。缴费单上的数字让你头皮发麻——手术加住院加后期康复，差不多是你这些年的全部积蓄。护士第三次来催缴费了。",
    minAge: createAge(40), maxAge: createAge(55), weight: 2, maxTriggers: 1, cooldownYears: 999,
    statRequirements: { physique: 3 },
    choices: [
      { text: "全部积蓄拿出来治病", effects: { attributes: { wealth: -35, physique: 8, luck: 3 } }, resultText: "我在银行转出了最后一笔钱的时候手是抖的。但手术很顺利，住院的那三周是我这辈子第一次这么认真地看窗外的日出——一天一天，天亮了。出院那天账单清零，口袋也清零了。但只要人还在，账就是一本可以重新写的空白本子。" },
      { text: "保守治疗，省下钱留给家人", effects: { attributes: { physique: -5, wealth: -5, luck: -2 } }, resultText: "我没做那个最贵的手术。省下的钱留给家人，自己靠药物慢慢养。后来虽然落了点后遗症，但看着孩子的学费有着落的时候，我咬咬牙觉得——这买卖不亏。只是有时候夜里痛醒，会想那个更好的方案。但也就是想想。" },
    ],
  },
  {
    type: "parametric", id: "p_wealth_mentor", title: "赤明银升",
    description: "一位行业前辈约你喝咖啡。他快退休了，没有孩子，说看中你很多年了——想把手里一个盈利的项目和一部分客户资源转给你。只有一个条件：保持项目的初心。",
    minAge: createAge(38), maxAge: createAge(52), weight: 2, maxTriggers: 1, cooldownYears: 999,
    statRequirements: { wealth: 3, intelligence: 5 },
    choices: [
      { text: "郑重接受，接下这份衣钵", effects: { attributes: { wealth: 30, intelligence: 3, appearance: 2 } }, resultText: "我花了三个月完成交接，把每一个流程跑通、每一个客户走访一遍。老前辈在电话里说'我没看错你'，然后笑着挂了。我对着窗外的晚霞端了一杯咖啡——不是咖啡店的，是办公室里的。苦，但我自己冲的。" },
      { text: "婉拒，不想背负别人的期望", effects: { attributes: { wealth: 5, creativity: 3, luck: 2 } }, resultText: "我恭敬地谢绝了。走出咖啡馆的时候心里有一丝可惜，但更多的是释然——有些责任太重了，接不住就是接不住。我走自己的路，虽然慢一点，但踏实。那杯咖啡的味道我一直记得——干净，没有负担。" },
    ],
  },
```

- [ ] **Step 3: 追加运势极端事件（4 个）**

```typescript
  // ══ 运势极端事件（涨→跌→续跌→翻盘）══
  {
    type: "parametric", id: "p_luck_rise", title: "春明运升",
    description: "这一阵你的人生好像开了挂——考试押题全中，参加比赛拿了一等奖，走在路上都能被街拍的夸长得好看。连路边捡的刮刮乐都中了二十块。你开始觉得：命运是不是终于站在自己这边了？",
    minAge: createAge(10), maxAge: createAge(15), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "保持谦逊，继续做好自己", effects: { attributes: { luck: 15, intelligence: 2 } }, resultText: "我把那些幸运攒在心里，没有到处炫耀。依旧每天最早到教室，依旧把作业写得工工整整。妈妈说你变了——变得稳重了。其实我没变，我只是怕把这些好运一口气都用完。但心里有一个声音悄悄说——原来我也值得被命运垂青。" },
      { text: "沾沾自喜，到处炫耀", effects: { attributes: { luck: 25, appearance: -2 } }, resultText: "我把奖状贴在书包外面，把街拍照发到所有群聊里。同学们开始疏远我——但我没注意到。青春期的膨胀像气球，越吹越大，看不到那根针已经举起来了。但至少在当下——我觉得自己无所不能。" },
    ],
  },
  {
    type: "parametric", id: "p_luck_crash", title: "残明运碎",
    description: "运势急转直下。比赛失利、朋友疏远、家里开始出现争吵——所有你在意的东西都在同时崩塌。你觉得自己像站在风暴中心的一根稻草，什么都抓不住。那些曾经的好运去哪了？",
    minAge: createAge(18), maxAge: createAge(25), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "闭门不出，一个人待着", effects: { attributes: { luck: -35, creativity: 3 } }, resultText: "我在出租屋里闷了两周，把窗帘拉得严严实实。翻了所有能翻的书，听遍了所有能听的歌——但心里那个黑洞还是越来越大。在最低谷的某天深夜，我在日记本上写了一句话：'只有当一切都不顺的时候，你才知道自己真正想要什么。'" },
      { text: "硬撑着笑对所有人", effects: { attributes: { luck: -20, appearance: 3, intelligence: 1 } }, resultText: "我假装什么都没发生——继续上课、继续社交、继续发朋友圈。但每晚关上门以后，我连洗澡的力气都没有。有一天在图书馆角落里，一个不太熟的同学递来一包纸巾。他什么都没说，但那一刻我差点崩溃。原来逞强比示弱累得多。" },
    ],
  },
  {
    type: "parametric", id: "p_luck_deep", title: "沉默运逝",
    description: "烂事好像潮水一样一波接着一波——丢了工作、房东涨租、手机也在这个月碎了屏。你去买个彩票想转转运，结果连末等奖都没中。你蹲在彩票亭门口，忽然笑了——不是开心，是觉得荒谬。",
    minAge: createAge(22), maxAge: createAge(30), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "放弃抵抗，随波逐流", effects: { attributes: { luck: -20, creativity: -1 } }, resultText: "我把碎屏的手机插上充电器，继续投着石沉大海的简历。屏幕裂痕里漏出来的光像极了我四分五裂的生活。我开始接受——也许这就是我的人生剧本。就这样吧。但偶尔半夜醒来，心底深处还有那么一小簇不肯熄灭的火苗。" },
      { text: "咬着牙一件一件解决", effects: { attributes: { luck: -5, physique: -2, intelligence: 2 } }, resultText: "我先换了手机屏，然后把房东说服延期了两个月，再一份一份地改简历投出去。最崩溃的那个晚上我想过放弃——但第二天早上闹钟一响我还是坐起来了。不是因为坚强，是因为我不知道除了继续走还能做什么。而这恰恰是走出谷底的唯一方式。" },
    ],
  },
  {
    type: "parametric", id: "p_luck_reborn", title: "迟明运生",
    description: "人生最深的谷底之后，一道光照了进来。一个你从未想过会再联系的人主动找上你，给你带来了一个意想不到的机会。你没有理由相信这次会好——但你也没有理由再拒绝了。",
    minAge: createAge(30), maxAge: createAge(45), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "抓住这个机会，全力翻盘", effects: { attributes: { luck: 40, creativity: 5, wealth: 10 } }, resultText: "我挂掉电话后深吸了一口气——机会来得毫无预兆，像是命运忽然记起了那个在谷底不肯认输的人。我用尽全力抓住它，像溺水的人抓住岸边的草。三年后回看——那一通电话改变了一切。正如老话说的：宝剑锋从磨砺出。" },
      { text: "谨慎观望，不敢再信了", effects: { attributes: { luck: 15, intelligence: 3, wealth: 3 } }, resultText: "我说'让我考虑一下'——这些年被骗怕了。花了一周做调查、问熟人、看数据——最后才点了头。这一次我没赌那么大，但每一步都踩得很稳。有些事情不需要孤注一掷，慎重本身也是一种幸运。" },
    ],
  },
```

- [ ] **Step 4: 追加爱情事件（2 个）**

```typescript
  // ══ 爱情事件（情圣成就扩展）══
  {
    type: "parametric", id: "p_love_unrequited", title: "春梦雨散",
    description: "你喜欢的那个人今天在朋友圈官宣了——不是跟你。你刷到那条动态的时候正在吃泡面，筷子停在半空中整整十秒。窗外下着小雨，你忽然理解了为什么古人说'多情却被无情恼'。",
    minAge: createAge(19), maxAge: createAge(24), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "默默删掉对话框和照片", effects: { attributes: { creativity: 3, appearance: 1 } }, resultText: "我把聊天记录从头翻到尾——那些秒回的、转账的、凌晨两点的、对方只回了一个'嗯'的。然后点了删除键。删除只需要一秒钟，但接受'我从来没有在那个人的未来里存在过'，需要的时间比想象中长得多。雨停之后我出门走了很远——走到路灯都亮了又灭了。" },
      { text: "发一条仅自己可见的朋友圈", effects: { attributes: { creativity: 5, luck: 1 } }, resultText: "我在朋友圈编辑框里打了五百多个字——从初见写到此刻。每一个字都像从身体里抠出来的。然后设置为'仅自己可见'。发出去的那一刻眼泪滴在屏幕上。那段文字我后来再没打开看过——但我知道它一直在那里，像一枚埋在身体里的子弹。" },
    ],
  },
  {
    type: "parametric", id: "p_love_reunion", title: "迟梦永生",
    description: "多年后的同学会上，你见到了当年那个人。对方胖了一点、笑得没那么好看了——身上的光环也似乎褪尽了。有人说TA最近刚离婚，过得不怎么好。你们的目光在人群里碰了一下，然后各自移开了。",
    minAge: createAge(28), maxAge: createAge(38), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "走过去，敬TA一杯\"敬往事\"", effects: { attributes: { creativity: 5, appearance: 3, luck: 2 } }, resultText: "我端着杯子走过去说：'这些年你还好吗？'——开场白很老套，但我找不到更好的了。我们聊了很久，从工作到生活，从过去的误解到现在的不易。散场时TA说：'其实我以前也有点喜欢你，只是那时候说不出口。'我在停车场站了很久，对着手机屏幕笑了笑——有些答案，等了很多年。但来了就好。" },
      { text: "远远看着，不打扰", effects: { attributes: { intelligence: 3, luck: 2 } }, resultText: "我站在人群的另一侧，没有走过去。有那么一瞬间我想迈开步子——但脚像钉在了原地。散场后回家的路上，广播里放了一首老歌，是当年TA最喜欢的那首。我调高了音量，跟着哼了几句。有些人的意义不在于重逢，而在于他们曾经如何在你的青春里留下过痕迹。" },
    ],
  },
```

- [ ] **Step 5: 追加少年体质惩罚事件（2 个）**

```typescript
  // ══ 少年体质惩罚事件 ══
  {
    type: "parametric", id: "p_phys_picky", title: "赤没影生",
    description: "你挑食得厉害——青菜不吃、鱼不吃、鸡蛋只吃蛋白。妈妈每天跟在你后面追着喂饭。体育课上跑两百米就喘不过气，同学们在终点等了你好久。",
    minAge: createAge(6), maxAge: createAge(10), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "照旧挑食，偏不吃", effects: { attributes: { physique: -8, intelligence: 1 } }, resultText: "我把青菜拨到盘子边上，假装吃过了。体育课上的成绩一直在倒数——但我安慰自己：反正我又不打算当运动员。直到体检那天医生推了推眼镜看着我说：'孩子，你有点营养不良。'那个词好重——我回家第一次默默把青菜吃完了。" },
      { text: "听妈妈的话试着每样吃一点", effects: { attributes: { physique: 3, luck: 1 } }, resultText: "我鼓起勇气吃了一筷子菠菜——好像也没那么难吃。慢慢地我开始尝试更多东西，饭量大了，人也精神了。后来的体育课上我不但追上了队伍，还超过了几个老对手。妈妈笑着说：'看吧，不挑食就是不一样。'" },
    ],
  },
  {
    type: "parametric", id: "p_phys_gaming", title: "沉明夜深",
    description: "新出的那款游戏太好玩了。你每天放学就把自己关在房间里打游戏，凌晨三点还在组队刷副本。早饭经常只喝一杯牛奶就走，白天上课眼皮打架。你觉得自己还年轻——身体这种资本，耗不尽的。",
    minAge: createAge(10), maxAge: createAge(16), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "继续肝，游戏才是信仰", effects: { attributes: { physique: -10, creativity: 2, intelligence: -1 } }, resultText: "我把整个暑假埋在游戏里。开学体检的时候近视加深了两百度，体重掉到了历史最低。班主任在家长会上说了一句'这孩子最近不行了'——我回来看到妈妈红着的眼眶，忽然觉得游戏里的所有成就都变成了一个笑话。" },
      { text: "设个闹钟，每天只玩两小时", effects: { attributes: { physique: 2, intelligence: 2, luck: 1 } }, resultText: "我用手机设了闹钟——到点就拔掉网线。头几天浑身难受，手指不自觉地想摸键盘。但慢慢习惯了——开始出去打篮球、去图书馆看书。后来游戏里那帮队友散了，但现实里的身体还在。有些东西是游戏给不了的——比如能跑能跳的自己。" },
    ],
  },
```

- [ ] **Step 6: 追加职业里程碑事件（3 个）**

```typescript
  // ══ 职业里程碑事件 ══
  {
    type: "parametric", id: "p_career_fired", title: "沉默一瞬",
    description: "你被开除了。HR 说完那些客套话后推过来一份离职协议。你走出写字楼，手里抱着一个不大的纸箱——里面是工位上的全部家当。太阳很刺眼，你眯起眼睛，忽然不知道接下来该往哪个方向走。",
    minAge: createAge(20), maxAge: createAge(26), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "总结教训，七天之内找到新工作", effects: { attributes: { intelligence: 3, wealth: 2 }, careerLevelDelta: 1 }, resultText: "我在出租屋里复盘了一整个晚上——把那些搞砸的事一条一条写下来。第二天开始疯狂投简历，第四天面了三家公司，第七天收到了offer。新工位比原来的大一倍。人生有些门是被踹开的——因为你自己在踹。" },
      { text: "回家躺了一个月", effects: { attributes: { physique: 2, creativity: 3 }, careerLevelDelta: -1 }, resultText: "我给自己放了个假。躺在沙发上刷完了所有积压的剧，然后翻出大学时的作品集翻了翻——忽然想起自己其实喜欢画东西。那一个月看似在躺平，但种子已经埋下了。找工作的时候我投了一家设计公司——被录了。原来迷路也是路的一部分。" },
    ],
  },
  {
    type: "parametric", id: "p_career_project", title: "驰明永生",
    description: "公司交给你一个足以定义你职业生涯的项目。你握着项目计划书——文件编号是你的工号后三位——手心发热。团队里一半人觉得你有病，另一半觉得你疯了。但你不做点什么的话，十年前的自己大概会失望。",
    minAge: createAge(32), maxAge: createAge(45), weight: 2, maxTriggers: 1, cooldownYears: 999,
    statRequirements: { intelligence: 5, wealth: 3 },
    choices: [
      { text: "亲自带队，所有细节过手", effects: { attributes: { wealth: 10, intelligence: 3, physique: -3 }, careerLevelDelta: 2 }, resultText: "我睡在办公室两周，把方案翻了三版，跟合作方吵了两架，最后在交付前一天凌晨三点把终版文件发给了客户。第二天客户回了一句：'这个我们要了。'我瘫在椅子里看着天花板笑了——不是那种轻轻的微笑，是发自胸腔的大笑。这次，干成了。" },
      { text: "委托团队推进，把控方向", effects: { attributes: { wealth: 4, intelligence: 1, luck: 1 }, careerLevelDelta: 1 }, resultText: "我把项目分解成十个模块，交给了最信得过的四个人。每周例会听汇报、拍板方向、不越级不插手。项目平稳交付那天，我给团队发了一个大红包——也给了自己一个。有些成功不需要你亲力亲为，盯准方向就够了。" },
    ],
  },
  {
    type: "parametric", id: "p_career_poach", title: "迟明永升",
    description: "猎头发来消息——竞对公司开出了你现在薪资的双倍，职位升一级，但需要搬到另一个城市。你的直属上司昨天刚跟你说过：'你是接班人，我不会亏待你。'你的手悬在手机上方迟疑了整整一个下午。",
    minAge: createAge(40), maxAge: createAge(55), weight: 2, maxTriggers: 1, cooldownYears: 999,
    statRequirements: { intelligence: 5, wealth: 4 },
    choices: [
      { text: "跳槽，重新开始", effects: { attributes: { wealth: 15, intelligence: 2, physique: -2 }, careerLevelDelta: 2 }, resultText: "我在新办公室安顿好的那天，窗外是一片陌生的天际线。工资翻了一倍，职级升了一级——但同事们看我的眼神是审视的。我知道在这里我需要重新证明一切。压力很大，但人也轻了——因为这一次每一步都是我自己选的。" },
      { text: "留下，续签忠诚", effects: { attributes: { wealth: 5, luck: 3, creativity: 2 }, careerLevelDelta: 1 }, resultText: "我去跟老板谈了涨薪——不是猎头给的那个数，但加上了一份信任和一份期权。签完新合同的那天老板请我喝了杯酒：'我没看错人。'有些选择不是关于钱——是关于想要什么样的路陪你走到最后。" },
    ],
  },
```

- [ ] **Step 7: 验证编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 8: Commit**

```bash
git add src/data/life/events-parametric.ts
git commit -m "feat: 新增 25 个成就支撑事件 — 关系8+财富6+运势4+爱情2+体质2+职业3"
```

---

### Task 4: CMYS 标题验证 + 最终编译检查

- [ ] **Step 1: pypinyin CMYS 验证**

```bash
python -c "
from pypinyin import pinyin, Style
def check(title):
    initials = [p[0][0].lower()[0] for p in pinyin(title, style=Style.INITIALS, strict=False) if p[0]]
    return ''.join(initials) == 'cmys', ''.join(initials)

titles = [
    '赤没影深','沉默雨散','赤没夜深','沉没应逝','赤明永生','沉默欲碎',
    '沉暮永生','赤没永逝','沉没银山','赤明银生','沉没银碎','仓满银实',
    '残明银逝','赤明银升','春明运升','残明运碎','沉默运逝','迟明运生',
    '春梦雨散','迟梦永生','赤没影生','沉明夜深','沉默一瞬','驰明永生','迟明永升',
]
fail = False
for t in titles:
    ok, initials = check(t)
    if not ok:
        print(f'FAIL: {t} → {initials}')
        fail = True
if not fail:
    print('All 25 titles CMYS compliant')
"
```

- [ ] **Step 2: 检查标题去重**

```bash
grep -o '"title": "[^"]*"' src/data/life/events-parametric.ts | sort | uniq -d
# 预期无输出（无重复标题）
```

- [ ] **Step 3: 最终编译检查**

```bash
npx tsc --noEmit
# 预期零错误
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "verify: CMYS 标题合规 + 去重检查全通过"
```

---

## 验证清单

- [ ] 关系事件：`relationshipEffect` 正确写入，reducer 处理好感变化
- [ ] 财富事件：wealth ±25~35 可供大起大落/白手起家成就触发
- [ ] 运势事件：luck ±20~40 可供逆天改命成就触发
- [ ] 爱情事件：ladykiller 成就扩展至 5 个事件
- [ ] 体质事件：physique -8/-10 可供少年白头成就触发
- [ ] 职业事件：careerLevelDelta 推进职业等级
- [ ] 不死鸟：nearDeathCount 正确追踪，phoenix 成就可触发
- [ ] 全部 25 个标题 CMYS 合规且不重复
- [ ] npx tsc --noEmit 零错误
