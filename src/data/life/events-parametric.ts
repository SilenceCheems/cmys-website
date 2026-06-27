// src/data/life/events-parametric.ts
import type { ParametricEvent } from "../../engine/types";
import { createAge } from "../../engine/types";

export const PARAMETRIC_EVENTS: ParametricEvent[] = [
  // ── 婴幼期过渡事件 4-7 ──
  {
    type: "parametric", id: "p_kid_firefly", title: "草没萤闪",
    description: "夏夜的院子里，萤火虫提着灯笼飞舞，忽明忽暗。你拿着玻璃瓶追逐那些流动的光点，笑声在夜色中清脆地回荡。",
    minAge: createAge(4), maxAge: createAge(7), weight: 1, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "捉几只装进瓶子", effects: { attributes: { creativity: 1 } } , resultText: "我举着玻璃瓶满院子追逐，萤火虫在瓶底一闪一闪，像装了一瓶星光。我把瓶子举到眼前，那些小生命的光照亮了我的瞳孔——真美啊，我舍不得合上盖子。"},
      { text: "静静看它们飞舞", effects: { attributes: { luck: 2 } } , resultText: "我搬来小板凳坐在院子中央，托着腮看萤火虫在夜幕上画出一道道流线。有一只停在膝盖上，一闪一闪，像是在跟我打招呼。那个夏夜，安静得让人想永远留在里面。"},
    ],
  },

  // ── 少年期 6-17 ──
  {
    type: "parametric", id: "p_kid_study", title: "窗梦月时",
    description: "你在课堂上写出了一首诗，语文老师惊讶地看着你。",
    minAge: createAge(8), maxAge: createAge(14),
    statRequirements: { creativity: 5 }, weight: 2, maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "继续写作", effects: { attributes: { creativity: 3 } } , resultText: "我趁热打铁又写了两首，把本子递给老师看。老师的批注比我的诗还长，句句都戳在心上。从那天起我开始相信——也许我真的能写点什么。"},
      { text: "觉得没什么大不了", effects: { attributes: {} } , resultText: "我把本子塞进抽屉，没再多想。不过是一时灵感罢了，谁还没有过呢。但语文老师的目光里分明有些遗憾——她大概觉得我辜负了什么。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_sport", title: "驰鸣羽势",
    description: "学校运动会。你站在百米起跑线上，风在耳边呼啸。",
    minAge: createAge(10), maxAge: createAge(16),
    statRequirements: { physique: 3 }, weight: 2, maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "全力冲刺", effects: { attributes: { physique: 3, appearance: 1 } } , resultText: "发令枪响的瞬间我冲了出去，耳边全是风声和呐喊。我第一个冲过终点线，弯着腰大口喘气，汗水滴在跑道上砸出小小的湿痕。阳光下，有人为我鼓掌。"},
      { text: "享受比赛", effects: { attributes: { physique: 1, luck: 1 } } , resultText: "我按照自己的节奏跑，不去管别人领先了多少。风拂过脸颊时我觉得很舒坦——名次不重要，重要的是我在跑。冲线时意外地发现，我竟然跑进了前三。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_friend", title: "藏猫引蛇",
    description: "你和朋友在巷子里捉迷藏，不小心踩翻了一个蜂窝。",
    minAge: createAge(8), maxAge: createAge(12), weight: 1, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "带朋友逃跑", effects: { attributes: { physique: 2, luck: -1 } } , resultText: "我一把拽起朋友就跑，身后嗡嗡声越来越近。我们跑得上气不接下气，翻过一个矮墙时膝盖磕破了皮。回头看时蜂窝还在远处——安全了，但我俩都挂了彩。"},
      { text: "用衣服驱赶蜜蜂", effects: { attributes: { physique: -1, intelligence: 1 } } , resultText: "我脱下外套朝蜂群挥舞，想让它们飞走。结果被蜇了两下，手臂肿起红包，疼得直吸冷气。但这次之后我倒是记住了——马蜂和蜜蜂是不一样的，这个知识来得有点疼。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_art", title: "船梦远驶",
    description: "学校举办了汉字大赛。你站在台上，目光低垂，心中自有丘壑。",
    minAge: createAge(10), maxAge: createAge(14),
    statRequirements: { intelligence: 5 }, weight: 2, maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "稳定发挥", effects: { attributes: { intelligence: 2, appearance: 1 } } , resultText: "我深吸一口气，一笔一划写得工工整整。那些练过无数遍的字从笔尖流出，稳稳地落在纸上。公布结果时我的名字赫然在列——稳扎稳打，从不会让人失望。"},
      { text: "冒险用生僻字", effects: { attributes: { intelligence: 3, luck: -1 } } , resultText: "我赌了一把，写了一个刚学会的生僻字。笔划繁复，写到一半差点忘了怎么写，额头渗出冷汗。最后勉强写完，但那一笔明显有些犹豫。评委皱了皱眉——勇气可嘉，但赌注的代价也不小。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_climb", title: "策马越山",
    description: "村口的老槐树上，最高处的枝丫仿佛能碰到云。小伙伴们都不敢爬，只有你仰着头，跃跃欲试。",
    minAge: createAge(7), maxAge: createAge(11),
    statRequirements: { physique: 3 }, weight: 2, maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "勇敢地爬上去", effects: { attributes: { physique: 3, creativity: 1 } } , resultText: "我手脚并用，粗糙的树皮硌得手心生疼。爬到高处时整个村子都在脚下，风吹过来，我忽然觉得自己像一只鸟。坐在树杈上往下看，小伙伴们的脸上写满了羡慕。"},
      { text: "在树下帮大家望风", effects: { attributes: { intelligence: 1, luck: 1 } } , resultText: "我站在树下负责望风，盯着远处大人的身影。偶尔喊一句「有人来了」，树上的伙伴们便屏息凝神。虽然没爬上最高处，但这份默契让我觉得——我也是团队里重要的一环。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_ants", title: "虫脉蚁生",
    description: "你蹲在墙角，看蚂蚁们排着长队搬运食物。它们井然有序，像一支训练有素的军队。你用一根小树枝轻轻拦住它们的去路，想看看它们会怎么办。",
    minAge: createAge(7), maxAge: createAge(10), weight: 1, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "仔细观察它们如何绕路", effects: { attributes: { intelligence: 2 } } , resultText: "我蹲得腿都麻了，看着蚂蚁队伍在我的树枝前停顿、试探，然后从侧面绕出一条新路。它们井然有序的样子像一支训练有素的军队。我忽然觉得，这些小东西的身体里藏着一个我看不见的世界。"},
      { text: "找来更多树枝搭一座桥", effects: { attributes: { creativity: 2 } } , resultText: "我四处搜集树枝和叶片，搭了一座歪歪扭扭的小桥架在蚂蚁队伍上方。第一只蚂蚁试探着爬上桥，接着第二只、第三只——成功了！我激动得差点跳起来。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_kite", title: "彩梦云上",
    description: "春风正好的下午，你拉着自制的风筝在田野上奔跑。风筝摇摇晃晃地升起来，越飞越高，线在手中绷得紧紧的，仿佛牵着一片云。",
    minAge: createAge(7), maxAge: createAge(12), weight: 2, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "放长线让风筝飞得更高", effects: { attributes: { creativity: 2, luck: 1 } } , resultText: "我一点一点放出手中的线，风筝摇摇晃晃地往云里钻去。线在手中绷得紧紧的，像是牵着一头看不见的猛兽。风筝越飞越高，最后变成一个小黑点——我的心也跟着飞上了天。"},
      { text: "紧紧抓住线怕它飞走", effects: { attributes: { intelligence: 1, physique: 1 } } , resultText: "我攥紧线轴不敢松手，生怕风筝挣脱飞去。风筝在天上挣扎着要往上蹿，我的胳膊被拉得生疼。最终它没能飞得太高——但至少，它还在我手里。我松了一口气。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_rain", title: "初沐雨时",
    description: "夏天的暴雨来得突然。你没有带伞，索性脱了鞋子，在积水的巷子里奔跑跳跃。雨点打在脸上凉丝丝的，脚丫踩起的水花在路灯下闪闪发光。",
    minAge: createAge(8), maxAge: createAge(13), weight: 2, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "尽情享受雨中的自由", effects: { attributes: { physique: 2, creativity: 1 } } , resultText: "我踢掉凉鞋赤脚踏进积水里，雨水顺着发梢往下淌。我用力踩出一个大水花，又踩出一个——巷子里全是我的笑声。雨打在脸上凉丝丝的，我的心里却是热的。"},
      { text: "还是找个屋檐躲雨", effects: { attributes: { intelligence: 1, luck: 1 } } , resultText: "我抱着书包躲进路边的屋檐下，看着雨幕发愣。有人也跑进来躲雨，是个和我差不多大的孩子——我们聊了起来。等雨停的时候，我多了一个朋友。这场雨，也不算白下。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_snow", title: "窗梦云生",
    description: "老师在讲台上讲着方程式，你的目光却飘向了窗外。雪花正纷纷扬扬地落下，把操场染成一片洁白。你想象着在雪地里奔跑、打雪仗的样子，嘴角微微上扬。",
    minAge: createAge(8), maxAge: createAge(13), weight: 2, maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "收回心思认真听课", effects: { attributes: { intelligence: 2 } } , resultText: "我使劲掐了一下大腿，把目光从窗外拽回黑板。老师讲的内容我听得七七八八，下课后借同桌的笔记补上了走神时漏掉的部分。窗外下它的雪，我学我的习，两不相欠。"},
      { text: "在课本角落里画下雪景", effects: { attributes: { creativity: 2, intelligence: -1 } } , resultText: "我用铅笔在课本空白处画了一个雪人、一棵光秃秃的树和漫天飞舞的雪花。画到一半老师叫我回答问题——我支支吾吾答不上来，课本上的雪人暴露了秘密。老师没收了我的铅笔。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_sorrow", title: "愁眠夜色",
    description: "你第一次因为某件事整夜翻来覆去睡不着。说不清是生气、委屈还是难过，只知道胸口堵得慌。你把脸埋进枕头里，觉得长大好像是一件很累的事情。",
    minAge: createAge(10), maxAge: createAge(15),
    statRequirements: { creativity: 3 }, weight: 2, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "写在日记里倾诉", effects: { attributes: { creativity: 2, intelligence: 1 } } , resultText: "我翻开带锁的日记本，把压在胸口的话一句一句写下来。笔尖游走间，那些委屈和愤怒好像被抽离了身体，转移到了纸上。写完最后一个字，我长长地呼出一口气——心里轻了一些。"},
      { text: "出去跑几圈发泄", effects: { attributes: { physique: 2, luck: -1 } } , resultText: "我冲出家门沿着巷子疯跑，跑得肺像要烧起来一样。跑到村口的老槐树下我停下来，弯着腰大口喘气，眼泪不知道什么时候已经流了一脸。夜风吹干泪痕，有些东西永远留在了风里。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_persist", title: "持墨砚石",
    description: "一道怎么也解不开的数学题摆在面前。草稿纸用了一张又一张，笔尖都快把纸戳破了。身边的同学都放弃了，只有你还咬着笔杆不肯认输。",
    minAge: createAge(10), maxAge: createAge(15),
    statRequirements: { intelligence: 3 }, weight: 2, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "死磕到底直到解出来", effects: { attributes: { intelligence: 3, physique: -1 } } , resultText: "我盯着那道题看了整整一个下午，草稿纸揉了一团又一团。写到第八张纸的时候，答案忽然自己跳了出来——那么简单，我居然绕了这么远的路。我瘫在椅背上头晕眼花，但心里比吃了蜜还甜。"},
      { text: "去请教老师或同学", effects: { attributes: { intelligence: 1, appearance: 1 } } , resultText: "我拿着题去找班长，她三言两语就点通了关键。我恍然大悟的同时也有点脸红——这么简单我竟然卡了这么久。不过下次遇到类似的题，我大概不会再错了。学会了就是自己的。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_night", title: "初明夜时",
    description: "夜深了，家人都睡了。你偷偷打开台灯，翻开那本被禁止的小说。每一页都像是在冒险，你一边竖着耳朵听门外的动静，一边沉浸在另一个世界里。",
    minAge: createAge(12), maxAge: createAge(16), weight: 3, maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "熬夜一口气读完", effects: { attributes: { creativity: 3, physique: -2 } } , resultText: "我缩在被窝里，借着台灯的光一页一页翻下去。情节越来越精彩，我的眼皮却越来越沉。凌晨两点终于翻完最后一页，我合上书，脑袋里全是故事里的画面。第二天早课我差点在桌上睡着。"},
      { text: "克制住，明天再看", effects: { attributes: { intelligence: 2 } } , resultText: "我狠狠心合上书，把它塞到枕头底下。躺在床上翻来覆去，满脑子都是主角接下来会怎样。我强迫自己数羊，数到五百只才迷迷糊糊睡去。第二天一早，我做的第一件事就是翻开书——章节的末尾，等着我的是更大的悬念。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_green", title: "春萌影涩",
    description: "你发现镜子里的那张脸有些陌生。身体在悄悄变化，心里冒出一些从未有过的情绪——莫名其妙地烦躁，又莫名其妙地欢喜。你好像正在变成另一个人。",
    minAge: createAge(12), maxAge: createAge(16),
    statRequirements: { appearance: 2 }, weight: 2, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "坦然接受成长的变化", effects: { attributes: { appearance: 2, luck: 1 } } , resultText: "我对着镜子仔细端详自己——好像确实有些不一样了。下巴尖了一些，肩膀宽了一些。我学着大人的样子挺了挺胸，虽然有点别扭，但也不全是坏事。变成另一个人，也许没那么可怕。"},
      { text: "有些不安，躲进自己的世界", effects: { attributes: { creativity: 2, appearance: -1 } } , resultText: "我把帽檐压得低低的，不想让人注意到我的变化。一个人躲在房间里画画、看书，和那些不会变化的纸张待在一起才安心。外面的世界变得太快了——我只想在自己的壳里多待一会儿。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_rebel", title: "持明夜手",
    description: "老师在全班面前严厉批评了你。你攥紧拳头，一股从未有过的愤怒涌上心头。你想反驳，想摔门而去，想告诉所有人——你不是他们想象中的那个样子。",
    minAge: createAge(14), maxAge: createAge(17), weight: 3, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "站起来据理力争", effects: { attributes: { appearance: 3, intelligence: -1 } } , resultText: "我腾地站起来，声音比预想中大得多。教室里安静了一瞬，所有人都在看我。我把想说的话一口气说完，心脏砰砰跳得像要蹦出胸腔。老师愣住了，我也愣住了——有些话说出来就收不回去了。"},
      { text: "忍下来，用成绩证明自己", effects: { attributes: { intelligence: 3, luck: -1 } } , resultText: "我死死咬着嘴唇，把涌到喉咙的话咽了回去。指甲掐进掌心留下几道月牙印。回到座位上我翻开课本，一个字也看不进去——但我知道，愤怒解决不了问题，分数才是最好的反击。"},
    ],
  },

  // ── 青年期 18-30 ──
  {
    type: "parametric", id: "p_young_work", title: "出马应声",
    description: "你找到了第一份兼职工作。社会的第一课，比学校残酷。",
    minAge: createAge(19), maxAge: createAge(24),
    statRequirements: { intelligence: 3 }, weight: 3, maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "踏实工作积累经验", effects: { attributes: { wealth: 2, intelligence: 1 } } , resultText: "我每天第一个到公司，给前辈们倒好咖啡。那些复印、整理、跑腿的活儿，我做得很认真。三个月后，主管开始让我碰真正的业务——原来所有的弯路，都是为了让你看清正路的样子。"},
      { text: "投机取巧走捷径", effects: { attributes: { wealth: 3, luck: -2 } } , resultText: "我发现了一些'聪明'的做法——比如虚报工时、把别人的功劳往自己身上揽。工资条上的数字确实好看了，但同事们看我的眼神变了。深夜躺在床上，我问自己：这就是我想要的成功吗？"},
    ],
  },
  {
    type: "parametric", id: "p_young_travel", title: "船没云水",
    description: "你独自背包旅行。火车穿过陌生的田野，你感到前所未有的自由。",
    minAge: createAge(19), maxAge: createAge(26), weight: 2, maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "深度体验当地文化", effects: { attributes: { creativity: 3, intelligence: 1 } } , resultText: "我在小巷里迷了路，却误入一家当地人常去的老茶馆。老板用方言和我说了很多，我大半没听懂，只是笑着点头。离开时他拍了拍我的肩——那一刻我忽然明白，旅行的意义不是看到什么，而是感受到什么。"},
      { text: "拍照打卡发朋友圈", effects: { attributes: { appearance: 2 } } , resultText: "我举着手机在每一个网红景点前摆出精心设计的pose。朋友圈的点赞数在飙升，但我坐在民宿的床上翻看照片时，却记不起那些景点背后的故事。镜头里的笑容很完美，心里却有个声音在问：你究竟是来旅行，还是来收集点赞的？"},
    ],
  },
  {
    type: "parametric", id: "p_young_network", title: "诚盟远溯",
    description: "一个重要的社交场合。你遇到了可以改变你职业轨迹的人。",
    minAge: createAge(22), maxAge: createAge(28),
    statRequirements: { appearance: 5 }, weight: 2, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "真诚介绍自己", effects: { attributes: { wealth: 3, luck: 2 } } , resultText: "我没有用那些华丽的修饰词，只是诚实地说了自己的经历和想法。那个行业前辈听完后沉默了几秒，然后说：'年轻人，你很特别。'他递给我一张名片——那是我职业生涯的第一个转折点。原来真诚，才是最高级的社交技巧。"},
      { text: "夸夸其谈", effects: { attributes: { wealth: 1, appearance: -1 } } , resultText: "我把简历上的经历放大了一倍，添油加醋地描述自己的'辉煌战绩'。对方笑着点头，但我看到他眼神里的敷衍。散场后，我连他的联系方式都没要到。牛皮吹得越大，摔得越惨——年轻的虚荣，给我上了现实的第一课。"},
    ],
  },
  {
    type: "parametric", id: "p_young_create", title: "沉眠欲深",
    description: "凌晨三点，你被一个绝妙的创意惊醒。你打开电脑，开始疯狂敲字。",
    minAge: createAge(20), maxAge: createAge(28),
    statRequirements: { creativity: 7 }, weight: 3, maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "通宵完成它", effects: { attributes: { creativity: 5, physique: -2 } } , resultText: "我灌下第三杯咖啡，手指在键盘上飞舞。窗外的天空从漆黑变成深蓝，又从深蓝变成鱼肚白。当我敲完最后一个字保存时，整个人瘫在椅子里，手都在抖。但看着屏幕上完整的方案，我觉得值了——那是我人生中第一个真正属于自己的作品。"},
      { text: "记录下来明天再说", effects: { attributes: { creativity: 2 } } , resultText: "我打开备忘录快速记下了那个灵感的骨架，然后强迫自己关掉电脑。躺在床上，脑子里还在疯狂运转，所有细节争先恐后地涌现。第二天醒来，笔记上的几行字显得那么单薄——有些灵感就像夜里的梦，天亮就散了。"},
    ],
  },
  {
    type: "parametric", id: "p_young_health", title: "常明夜室",
    description: "你连续熬夜后病倒了。高烧中，你梦见月亮被阴影吞没。",
    minAge: createAge(20), maxAge: createAge(28),
    statRequirements: { physique: 3 }, weight: 2, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "好好休养", effects: { attributes: { physique: 3 } } , resultText: "我请了病假，把自己裹在被子里。母亲打来电话，听到我的声音沙哑，急得差点要买票过来。我笑着说没事，挂掉电话后鼻子一酸。原来在生病的时候，人才会承认自己不是铁打的。"},
      { text: "硬撑着继续工作", effects: { attributes: { physique: -3, intelligence: 1 } } , resultText: "我吞了两片退烧药，把电脑搬到床上继续改方案。额头发烫，视线模糊，但deadline不会等人。凌晨终于交稿时，我瘫倒在床上，感觉自己像一台过度运转后冒烟的机器——年轻的身体，原来也是有额度的。"},
    ],
  },
  {
    type: "parametric", id: "p_young_money", title: "错买饮食",
    description: "你心血来潮做了一笔投资，但标的不太对劲。",
    minAge: createAge(22), maxAge: createAge(30), weight: 1, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "及时止损", effects: { attributes: { wealth: -1, intelligence: 1 } } , resultText: "我看着账户里缩水的数字，心痛得不行。但还是在跌停前咬牙卖掉了——后来那只股票果然一路狂跌。朋友说我运气好，只有我知道，那不是什么运气，是学会了跟自己的贪欲和解。吃一堑，长一智。"},
      { text: "加倍投入博反弹", effects: { attributes: { wealth: -3, luck: -2 }, isLethal: false } , resultText: "我不信命，又投了一笔进去。盯着K线图的眼睛熬得通红，心脏随着数字的跳动忽上忽下。最后爆仓的那天，我蹲在出租屋的阳台上抽了一整包烟。赌徒心态，是年轻人最容易犯的错——而我用真金白银交了学费。"},
    ],
  },
  {
    type: "parametric", id: "p_young_snow_plum", title: "春陌云生",
    description: "寒冬腊月，你独自踏雪而行。天地苍茫间，一树红梅傲然绽放，像极了你不肯熄灭的理想。你伸手触碰花瓣，指尖的冰凉让你愈发清醒——原来美好，从来都需要穿越风雪才能遇见。",
    minAge: createAge(20), maxAge: createAge(26), weight: 2, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "折一枝带回出租屋", effects: { attributes: { creativity: 3, luck: 1 } } , resultText: "我把那枝红梅插在矿泉水瓶里，放在窗台上。简陋的出租屋因为这抹颜色，忽然有了生气。每天清晨醒来看到它，就觉得这座城市也不是那么冰冷——至少还有一朵花，是为你而开的。"},
      { text: "拍张照片继续赶路", effects: { attributes: { intelligence: 1, physique: 1 } } , resultText: "我掏出手机拍了张照片，然后把手缩回口袋，缩着脖子继续赶路。后来那张照片一直躺在相册里，每次翻到，都会想起那个冬天的早上——有一树梅花在风雪里开得那么好，而我匆匆路过了它。"},
    ],
  },
  {
    type: "parametric", id: "p_young_dim_lights", title: "城暮夜疏",
    description: "深夜的城市万家灯火，却没有一盏为你而亮。你站在天桥上，看车流如河，忽然意识到自己不过是这座城市里的一粒尘埃——但尘埃也有尘埃的骄傲，至少你还在路上。",
    minAge: createAge(22), maxAge: createAge(28), weight: 2, maxTriggers: 2, cooldownYears: 8,
    choices: [
      { text: "给自己买一碗热汤", effects: { attributes: { physique: 2, luck: 1 } } , resultText: "我走进街角那家还亮着灯的馄饨店。热汤下肚的瞬间，冻僵的手指和脚趾开始恢复知觉。老板多给我加了两颗馄饨，说'年轻人别太省'。我低头喝汤，热气模糊了眼镜——也模糊了眼眶。"},
      { text: "匿名给陌生人点一份外卖", effects: { attributes: { appearance: 1, luck: 2 } } , resultText: "我打开外卖软件，选了一家深夜还营业的店，匿名给备注里写着'加班到凌晨'的陌生人点了一份热粥。做完这件事，心里好像没那么空了——原来在陌生的城市里温暖另一个人，也是在温暖自己。"},
    ],
  },
  {
    type: "parametric", id: "p_young_drunken", title: "沉梦远逝",
    description: "你喝醉了，躺在出租屋的地板上。耳边回响着李白那句'仰天大笑出门去，我辈岂是蓬蒿人'——可你连明天的早会都还没准备。理想和现实之间，隔着一地空酒瓶。",
    minAge: createAge(20), maxAge: createAge(26),
    statRequirements: { creativity: 4 }, weight: 2, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "借着酒劲写一首诗", effects: { attributes: { creativity: 4, physique: -1 } } , resultText: "我拿起笔，字迹歪歪扭扭，但句子像洪水一样倾泻而出。写了什么已经记不太清了，只记得那些字里行间全是不甘——不甘平庸，不甘认命，不甘就这样在出租屋里老去。第二天醒来看到满纸潦草的诗句，笑了。酒后吐的真言，其实一直都在心底。"},
      { text: "洗把脸，明天还要上班", effects: { attributes: { intelligence: 2, wealth: 1 } } , resultText: "我用冷水冲了把脸，看着镜子里狼狈的自己。那个意气风发的少年什么时候变成了这样？我深吸一口气，定好闹钟，关灯躺下。成年人的崩溃是无声的，也是有时限的——明天早会还要汇报，容不得你矫情太久。"},
    ],
  },
  {
    type: "parametric", id: "p_young_night_rain", title: "愁漫雨声",
    description: "职场如江湖。你被同事暗算背了黑锅，一个人在雨夜加班到凌晨。那些表面笑脸，不过是一场无声的厮杀。你盯着电脑屏幕，屏幕上的字渐渐模糊成一片——原来长大，就是学会咽下委屈。",
    minAge: createAge(22), maxAge: createAge(30),
    statRequirements: { intelligence: 3 }, weight: 3, maxTriggers: 2, cooldownYears: 8,
    choices: [
      { text: "收集证据，保护自己", effects: { attributes: { intelligence: 3, luck: 2 } } , resultText: "我开始不动声色地保留邮件截图、聊天记录，整理每一个时间线。两个月后，当领导追责时，我拿出了完整的证据链。会议室里鸦雀无声——我没有报复任何人，只是学会了在这个江湖里保护好自己。"},
      { text: "忍一时风平浪静", effects: { attributes: { luck: 1, physique: 1 } } , resultText: "我咽下了这口气，默默把黑锅背了。后来那个陷害我的同事又故技重施，终于被公司开除了。我庆幸自己没冲动，但也明白了一个道理——善良如果没有牙齿，就是软弱。忍一时风平浪静，退一步未必海阔天空。"},
    ],
  },
  {
    type: "parametric", id: "p_young_reforge", title: "残铓永生",
    description: "你失败了。你赌上一切的事，以惨败告终。你坐在河边，把石头狠狠扔进水里，溅起的水花打湿了你的脸。剑已断，可你还不想认输——因为你知道，真正的剑客不是从不倒下，而是每次倒下都能站起来。",
    minAge: createAge(22), maxAge: createAge(30), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "从零开始，再来一次", effects: { attributes: { creativity: 4, luck: 2, physique: -2 } } , resultText: "我擦干眼泪，把所有的积蓄重新摊在桌上。这一次我什么都没有了，但也什么都不怕了。失败像一盆冷水，浇醒了我所有的幻想。我开始认真复盘每一个错误——真正的强者不是从不失败，而是把失败踩成台阶。"},
      { text: "换一条路走", effects: { attributes: { intelligence: 3, luck: 1 } } , resultText: "我承认了——这条路走不通。不是认输，是换一条赛道。那些打不倒你的，确实会让你变得更强大——但前提是，你得懂得转弯。我收起残剑，走向了另一片江湖。谁规定一条路必须走到底呢？"},
    ],
  },
  {
    type: "parametric", id: "p_young_barefoot", title: "赤迈洋沙",
    description: "为了省下房租，你住在没有暖气的隔断间。清晨赤脚踩在冰冷的地板上，寒意从脚底窜到头顶。你咬了咬牙——今年冬天一定要撑过去。春天会来的，只要你不放弃。",
    minAge: createAge(19), maxAge: createAge(25), weight: 1, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "咬牙坚持", effects: { attributes: { physique: 3, wealth: 1 } } , resultText: "我买了一条最厚的棉被，晚上裹着它看书。早上闹钟一响，赤脚踩在冰冷的地板上，那股寒意从脚底窜到头顶，人也彻底清醒了。我在日历上画了一个圈——'春天来的那天，我要去吃一顿火锅'。这个念头支撑我熬过了整个冬天。"},
      { text: "向家里求助", effects: { attributes: { wealth: 2, luck: -1 } } , resultText: "我拨通了家里的电话，听到母亲声音的那一刻，眼泪不争气地掉了下来。我说'妈，最近手头有点紧'，她二话不说就转了钱。挂掉电话后我看着那条转账记录发了很久的呆——二十多岁了还在让父母操心，愧疚比寒冷更让人难受。"},
    ],
  },
  {
    type: "parametric", id: "p_young_star_chase", title: "采梦云上",
    description: "你报名了一个看似遥不可及的比赛。报名表上的截止日期刺眼地提醒着你——离截止只有三天。周围人都说你疯了，可你偏要试试。万一呢？万一那颗星星，真的能被你摘到呢？",
    minAge: createAge(20), maxAge: createAge(27),
    statRequirements: { creativity: 5 }, weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "通宵三天也要完成", effects: { attributes: { creativity: 5, physique: -3 } } , resultText: "我把窗帘拉上，切断了和外界的所有联系。困了就趴十分钟，醒了继续。第三天凌晨，当我点击'提交'按钮的那一刻，整个人虚脱般倒在键盘上。显示器散发着微弱的光，像一颗终于被摘到的星星，虽然微小，却是我自己的光。"},
      { text: "理性评估，量力而行", effects: { attributes: { intelligence: 2, creativity: 1 } } , resultText: "我拿出纸笔，认真分析了参赛需要的时间和能力，最后决定——暂时放弃。不是懦弱，是把这次冲动转化为下一年的积累。我在计划本上写下：'等我准备好了，一定会来。'少年人的热血不一定要在当下挥洒，沉淀后的力量才更持久。"},
    ],
  },
  {
    type: "parametric", id: "p_young_upstream", title: "船没远驶",
    description: "同期入职的朋友已经开始躺平，而你还在咬牙进修。深夜的图书馆里，只有你的台灯还亮着。你揉了揉酸涩的眼睛，翻开下一页。不进则退，你不想退——因为你知道，所有看似无用的努力，都在悄悄塑造未来的你。",
    minAge: createAge(20), maxAge: createAge(28), weight: 3, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "坚持学下去", effects: { attributes: { intelligence: 4, physique: -2 } } , resultText: "眼皮在打架，咖啡已经喝到第三杯。身边的座位一个个空了，只有头顶那盏灯还亮着。我揉了揉发酸的眼睛，在笔记本上又写了一页。走出图书馆时已经是深夜，路灯把我的影子拉得很长——但我在这条路上，每一步都算数。"},
      { text: "休息一天，别太累", effects: { attributes: { physique: 2, intelligence: 1 } } , resultText: "我合上书本，去操场走了几圈。晚风很凉，吹散了脑中的混沌。回来后又翻了几页书，效率反而比硬撑着高了许多。原来有时候，停下来是为了走得更远——这个道理我用了很久才真正明白。"},
    ],
  },
  {
    type: "parametric", id: "p_young_drifting", title: "草茂叶生",
    description: "你又搬家了。这已经是毕业后的第五个住处。打包行李时你忽然想不起来——'家'到底在哪里。你看着房间里渐渐空掉的墙壁，有些恍惚。浮萍虽无根，却也能在漂泊中开出花来。",
    minAge: createAge(20), maxAge: createAge(27), weight: 2, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "给老家的父母打个电话", effects: { attributes: { luck: 2, creativity: 2 } } , resultText: "电话响了两声就接通了，仿佛母亲一直在等。我没说搬家的事，只是问她最近身体怎么样。她絮絮叨叨说了很多——院子里的柿子树今年结了很多果，隔壁家的狗又生了。我听着听着就笑了，原来无论搬到哪里，电话那头的声音就是家的坐标。"},
      { text: "在新家种一盆植物", effects: { attributes: { physique: 1, luck: 1 } } , resultText: "我在楼下的花店买了一盆绿萝，放在新房间的窗台上。给它浇水的时候，忽然觉得这个陌生的房间有了一点烟火气。植物不会说话，但它倔强地绿着，好像在替我给这座城市——我打算在这里待下去了。"},
    ],
  },
  {
    type: "parametric", id: "p_young_butterfly", title: "出明羽身",
    description: "你终于走出了舒适区。那个曾经在人群中不敢说话的自己，现在站在讲台上侃侃而谈。台下的掌声响起时，你忽然有点想哭——原来破茧的痛，是为了飞翔的这一刻。所有的怯懦，都化作了翅膀上的鳞粉。",
    minAge: createAge(22), maxAge: createAge(30),
    statRequirements: { appearance: 3 }, weight: 3, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "接受更大的挑战", effects: { attributes: { appearance: 4, luck: 2, physique: -2 } } , resultText: "我接下了一个难度远超我能力范围的项目。准备方案的那几周，我每天只睡四五个小时，PPT改了十几版。汇报那天，我从头到尾讲完后，台下响起了掌声。那一刻我忽然明白——成长不是准备好了才出发，而是出发了才能准备好。"},
      { text: "享受这个时刻", effects: { attributes: { appearance: 2, luck: 2 } } , resultText: "我站在镜子前，看着那个坦然微笑的自己。从前的我从不敢直视自己的眼睛。我给妈妈打了个电话，说'妈，我今天在台上讲话没有发抖'。她在电话那头笑了很久。我知道这只是开始，但至少——我终于迈出了那一步。"},
    ],
  },
  {
    type: "parametric", id: "p_young_moon_toast", title: "愁满夜深",
    description: "又是一个人的生日。你给自己买了瓶酒，对着窗外的月亮碰杯。孤独吗？也许吧。但也自由。你忽然理解了李白为什么总是一个人喝酒——有些路，注定要一个人走；有些月光，只属于独自仰望的人。",
    minAge: createAge(22), maxAge: createAge(29), weight: 1, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "写下给自己的信", effects: { attributes: { creativity: 3, luck: 1 } } , resultText: "我打开手机备忘录，写下：'亲爱的自己，今天你25岁了。你一个人在这座城市，一事无成，但又拥有一切可能。'写完后我读了一遍，又读了一遍，眼泪不知道什么时候流了下来。月光洒在屏幕上，那些字亮晶晶的，像星星。"},
      { text: "找个朋友视频聊天", effects: { attributes: { appearance: 2, luck: 1 } } , resultText: "我拨通了老友的视频，屏幕那头的他也刚下班，脸上的疲惫和我一模一样。我们隔着屏幕干了一杯——他喝啤酒，我喝二锅头。聊到凌晨两点，从理想到现实，从过去到未来。挂掉电话时，孤独还在，但没那么重了。"},
    ],
  },
  {
    type: "parametric", id: "p_young_forest", title: "策马云山",
    description: "你接到了一个需要去陌生城市的offer。前途未卜，但心里有团火在烧。你想起小时候看过的武侠片——少年提剑入江湖，凭的就是一腔孤勇。你不知道前方是什么，但你知道，不去会后悔一辈子。",
    minAge: createAge(19), maxAge: createAge(26),
    statRequirements: { physique: 3, creativity: 3 }, weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "义无反顾地出发", effects: { attributes: { creativity: 4, luck: 3, wealth: -2 } } , resultText: "我递了辞呈，拖着行李箱去了那座陌生的城市。出站的那一刻，潮湿的海风扑面而来，我深吸了一口气——这味道里有未知，有自由，也有一丝恐惧。我给朋友发了条消息：'我到了。'然后关掉手机，走进了那片属于我的森林。"},
      { text: "做好万全准备再走", effects: { attributes: { intelligence: 2, wealth: 2 } } , resultText: "我没有急着走，而是先在网上了解了那座城市的情况，存够了半年的房租，甚至提前联系了几个可能的住处。当终于坐上火车时，我比想象中平静。年少时的冲动很美，但深思熟虑后的出发，才是成年人该有的勇敢。"},
    ],
  },

  // ── 壮年期 31-60 ──
  {
    type: "parametric", id: "p_mid_career", title: "撑明永世",
    description: "你的事业到了关键转折点。一个重大项目摆在面前，成则飞升，败则重来。整个团队都在看着你——你已经不是那个可以输得起的少年了。",
    minAge: createAge(31), maxAge: createAge(50), weight: 3, maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "全力以赴，背水一战", effects: { attributes: { wealth: 5, intelligence: 2, physique: -2 } } , resultText: "你带着核心团队连续奋战了三个月，办公室的灯几乎没熄过。项目上线那天凌晨，你站在落地窗前看着城市的轮廓在晨光中浮现——你赢了。你摸了摸鬓角，又多了几根白发，但这都不重要了。"},
      { text: "委托团队稳健推进", effects: { attributes: { wealth: 2, luck: 1 } } , resultText: "你把任务拆分得清清楚楚，交给最信任的几个骨干。每周的例会上你听取汇报、把控方向，不越级也不插手。项目平稳交付那天，你准时下班回家，陪家人吃了一顿久违的晚饭。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_family", title: "春梦永世",
    description: "你站在婚礼的殿堂上，看着TA的眼睛。这一生的承诺，从此刻开始。",
    minAge: createAge(25), maxAge: createAge(35), weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "深情宣誓", effects: { attributes: { luck: 3, creativity: 2 } } , resultText: "你站在聚光灯下，握着TA的手，那些准备好的誓词忽然全部忘了。沉默了几秒，你只说了句：'以后的路，我们一起走。'台下有人笑了，也有人偷偷抹眼泪。那一夜，你第一次觉得'归宿'这个词有了形状。"},
      { text: "务实规划未来", effects: { attributes: { wealth: 2, intelligence: 2 } } , resultText: "你和TA在厨房餐桌上摊开账本，一笔一笔地算——房贷、育儿基金、养老储备。没有海誓山盟，只有密密麻麻的数字。但你知道，这比任何情话都实在：真正的承诺，写在柴米油盐里。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_crisis", title: "愁眠雨声",
    description: "中年危机如约而至。你坐在深夜的阳台上，雨声敲打着内心的不安。",
    minAge: createAge(38), maxAge: createAge(50), weight: 2, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "重新审视人生方向", effects: { attributes: { creativity: 3, intelligence: 2 } } , resultText: "你报了一个心理咨询课程，每周去见一次治疗师。第一次说出'我不快乐'的时候，你哭了。治疗师递来纸巾，你擦了擦脸，觉得心里那块压了多年的石头终于松动了一点。"},
      { text: "买一辆跑车", effects: { attributes: { wealth: -2, appearance: 1 } } , resultText: "你提了那辆关注了三年的跑车。发动引擎的轰鸣声让你笑了出来，像一个叛逆的少年。回家后你看到女儿惊讶的眼神，忽然有点不好意思——但你不打算解释，这是你为自己做的一个梦。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_health", title: "草木有衰",
    description: "体检报告上出现了几个红字。你盯着它们，第一次认真思考'健康'的意义。",
    minAge: createAge(40), maxAge: createAge(55), weight: 2, maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "开始规律运动", effects: { attributes: { physique: 5 } } , resultText: "你办了健身卡，每天早晨六点准时出现在健身房。最开始那两周浑身酸痛，上楼梯都龇牙咧嘴。一个月后你发现精神好了很多，连脾气都变好了——原来身体不会骗你，你对它好，它就对你好。"},
      { text: "无所谓，继续喝酒", effects: { attributes: { physique: -5, luck: -2 } } , resultText: "你照常参加每一个酒局，红光满面地谈笑风生。深夜回家你把体检报告塞进抽屉最深处，不去看那些加粗的指标。反正人都有一死——你这样安慰自己，但半夜醒来时，心慌得怎么也睡不着。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_invest", title: "沉没一瞬",
    description: "一个朋友拉你合伙创业。你看着商业计划书，热血沸腾。",
    minAge: createAge(32), maxAge: createAge(45),
    statRequirements: { wealth: 5 }, weight: 2, maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "全力投入创业", effects: { attributes: { wealth: 6, intelligence: 2, physique: -3 } } , resultText: "你辞了职，全身心扑在那个项目上。每天只睡五个小时，凌晨还在和团队讨论方案。你瘦了，但眼睛亮了。妻子说你看起来像回到了二十岁——你知道她没说出口的是，她也担心你会像年轻时那样狠狠摔一跤。"},
      { text: "谨慎注资，不参与管理", effects: { attributes: { wealth: 2, luck: 1 } } , resultText: "你投了一笔钱，签了协议，不干涉日常运营。每个季度看看报表，偶尔去办公室转转。朋友说你太谨慎，你摇摇头——这个年纪，稳比快重要。你知道自己几斤几两。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_greyhair", title: "愁明银色",
    description: "清晨洗漱时，你对着镜子愣住了——鬓角多了一根白发。你小心翼翼地拔掉它，却发现旁边还有两根。时光从不说谎，它把所有痕迹都刻在你的身上。",
    minAge: createAge(35), maxAge: createAge(45), weight: 2, maxTriggers: 2, cooldownYears: 8,
    choices: [
      { text: "坦然接受变老的事实", effects: { attributes: { creativity: 2, luck: 1 } } , resultText: "你把白发留在那里，任它们占领你的鬓角和头顶。同事们夸你'有味道了'，你苦笑着想——不接受又能怎样？但你发现，当你不再和这件事较劲的时候，反而觉得自在了许多。"},
      { text: "染发，跟时间较劲", effects: { attributes: { appearance: 2, physique: -1 } } , resultText: "你每两个月去一次理发店，坐在镜前看着染发膏一点点遮住白色。走出来的时候确实年轻了几岁，可你也知道，下次白发还会长出来，就像潮水一定会再次涌起。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_nightwork", title: "迟暮夜深",
    description: "凌晨一点，你终于走出写字楼。月光洒在空荡荡的街道上，你的影子被拉得很长。出租车里，电台放着老歌，你靠着车窗，眼皮越来越重。手机屏幕还亮着——家人发来的消息没来得及回。",
    minAge: createAge(32), maxAge: createAge(48), weight: 3, maxTriggers: 3, cooldownYears: 10,
    choices: [
      { text: "再拼几年就好了", effects: { attributes: { wealth: 3, physique: -2, intelligence: 1 } } , resultText: "你把回不了的消息设成自动回复，把错过晚饭的愧疚藏在心里。凌晨的出租车上，你默默算了一笔账——再熬两年就能还清房贷。你闭上眼睛，让疲惫随着车身的晃动沉入夜色。"},
      { text: "命要紧，换份轻松的工作", effects: { attributes: { wealth: -1, physique: 3, luck: 1 } } , resultText: "你递交了辞呈，主管惊讶地看了你三秒：'想清楚了？'你点点头。走出写字楼的那一刻，阳光有些刺眼，你深呼吸了一口——空气里有种久违的自由的味道。虽然薪水少了一半，但你又能看到日出了。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_toast", title: "愁迷影碎",
    description: "酒桌上觥筹交错。你举起酒杯，透过琥珀色的液体看着对面那张笑脸——是真心还是假意？中年人的社交，每一杯酒都有它的价钱，推杯换盏间全是算计。",
    minAge: createAge(35), maxAge: createAge(50),
    statRequirements: { wealth: 3 }, weight: 2, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "一饮而尽，谈成生意", effects: { attributes: { wealth: 3, physique: -2, appearance: 1 } } , resultText: "你仰头把酒灌下去，火辣辣地划过喉咙。对面的人笑了，向你伸出了手。你握住那只手，知道这笔生意成了。但你也知道，今晚又要胃痛了——你摸了摸口袋里的胃药，心想，这就是代价。"},
      { text: "以茶代酒，守住底线", effects: { attributes: { physique: 2, luck: 1 } } , resultText: "你端起茶杯，在觥筹交错间显得格格不入。有人打趣你'老了'，你笑笑不说话。酒局散场时你是唯一清醒的人，送同事回家的路上，你靠着车窗，心里出奇地平静。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_storm", title: "沉没雨时",
    description: "家里出了大事。你拖着疲惫的身躯回到家，TA什么也没说，只是默默给你倒了一杯热水，然后坐在你身边。那一刻你明白，所谓夫妻，就是同一条船上的人，风浪再大也不松手。",
    minAge: createAge(33), maxAge: createAge(50), weight: 2, maxTriggers: 2, cooldownYears: 8,
    choices: [
      { text: "紧紧握住TA的手", effects: { attributes: { luck: 3, creativity: 2 } } , resultText: "你握住TA的手，指节发白。千言万语堵在喉咙里，最后只挤出一句：'有我呢。'TA的眼泪滴在你手背上，滚烫。那晚你们在沙发上坐了很久，谁也没有松开谁——有些风雨，握紧了手就能走过去。"},
      { text: "一个人扛，不让TA担心", effects: { attributes: { physique: -2, intelligence: 2, wealth: 1 } } , resultText: "你笑着说'没事'，转身走进书房，轻轻关上了门。你坐在黑暗里，盯着手机上的数字发呆。你不想让TA看到你崩溃的样子——不是不信任，而是你觉得，有些重量注定只能一个人扛。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_alone", title: "垂目影深",
    description: "周末下午，你一个人坐在江边垂钓。水面平静如镜，倒映着你不再年轻的脸。手机响了——是工作群的消息。你没有点开，继续盯着水面发呆。人到中年，热闹是别人的，孤独是自己的。",
    minAge: createAge(40), maxAge: createAge(55), weight: 2, maxTriggers: 2, cooldownYears: 8,
    choices: [
      { text: "享受这份独处的宁静", effects: { attributes: { creativity: 3, luck: 2 } } , resultText: "你把手机调成静音，扣在石头上。浮漂在水面轻轻晃动，你的思绪也跟着漂到了很远的地方。这些年你一直在扮演各种角色——员工、父母、子女——只有这一刻，你只是你自己。"},
      { text: "收起鱼竿，回到人群中去", effects: { attributes: { appearance: 2, wealth: 1 } } , resultText: "你收起鱼竿，回到家中。妻子问你钓到没有，你说'没有'，她也不失望。你坐在沙发上看电视，女儿发来视频，小外孙在镜头里叫你'爷爷'。你笑了——或许你并不是真的想独处，只是累了。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_help", title: "持梅应手",
    description: "老友遇到困难，深夜打来电话，声音哽咽。你听着电话那头的倾诉，想起当年他也曾帮过你。人到了这个年纪，朋友就像冬天的炭火——越来越少，但每一个都珍贵得舍不得用。",
    minAge: createAge(35), maxAge: createAge(55),
    statRequirements: { wealth: 3 }, weight: 2, maxTriggers: 2, cooldownYears: 8,
    choices: [
      { text: "倾囊相助，情义无价", effects: { attributes: { wealth: -3, luck: 4, appearance: 2 } } , resultText: "你把银行卡递过去的时候，老友的泪水夺眶而出。你拍了拍他的肩膀，什么也没说。回家的路上妻子看了你一眼，欲言又止，最终只说了句：'做得对。'你知道那笔钱可能回不来了，但你更知道，有些东西比钱珍贵得多。"},
      { text: "量力而行，点到为止", effects: { attributes: { wealth: 1, intelligence: 1 } } , resultText: "你借出一笔在他偿还能力范围内的数目，又帮忙联系了几个熟人。老友千恩万谢，你说'都是小事'。回到办公室你记了一笔账——不只是钱的账，也是人情的账。中年人的友谊，经不起透支。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_fame", title: "尘没云散",
    description: "你升职了，但内心毫无波澜。坐在更大的办公室里，你看着墙上那些奖状和锦旗，突然觉得很空。这些曾经让你热血沸腾的东西，如今不过是墙上的灰尘。你拿起一块奖牌擦了擦，又放下了。",
    minAge: createAge(45), maxAge: createAge(58),
    statRequirements: { wealth: 5 }, weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "看淡名利，追求内心", effects: { attributes: { creativity: 4, luck: 2, wealth: -1 } } , resultText: "你把那些奖杯从柜子上拿下来，一件件擦拭干净，收进了纸箱。儿子不解地问：'爸，这不是你的荣誉吗？'你摸了摸他的头：'荣誉在心里，不在柜子上。'那天下午，你翻开了一本想了很久却一直没空看的书。"},
      { text: "位置越高责任越大", effects: { attributes: { wealth: 3, intelligence: 2, physique: -2 } } , resultText: "你坐在新办公室里，窗外的视野更开阔了，但你看到的不是风景，是更多的责任。会议一个接一个，决策文件堆满了桌角。你揉了揉太阳穴，想起刚入职时的自己——那个只想'混口饭吃'的年轻人，如今扛着一千多人的生计。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_undercurrent", title: "沉脉隐生",
    description: "公司里的人心开始浮动。两个派系都在拉拢你，同事在茶水间的窃窃私语多了起来。你知道，站队的时候到了。选错了，前半生的积累可能付诸东流；不选，两边都不会把你当自己人。",
    minAge: createAge(35), maxAge: createAge(50),
    statRequirements: { intelligence: 5 }, weight: 2, maxTriggers: 2, cooldownYears: 8,
    choices: [
      { text: "明哲保身，谁也不站", effects: { attributes: { intelligence: 2, luck: -1 } } , resultText: "你在办公室里挂了一幅字——'静观其变'。两边的人都来拉拢你，你始终是同一副笑容：'做好自己的事就好。'你知道这样做两面都不讨好，但在职场活了二十年的老狐狸都明白——不站队，才能站到最后。"},
      { text: "选择有前途的一方", effects: { attributes: { wealth: 3, appearance: 1, luck: -2 } } , resultText: "你斟酌了整整一周，分析了每个派系的势力和走向。最终你选定了那一方，在下班后的'偶遇'中递出了橄榄枝。这是一场赌博——中年人的职场就像棋盘，不动棋子的人，最先被吃掉。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_radical", title: "抽脉隐伤",
    description: "你手里握着辞职信，在总经理办公室门口站了很久。这份做了十五年的工作，像一个温暖的牢笼——让你饿不死也撑不着。是继续安稳还是破釜沉舟？你听见自己的心跳声。",
    minAge: createAge(38), maxAge: createAge(52),
    statRequirements: { wealth: 5, intelligence: 5 }, weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "辞职，自己创业", effects: { attributes: { wealth: 5, creativity: 3, physique: -3, luck: -2 } } , resultText: "你端着纸箱走出公司大门，保安小哥敬了个礼。你回头看了一眼那栋工作了十五年的楼，忽然觉得自己像一个刚出狱的人——自由，但也茫然。你深吸一口气，拨通了第一个客户的电话。"},
      { text: "忍了，稳定压倒一切", effects: { attributes: { wealth: 1, luck: 2, creativity: -2 } } , resultText: "你把辞职信撕碎，扔进垃圾桶。然后打开电脑，继续做那份做了十五年的PPT。下班时同事问你晚上有局吗，你摇了摇头。开车回家的路上收音机里放着老歌，你跟着哼了两句——其实也不算太差。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_mentor", title: "传脉永生",
    description: "一个年轻人叫你'师傅'。你看着他求知若渴的眼神，想起三十年前的自己——也是这么莽撞、这么热忱。你知道自己这辈子的经验和教训，总得有个地方传下去。",
    minAge: createAge(42), maxAge: createAge(58),
    statRequirements: { intelligence: 6, wealth: 3 }, weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "倾囊相授，毫无保留", effects: { attributes: { intelligence: 3, luck: 3, creativity: 2 } } , resultText: "你把自己几十年的经验整理成文档，从方法论到踩过的坑，事无巨细。那个年轻人每次听完都两眼放光，笔记记了厚厚一本。你看着他，像看着一棵正在长大的树——你知道他终将超越你，而你觉得那很好。"},
      { text: "教七分留三分", effects: { attributes: { intelligence: 1, wealth: 1 } } , resultText: "你教他业务，教他为人，但从不把自己压箱底的心法全部说出。这不是自私——你告诉自己——有些路必须自己走过才算数。你在一旁看着，偶尔点拨一句。既为师徒，便不能替他走路。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_ruin", title: "船没夜深",
    description: "最坏的消息来了。你看着财务报表上刺眼的赤字，或者那份解聘通知，又或者是合伙人带着核心客户消失了。世界在你面前崩塌，但你必须站着——身后还有一家老小指望你。",
    minAge: createAge(40), maxAge: createAge(55),
    statRequirements: { wealth: 4 }, weight: 2, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "咬牙坚持，从头再来", effects: { attributes: { physique: -2, luck: 3, creativity: 2, wealth: -2 } } , resultText: "你卖掉了车，退掉了办公室，坐在空荡荡的客厅里打了一圈电话。合伙人走了一半，但手里还有几个愿意相信你的人。你在白纸上重新写下了计划书——字迹有些抖，但每一笔都比从前更用力。"},
      { text: "及时止损，另找出路", effects: { attributes: { wealth: -1, intelligence: 2, luck: 1 } } , resultText: "你在最后一份文件上签了字，结束了这场噩梦。清算师同情地看着你，你反倒安慰他：'没事，人还在。'你走出大楼，天正下着小雨。你没有打伞，在雨里走了很久，想着接下来该怎么办。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_silence", title: "沉眠欲逝",
    description: "凌晨三点，你突然醒来，再也睡不着。身边人睡得很沉。你披着外套走到窗边，看着沉睡的城市。万籁俱寂中，你第一次听见自己内心的声音——它已经沉默了太多年。你问自己：这是我想要的生活吗？",
    minAge: createAge(38), maxAge: createAge(55), weight: 2, maxTriggers: 2, cooldownYears: 8,
    choices: [
      { text: "直面内心，承认不快乐", effects: { attributes: { creativity: 3, luck: -1 } } , resultText: "你在日记本上写下第一行字：'我不快乐。'笔尖戳破了纸。你继续写——深夜的焦躁、白天的面具、无声的争吵。写到手指发酸的时候抬头看窗外，天快亮了。你觉得自己像一块冰，正在慢慢融化。"},
      { text: "明天还要上班，继续睡", effects: { attributes: { physique: 2, intelligence: 1 } } , resultText: "你翻了个身，把被子裹紧。闹钟在四个小时后会准时响起，你需要那点睡眠去应付明天的会议。你闭上眼睛，把那些没用的念头赶走——想这些干什么？又不能当饭吃。你很快睡着了，呼吸均匀。"},
    ],
  },

  // ── 晚年期 61-100 ──
  {
    type: "parametric", id: "p_elder_retire", title: "垂暮夜色",
    description: "你退休了。数十年的职场生涯在一场简单的告别会上画上句号。",
    minAge: createAge(60), maxAge: createAge(65), weight: 3, maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "开启人生第二春", effects: { attributes: { creativity: 5, luck: 2 } } , resultText: "你脱下工装的那天，感到的不是失落，而是一种久违的轻盈。余生还长，你的第二程才刚刚开始。窗外的天空比任何时候都要蓝。"},
      { text: "享受悠闲时光", effects: { attributes: { physique: 3, wealth: -1 } } , resultText: "退休后的第一个早晨，你睡到自然醒。阳光透过窗帘洒在地板上，你端着一杯茶，什么也不想做。忙碌了大半辈子，终于可以理直气壮地浪费时间了。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_return", title: "辞母远逝",
    description: "你回到阔别多年的故乡。老屋还在，巷口那棵槐树却已被砍去。物是人非，感慨万千。",
    minAge: createAge(62), maxAge: createAge(72), weight: 2, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "重修老屋，落叶归根", effects: { attributes: { wealth: -1, luck: 3, creativity: 2 } } , resultText: "你找来工匠，一砖一瓦地修复老屋。每一道墙缝都藏着记忆，每一扇窗户都照见过往。你决定在这里住下来，不再漂泊。"},
      { text: "只是静静走一圈就走了", effects: { attributes: { creativity: 2 } } , resultText: "你沿着巷子慢慢地走，用手抚摸每一面斑驳的墙。一切都变了，又好像什么都没变。你转身离开，没有回头——故乡在心里，不必强求归期。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_garden", title: "策马远山",
    description: "你在院子里种了一片菜园。日出而作，日落而息。原来陶渊明说的'采菊东篱下'是这样的感觉。",
    minAge: createAge(65), maxAge: createAge(78), weight: 2, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "全身心投入田园生活", effects: { attributes: { physique: 3, creativity: 3 } } , resultText: "你扛起锄头翻土、播种、浇水，汗水滴在泥土里。看着幼苗破土而出，你心里涌起一种久违的踏实。这一亩三分地，就是你的天下。"},
      { text: "随便种种，打发时间", effects: { attributes: { physique: 1, luck: 1 } } , resultText: "你漫不经心地在院子里撒下几颗种子，没想到它们真的发了芽。你蹲在菜畦边，看着那抹嫩绿出了神。日子，原来可以这样慢。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_memory", title: "尘满云散",
    description: "你坐在窗前，翻看一本旧相册。那些面孔和场景从指间流过，像握不住的沙。你试图留住什么，却发现一切都已成往事。",
    minAge: createAge(65), maxAge: createAge(80),
    statRequirements: { creativity: 5 }, weight: 2, maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "写出真实的故事", effects: { attributes: { creativity: 5, luck: 2 } } , resultText: "你铺开稿纸，笔尖停了很久。然后你开始写——不修饰、不回避，把那些真实的欢乐与伤痛都写下来。写到动情处，你摘下老花镜擦了擦眼角。有些故事，只有真实的才动人。"},
      { text: "美化过去", effects: { attributes: { creativity: 2 } } , resultText: "你在回忆中挑挑拣拣，把那些灰暗的部分轻轻抹去。留下的画面温暖而柔和，像一张泛黄的老照片。你知道这不完全是真相，但这样让心里舒坦。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_reunion", title: "春梦玉碎",
    description: "老友聚会。当年的少年如今满头白发，推杯换盏间，那些遥远的名字又被提起。",
    minAge: createAge(68), maxAge: createAge(82), weight: 2, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "组织定期聚会", effects: { attributes: { appearance: 2, luck: 3 } } , resultText: "你建了个老友群，定下每月一聚的规矩。第一次聚会来了八个人，第二次又少了两个。但你不在乎——能来的，都是时间淘洗后的真朋友。酒不必多，说说话就好。"},
      { text: "珍惜每一次见面", effects: { attributes: { creativity: 3, luck: 1 } } , resultText: "你举起酒杯，和每一个老友碰杯。你知道这样的聚会越来越少，所以格外认真地看每个人的脸。席散后你站在门口目送大家离去，路灯把影子拉得很长。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_legacy", title: "草木一生",
    description: "你开始思考这一生留下了什么。后代？作品？还是只是一个故事？",
    minAge: createAge(70), maxAge: createAge(85), weight: 2, maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "把经验传授给年轻人", effects: { attributes: { intelligence: 3, luck: 3 } } , resultText: "你坐在年轻人中间，把自己一辈子的经验和教训摊开来讲。他们认真地记笔记，问问题。你忽然觉得——原来这一生没有白过，哪怕只点亮了一盏灯。"},
      { text: "写一份遗嘱清单", effects: { attributes: { wealth: 2 } } , resultText: "你戴上老花镜，一笔一划地写下这份清单。财产不多，但每一件物品背后都有一个故事。你希望收到它们的人，能明白这些物的重量。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_hospital", title: "沉眠欲逝",
    description: "你因病住进了医院。白色的天花板，点滴的节拍声。你第一次认真思考'终点'这个词。",
    minAge: createAge(72), maxAge: createAge(88),
    statRequirements: { physique: 5 }, weight: 2, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "积极配合治疗", effects: { attributes: { physique: 3, luck: 2 } } , resultText: "你每天按时吃药、做康复训练，咬着牙和病痛较劲。护士夸你心态好，你笑了笑——这辈子什么风浪没见过。能多活一天，都是赚的。"},
      { text: "把时间留给家人", effects: { attributes: { appearance: 2, luck: 2, physique: -1 } } , resultText: "你拒绝了部分治疗，选择回家。家人围在身边，你握着每个人的手，仔细端详他们的脸。窗外阳光正好。你忽然觉得，这样就已经很好了。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_wisdom", title: "沧溟遗石",
    description: "你在整理旧物时发现了一本泛黄的笔记本。上面记录的，是你年轻时的一个绝妙创意——它从未被实现。",
    minAge: createAge(75), maxAge: createAge(92),
    statRequirements: { creativity: 6 }, weight: 2, maxTriggers: 3, cooldownYears: 8,
    choices: [
      { text: "暮年也要把它做出来", effects: { attributes: { creativity: 6, intelligence: 2, physique: -2 } } , resultText: "你戴上老花镜，从满是灰尘的工作台上翻出当年的图纸。手指已不太灵便，但心还是热的。你花了大半年把它做了出来——虽然晚了五十年，但终究没有带着它进坟墓。"},
      { text: "传给下一代去实现", effects: { attributes: { luck: 3, intelligence: 2 } } , resultText: "你小心翼翼地把那本泛黄的笔记本交给孙辈。他们好奇地翻看着，眼睛里闪着光。你拍拍他们的肩说：'这是我的遗憾，但不是你们的。'"},
    ],
  },
  {
    type: "parametric", id: "p_elder_peace", title: "纯美月色",
    description: "某个夜晚，你独自坐在院子里。月光清澈如水，你感到前所未有的平静。",
    minAge: createAge(75), maxAge: createAge(90), weight: 2, maxTriggers: 2, cooldownYears: 10,
    choices: [
      { text: "享受这片刻宁静", effects: { attributes: { luck: 5, creativity: 2 } } , resultText: "你靠在藤椅上，月光洒在你的脸上。远处传来几声狗吠，更衬得夜色安静。你闭上眼睛，感觉自己像一片羽毛，漂浮在时间之外。"},
      { text: "叫家人一起赏月", effects: { attributes: { appearance: 2, luck: 3 } } , resultText: "你招呼家人搬了椅子出来。孩子们起初还在看手机，后来也渐渐被这月色打动。一家人就这样静静地坐着，看着同一轮明月。千年前的古人，大概也是这样的吧。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_reborn", title: "残木迎生",
    description: "你年过花甲，本以为人生已无新意。某个寻常的午后，一缕久违的冲动忽然涌上心头——你想学一件年轻时从未触碰的事。枯木逢春，或许为时未晚。",
    minAge: createAge(65), maxAge: createAge(80), weight: 2, maxTriggers: 1, cooldownYears: 999,
    statRequirements: { creativity: 4 },
    choices: [
      { text: "全心投入这迟来的热情", effects: { attributes: { creativity: 5, luck: 2 } } , resultText: "你报了老年大学，坐在第一排认真听讲。旁边的年轻人以为你是来旁听的老教授，你笑了笑没解释。手指有些生疏，但心里的火却越烧越旺。"},
      { text: "不过是一时冲动罢了", effects: { attributes: { creativity: 2 } } , resultText: "你放下那个念头，继续过着平静的日子。但偶尔午夜梦回，那缕冲动还是会悄悄冒出来——像一根刺，轻轻地扎你一下。你翻个身，继续睡去。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_unfinished", title: "残没欲收",
    description: "深夜无眠，你想起年轻时那个被搁置的梦想。它像一个未解的生死劫，在心头盘桓了大半生。如今棋子尚在，棋盘却已蒙尘。",
    minAge: createAge(70), maxAge: createAge(90), weight: 2, maxTriggers: 1, cooldownYears: 999,
    statRequirements: { creativity: 4 },
    choices: [
      { text: "去完成它，趁还来得及", effects: { attributes: { creativity: 4, intelligence: 2, physique: -2 } } , resultText: "你重新打开尘封已久的工具箱，双手虽然颤抖，但眼神异常坚定。那些未完成的线条和色彩，在你的手中渐渐活了过来。你赶在日落之前，终于画完了最后一笔。"},
      { text: "把它交给后人去实现", effects: { attributes: { luck: 3, intelligence: 1 } } , resultText: "你把这些年的构思和积累整理成册，郑重地交到年轻人手中。看着他们接下这份未竟的事业，你心里既有释然，也有一丝说不清的酸楚。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_ember", title: "残墨雨湿",
    description: "社区里缺人手，有人来请你帮忙。你本可以推托，但那些求助的眼睛让你想起当年的自己——也曾被人扶过一把。",
    minAge: createAge(70), maxAge: createAge(88), weight: 2, maxTriggers: 2, cooldownYears: 8,
    statRequirements: { physique: 3 },
    choices: [
      { text: "发挥余热，不计回报", effects: { attributes: { luck: 3, creativity: 3 } } , resultText: "你穿上志愿者的红马甲，在社区里忙前忙后。帮人修锁、教孩子写毛笔字、陪孤寡老人聊天。虽然累，但心里充实——原来被人需要，是这么温暖的事。"},
      { text: "婉拒，安心养老", effects: { attributes: { physique: 2, luck: 1 } } , resultText: "你婉言谢绝了对方的请求，心里却没有完全放下。夜晚你望着窗外的万家灯火，想那些需要帮助的人是否已经得到了回应。你轻轻叹了口气，合上眼不再想。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_together", title: "苍眉影深",
    description: "你和老伴一起在院子里晒太阳。TA的头发已经全白了，你的也是。你们没说几句话，但手一直握在一起。",
    minAge: createAge(68), maxAge: createAge(85), weight: 2, maxTriggers: 2, cooldownYears: 8,
    choices: [
      { text: "牵起TA的手，说一声'辛苦了'", effects: { attributes: { luck: 3, appearance: 2 } } , resultText: "你握住TA布满皱纹的手，千言万语化作一句'辛苦了'。TA的眼眶湿了，你也湿了。这一路走来不容易，好在——你们一直在一起。"},
      { text: "默默陪伴，不必多言", effects: { attributes: { luck: 2, creativity: 2 } } , resultText: "你什么都没说，只是把TA的手握得更紧了一些。阳光暖暖地照着，你们像两棵老树，根早已纠缠在一起，枝叶在风中沙沙作响。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_friendless", title: "沉默欲散",
    description: "你翻看手机通讯录，发现很多号码已经很久没打过了。你试着拨了一个——接电话的是对方的女儿。TA上个月走了。",
    minAge: createAge(75), maxAge: createAge(92), weight: 2, maxTriggers: 2, cooldownYears: 8,
    choices: [
      { text: "去送最后一程", effects: { attributes: { luck: 2, creativity: 3 } } , resultText: "你拄着拐杖参加了葬礼。看着墓碑上那张熟悉的笑脸，你没有哭。你只是站在那儿，在心里和他说了很久的话。老朋友，你先走一步，我们终会再见。"},
      { text: "在心底默默告别", effects: { attributes: { creativity: 2, physique: 1 } } , resultText: "你没有去葬礼，而是在那天独自去了你们常去的小公园。你坐在长椅上，看着落叶一片片飘下来。有些告别不需要仪式，心里的那声'再见'同样沉重。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_great", title: "沉默永逝",
    description: "你坐在院中老槐树下看落日。邻家的孩子跑来问你：'爷爷，人活着到底为了什么？'你沉默了很久，然后笑了。",
    minAge: createAge(78), maxAge: createAge(98), weight: 2, maxTriggers: 1, cooldownYears: 999,
    statRequirements: { intelligence: 6 },
    choices: [
      { text: "'好好活着就是答案'", effects: { attributes: { intelligence: 3, luck: 2 } } , resultText: "孩子歪着头想了想，似懂非懂地跑开了。你望着他的背影，想起自己也曾问过同样的问题。如今你终于有了答案——不是用语言，而是用这一生。"},
      { text: "讲一个故事来回答", effects: { attributes: { creativity: 4, intelligence: 1 } } },
    ],
  },
  {
    type: "parametric", id: "p_elder_curtain", title: "尘没已逝",
    description: "你感到身体越来越轻。床前围满了熟悉的面孔，有人在哭，有人在轻声唤你的名字。你想说别难过，但已经发不出声音了。舞台的灯光，终于要灭了。",
    minAge: createAge(85), maxAge: createAge(100), weight: 3, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "微笑着闭上眼睛", effects: { attributes: { luck: 3, creativity: 2 }, isLethal: true } },
      { text: "留下最后的嘱托", effects: { attributes: { intelligence: 2, appearance: 2 }, isLethal: true } },
    ],
  },
  {
    type: "parametric", id: "p_elder_end", title: "尘梦影逝",
    description: "你感到大限将至。这一生的画面如走马灯般闪过。有人说人在死前会看到一生的闪回。",
    minAge: createAge(85), maxAge: createAge(99), weight: 3, maxTriggers: 1, cooldownYears: 999,
    choices: [
      { text: "坦然面对", effects: { attributes: {}, isLethal: false } },
    ],
  },

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
    description: "村口有一口废多年的枯井，井口被木板盖着。你和小伙伴打赌谁能把井盖掀开。大家都看着你，等着你动手。",
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
];
