# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

```bash
npm run dev          # 开发服务器 → http://localhost:3000
npm run build        # 生产构建
npx tsc --noEmit     # TypeScript 类型检查（零错误要求）
npm run deploy       # 构建 + 部署到 Cloudflare
```

游戏入口路由：`/life`。主页路由：`/`。

## 技术栈

React 19 + TypeScript 5.8 + Vite 6 + TailwindCSS 4 + Motion (Framer Motion) + React Router 7。引擎层全部为纯函数，不依赖 React。状态管理用 `useReducer` + Context。

## 项目架构

```
src/
  engine/             # 纯函数引擎，不依赖 React
    types.ts          # 所有类型：GameState, GameAction, GameEvent 等
    reducer.ts        # gameReducer 状态机 + advanceYears 循环推进
    events.ts         # shouldTriggerEvent / selectEvent / getEligibleEvents
    death.ts          # checkDeath / applyNaturalDecay
    talent.ts         # 天赋选择逻辑
    career.ts         # 职业路径
    relationship.ts   # 关系系统
    ending.ts         # computeResult 结局评星
    autosave.ts       # localStorage 存档（检查点：6/18/31/61）
  components/         # React 组件
    LifeGame.tsx      # 主容器，useReducer + phase switch 路由
    LifeTalentPicker.tsx    # 天赋选择（3轮×3选1）
    LifeInfancyStage.tsx    # 婴幼期 0-5（自动叙事）
    LifeYouthStage.tsx      # 少年/青年期 6-30
    LifeMidlifeStage.tsx    # 壮年期 31-60
    LifeElderStage.tsx      # 晚年期 61-100
    LifeDeathScreen.tsx     # 结局结算（黑底白字电影式浮现）
    LifeEventCard.tsx       # 事件选择卡片
    LifeEventResult.tsx     # 选择后叙事结果 + 属性变化
    LifeStatsBars.tsx       # 六维属性柱碑图（variant: monoliths/typographic/meridian）
    LifeIntro.tsx           # 片头动画（网格脉冲 + 逐字浮现）
  data/life/
    events-anchors.ts       # 锚点事件（固定年龄触发）
    events-parametric.ts    # 参数化事件（属性/天赋条件触发）
    talents.ts              # 天赋池
    endings.ts              # 结局风味文本
  pages/
    LifePage.tsx            # 路由入口，挂载 LifeGame
    HomePage.tsx            # 主页
```

## 游戏状态机

```
save_choice → talent_selection(×3轮) → playing → dying → result
```

`playing` 阶段子状态：`aging` → (有事件时) `event_presenting` → (选择后) `effect_resolving` → `aging`...

`age <= 5` 走 LifeInfancyStage，`6-30` 走 LifeYouthStage，`31-60` 走 LifeMidlifeStage，`61+` 走 LifeElderStage。

## CMYS 命名规范（核心约束）

**所有事件标题必须是 C-M-Y-S 四字拼音首字母。** C/Ch 开头→C，M 开头→M，Y 开头→Y，S/Sh 开头→S。示例：`沉默一生`(Chen Mo Yi Sheng)、`出马应试`(Chu Ma Ying Shi)、`纯美月色`(Chun Mei Yue Se)。

修改任何事件标题后，用以下脚本验证：
```python
from pypinyin import pinyin, Style
def check(title):
    initials = [p[0][0].lower()[0] for p in pinyin(title, style=Style.INITIALS, strict=False) if p[0]]
    return ''.join(initials) == 'cmys'
```

禁止：标题与天赋重名、标题与任何 reserved 列表中的标题重复、非四字、非 CMYS 首字母。当前全部 90 个事件标题已合规。

## 事件系统关键规则

- 婴幼期 0-5：`shouldTriggerEvent` 返回 false，走 LifeInfancyStage 自动叙事（4段锚点，每段2.5秒）
- 少年/青年期 6-30：每年触发事件
- 壮年期 31-60：`(age-31)%3===0`，每3年触发，按钮推进 `delta:3`
- 晚年期 61-100：梯度间隔 — 61-70每3年、71-85每5年、86-100每7年
- `ADVANCE_AGE` 支持 `delta` 参数，reducer 循环逐年处理：衰减→死亡判定→仅在最后一年检查事件
- `RESOLVE_EVENT` 后进入 `effect_resolving` 阶段，显示叙事结果，`DISMISS_RESULT` 自动推进1年
- 每个 EventChoice 应有 `resultText` 字段（2-3句文学叙事），缺失时 fallback 为 `你选择了"XXX"。`

## 死亡机制

- 颜值/智力/体质/家境 任一 ≤0 → 死亡
- 才脉/运势 ≤0 → 惩罚但不致死（封印天赋/负面翻倍）
- age ≤5 禁止死亡判定
- 体质自然衰减：30岁起每5年-1，仅在各"整5年"节点（35/40/45/.../100）触发，总共最多-14。实现：`(age-30)%5===0 && age>30` 时返回 `{physique:-1}`
- age=100 时自然老死

## 技术细节

- 属性值用 branded type `AttributeValue` 保证 [0,100] 范围，`attr()` 函数自动 clamp
- `triggeredEventIds` 用 `Set<string>`，序列化时转为数组
- 存档检查点：6/18/31/61 岁。`LifeGame.useEffect` 监听 `state.age` 变化触发 `saveGame`
- 全局 `scroll-snap-type: y mandatory` 在 LifeGame 挂载时强制禁用（overflow:hidden → requestAnimationFrame 恢复），防止跳页
- 结局阶段：黑底 z-20 overlay 从 85%→100% 渐变，LifeDeathScreen 全白字 + 交错浮现动画
- 片头：LifeIntro 全黑 + 网格脉冲 + "沉默一生"逐字浮现，三段式手动交叉淡入淡出避免白闪
- 设计令牌：`--color-canvas:#F0F0F0`、`--color-primary:#1A1A1A`、`--color-secondary:#888`。字体：Inter/JetBrains Mono/DM Serif Display/Noto Serif SC
