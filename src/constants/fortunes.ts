export interface Fortune {
  id: string;
  name: string;
  fortune: string;
  explanation: string;
  description: string;
}

export const FORTUNES: Fortune[] = [
  {
    id: "1",
    name: "沉默有诗",
    fortune: "中等吉，文运",
    explanation: "沉默中蕴含着诗意与灵感。",
    description: "近期宜静不宜动，独处或冥思将带来创作突破，适合写作、艺术或策划工作。",
  },
  {
    id: "2",
    name: "春苗雨苏",
    fortune: "大吉，生机",
    explanation: "春天的幼苗得到雨水滋润而苏醒。",
    description: "困境即将过去，新的机会如雨后春笋般出现，事业或学习将迎来明显起色。",
  },
  {
    id: "3",
    name: "藏猫引蛇",
    fortune: "小凶，慎防小人",
    explanation: "本意玩耍躲藏，却意外引出蛇来。",
    description: "无心之举可能招惹是非，注意身边口舌之人，重要事宜低调进行。",
  },
  {
    id: "4",
    name: "纯美意识",
    fortune: "上吉，心性",
    explanation: "纯粹美好的内心觉知。",
    description: "心态决定境遇，保持善意与专注，近期会在人际关系或精神层面获得意外收获。",
  },
  {
    id: "5",
    name: "辞母远涉",
    fortune: "中等凶，离别",
    explanation: "告别母亲，远行跋涉。",
    description: "或将面临分离、变动或长途旅行，虽有小波折，但长远来看是成长的必经之路。",
  },
  {
    id: "6",
    name: "长眠月食",
    fortune: "大凶，阴滞",
    explanation: "长久沉睡于月食之刻，象征晦暗不明。",
    description: "运势低迷，易感疲惫或陷入迷茫，不宜做重大决策，建议休养与观察。",
  },
  {
    id: "7",
    name: "催马加速",
    fortune: "小吉，官运/行动",
    explanation: "鞭策马匹加快速度。",
    description: "工作上需主动推进，上级或客户会催促，但正是表现良机，宜果断执行。",
  },
  {
    id: "8",
    name: "春眠夜宿",
    fortune: "中等吉，安稳",
    explanation: "春天安睡，夜中栖息。",
    description: "近期生活节奏放缓，适合休整与家庭团聚，财运平稳，健康运上升。",
  },
  {
    id: "9",
    name: "吃面饮水",
    fortune: "小吉，日常",
    explanation: "吃面条、喝清水，简朴生活。",
    description: "平淡是真，近期不宜追求奢华，脚踏实地反而能积累小福气，肠胃健康佳。",
  },
  {
    id: "10",
    name: "吹灭烟水",
    fortune: "凶中藏吉，虚像",
    explanation: "吹散烟雾与水汽，看似消散却易复来。",
    description: "当前困扰多为表象，不必过度焦虑，等待迷雾散去后再行动，可转危为安。",
  },
  {
    id: "11",
    name: "仓廪殷实",
    fortune: "大吉，财运",
    explanation: "粮仓充实，衣食无忧。",
    description: "正财旺盛，投资或储蓄有稳定回报，适合购置实物资产或储备物资。",
  },
  {
    id: "12",
    name: "揣猫一身",
    fortune: "小凶，招惹",
    explanation: "把猫揣在怀里，弄了一身（毛或抓痕）。",
    description: "好心可能带来小麻烦，帮助他人时需留意分寸，避免被反噬或抱怨。",
  },
];
