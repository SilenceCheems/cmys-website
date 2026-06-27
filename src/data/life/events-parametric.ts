// src/data/life/events-parametric.ts
import type { ParametricEvent } from "../../engine/types";
import { createAge } from "../../engine/types";

export const PARAMETRIC_EVENTS: ParametricEvent[] = [
  // ── 婴幼期过渡事件 4-7 ──
  {
    type: "parametric", id: "p_kid_firefly", title: "草没萤闪",
    description: "夏夜的院子里，萤火虫提着灯笼飞舞，忽明忽暗。你拿着玻璃瓶追逐那些流动的光点，笑声在夜色中清脆地回荡。",
    minAge: createAge(4), maxAge: createAge(7), weight: 1,
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
    statRequirements: { creativity: 5 }, weight: 2,
    choices: [
      { text: "继续写作", effects: { attributes: { creativity: 3 } } , resultText: "我趁热打铁又写了两首，把本子递给老师看。老师的批注比我的诗还长，句句都戳在心上。从那天起我开始相信——也许我真的能写点什么。"},
      { text: "觉得没什么大不了", effects: { attributes: {} } , resultText: "我把本子塞进抽屉，没再多想。不过是一时灵感罢了，谁还没有过呢。但语文老师的目光里分明有些遗憾——她大概觉得我辜负了什么。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_sport", title: "驰鸣羽势",
    description: "学校运动会。你站在百米起跑线上，风在耳边呼啸。",
    minAge: createAge(10), maxAge: createAge(16),
    statRequirements: { physique: 3 }, weight: 2,
    choices: [
      { text: "全力冲刺", effects: { attributes: { physique: 3, appearance: 1 } } , resultText: "发令枪响的瞬间我冲了出去，耳边全是风声和呐喊。我第一个冲过终点线，弯着腰大口喘气，汗水滴在跑道上砸出小小的湿痕。阳光下，有人为我鼓掌。"},
      { text: "享受比赛", effects: { attributes: { physique: 1, luck: 1 } } , resultText: "我按照自己的节奏跑，不去管别人领先了多少。风拂过脸颊时我觉得很舒坦——名次不重要，重要的是我在跑。冲线时意外地发现，我竟然跑进了前三。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_friend", title: "藏猫引蛇",
    description: "你和朋友在巷子里捉迷藏，不小心踩翻了一个蜂窝。",
    minAge: createAge(8), maxAge: createAge(12), weight: 1,
    choices: [
      { text: "带朋友逃跑", effects: { attributes: { physique: 2, luck: -1 } } , resultText: "我一把拽起朋友就跑，身后嗡嗡声越来越近。我们跑得上气不接下气，翻过一个矮墙时膝盖磕破了皮。回头看时蜂窝还在远处——安全了，但我俩都挂了彩。"},
      { text: "用衣服驱赶蜜蜂", effects: { attributes: { physique: -1, intelligence: 1 } } , resultText: "我脱下外套朝蜂群挥舞，想让它们飞走。结果被蜇了两下，手臂肿起红包，疼得直吸冷气。但这次之后我倒是记住了——马蜂和蜜蜂是不一样的，这个知识来得有点疼。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_art", title: "船梦远驶",
    description: "学校举办了汉字大赛。你站在台上，目光低垂，心中自有丘壑。",
    minAge: createAge(10), maxAge: createAge(14),
    statRequirements: { intelligence: 5 }, weight: 2,
    choices: [
      { text: "稳定发挥", effects: { attributes: { intelligence: 2, appearance: 1 } } , resultText: "我深吸一口气，一笔一划写得工工整整。那些练过无数遍的字从笔尖流出，稳稳地落在纸上。公布结果时我的名字赫然在列——稳扎稳打，从不会让人失望。"},
      { text: "冒险用生僻字", effects: { attributes: { intelligence: 3, luck: -1 } } , resultText: "我赌了一把，写了一个刚学会的生僻字。笔划繁复，写到一半差点忘了怎么写，额头渗出冷汗。最后勉强写完，但那一笔明显有些犹豫。评委皱了皱眉——勇气可嘉，但赌注的代价也不小。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_climb", title: "策马越山",
    description: "村口的老槐树上，最高处的枝丫仿佛能碰到云。小伙伴们都不敢爬，只有你仰着头，跃跃欲试。",
    minAge: createAge(7), maxAge: createAge(11),
    statRequirements: { physique: 3 }, weight: 2,
    choices: [
      { text: "勇敢地爬上去", effects: { attributes: { physique: 3, creativity: 1 } } , resultText: "我手脚并用，粗糙的树皮硌得手心生疼。爬到高处时整个村子都在脚下，风吹过来，我忽然觉得自己像一只鸟。坐在树杈上往下看，小伙伴们的脸上写满了羡慕。"},
      { text: "在树下帮大家望风", effects: { attributes: { intelligence: 1, luck: 1 } } , resultText: "我站在树下负责望风，盯着远处大人的身影。偶尔喊一句“有人来了”，树上的伙伴们便屏息凝神。虽然没爬上最高处，但这份默契让我觉得——我也是团队里重要的一环。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_ants", title: "虫脉蚁生",
    description: "你蹲在墙角，看蚂蚁们排着长队搬运食物。它们井然有序，像一支训练有素的军队。你用一根小树枝轻轻拦住它们的去路，想看看它们会怎么办。",
    minAge: createAge(7), maxAge: createAge(10), weight: 1,
    choices: [
      { text: "仔细观察它们如何绕路", effects: { attributes: { intelligence: 2 } } , resultText: "我蹲得腿都麻了，看着蚂蚁队伍在我的树枝前停顿、试探，然后从侧面绕出一条新路。它们井然有序的样子像一支训练有素的军队。我忽然觉得，这些小东西的身体里藏着一个我看不见的世界。"},
      { text: "找来更多树枝搭一座桥", effects: { attributes: { creativity: 2 } } , resultText: "我四处搜集树枝和叶片，搭了一座歪歪扭扭的小桥架在蚂蚁队伍上方。第一只蚂蚁试探着爬上桥，接着第二只、第三只——成功了！我激动得差点跳起来。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_kite", title: "彩梦云上",
    description: "春风正好的下午，你拉着自制的风筝在田野上奔跑。风筝摇摇晃晃地升起来，越飞越高，线在手中绷得紧紧的，仿佛牵着一片云。",
    minAge: createAge(7), maxAge: createAge(12), weight: 2,
    choices: [
      { text: "放长线让风筝飞得更高", effects: { attributes: { creativity: 2, luck: 1 } } , resultText: "我一点一点放出手中的线，风筝摇摇晃晃地往云里钻去。线在手中绷得紧紧的，像是牵着一头看不见的猛兽。风筝越飞越高，最后变成一个小黑点——我的心也跟着飞上了天。"},
      { text: "紧紧抓住线怕它飞走", effects: { attributes: { intelligence: 1, physique: 1 } } , resultText: "我攥紧线轴不敢松手，生怕风筝挣脱飞去。风筝在天上挣扎着要往上蹿，我的胳膊被拉得生疼。最终它没能飞得太高——但至少，它还在我手里。我松了一口气。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_rain", title: "初沐雨时",
    description: "夏天的暴雨来得突然。你没有带伞，索性脱了鞋子，在积水的巷子里奔跑跳跃。雨点打在脸上凉丝丝的，脚丫踩起的水花在路灯下闪闪发光。",
    minAge: createAge(8), maxAge: createAge(13), weight: 2,
    choices: [
      { text: "尽情享受雨中的自由", effects: { attributes: { physique: 2, creativity: 1 } } , resultText: "我踢掉凉鞋赤脚踏进积水里，雨水顺着发梢往下淌。我用力踩出一个大水花，又踩出一个——巷子里全是我的笑声。雨打在脸上凉丝丝的，我的心里却是热的。"},
      { text: "还是找个屋檐躲雨", effects: { attributes: { intelligence: 1, luck: 1 } } , resultText: "我抱着书包躲进路边的屋檐下，看着雨幕发愣。有人也跑进来躲雨，是个和我差不多大的孩子——我们聊了起来。等雨停的时候，我多了一个朋友。这场雨，也不算白下。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_snow", title: "窗梦云生",
    description: "老师在讲台上讲着方程式，你的目光却飘向了窗外。雪花正纷纷扬扬地落下，把操场染成一片洁白。你想象着在雪地里奔跑、打雪仗的样子，嘴角微微上扬。",
    minAge: createAge(8), maxAge: createAge(13), weight: 2,
    choices: [
      { text: "收回心思认真听课", effects: { attributes: { intelligence: 2 } } , resultText: "我使劲掐了一下大腿，把目光从窗外拽回黑板。老师讲的内容我听得七七八八，下课后借同桌的笔记补上了走神时漏掉的部分。窗外下它的雪，我学我的习，两不相欠。"},
      { text: "在课本角落里画下雪景", effects: { attributes: { creativity: 2, intelligence: -1 } } , resultText: "我用铅笔在课本空白处画了一个雪人、一棵光秃秃的树和漫天飞舞的雪花。画到一半老师叫我回答问题——我支支吾吾答不上来，课本上的雪人暴露了秘密。老师没收了我的铅笔。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_sorrow", title: "愁眠夜色",
    description: "你第一次因为某件事整夜翻来覆去睡不着。说不清是生气、委屈还是难过，只知道胸口堵得慌。你把脸埋进枕头里，觉得长大好像是一件很累的事情。",
    minAge: createAge(10), maxAge: createAge(15),
    statRequirements: { creativity: 3 }, weight: 2,
    choices: [
      { text: "写在日记里倾诉", effects: { attributes: { creativity: 2, intelligence: 1 } } , resultText: "我翻开带锁的日记本，把压在胸口的话一句一句写下来。笔尖游走间，那些委屈和愤怒好像被抽离了身体，转移到了纸上。写完最后一个字，我长长地呼出一口气——心里轻了一些。"},
      { text: "出去跑几圈发泄", effects: { attributes: { physique: 2, luck: -1 } } , resultText: "我冲出家门沿着巷子疯跑，跑得肺像要烧起来一样。跑到村口的老槐树下我停下来，弯着腰大口喘气，眼泪不知道什么时候已经流了一脸。夜风吹干泪痕，有些东西永远留在了风里。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_persist", title: "持墨砚石",
    description: "一道怎么也解不开的数学题摆在面前。草稿纸用了一张又一张，笔尖都快把纸戳破了。身边的同学都放弃了，只有你还咬着笔杆不肯认输。",
    minAge: createAge(10), maxAge: createAge(15),
    statRequirements: { intelligence: 3 }, weight: 2,
    choices: [
      { text: "死磕到底直到解出来", effects: { attributes: { intelligence: 3, physique: -1 } } , resultText: "我盯着那道题看了整整一个下午，草稿纸揉了一团又一团。写到第八张纸的时候，答案忽然自己跳了出来——那么简单，我居然绕了这么远的路。我瘫在椅背上头晕眼花，但心里比吃了蜜还甜。"},
      { text: "去请教老师或同学", effects: { attributes: { intelligence: 1, appearance: 1 } } , resultText: "我拿着题去找班长，她三言两语就点通了关键。我恍然大悟的同时也有点脸红——这么简单我竟然卡了这么久。不过下次遇到类似的题，我大概不会再错了。学会了就是自己的。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_night", title: "初明夜时",
    description: "夜深了，家人都睡了。你偷偷打开台灯，翻开那本被禁止的小说。每一页都像是在冒险，你一边竖着耳朵听门外的动静，一边沉浸在另一个世界里。",
    minAge: createAge(12), maxAge: createAge(16), weight: 3,
    choices: [
      { text: "熬夜一口气读完", effects: { attributes: { creativity: 3, physique: -2 } } , resultText: "我缩在被窝里，借着台灯的光一页一页翻下去。情节越来越精彩，我的眼皮却越来越沉。凌晨两点终于翻完最后一页，我合上书，脑袋里全是故事里的画面。第二天早课我差点在桌上睡着。"},
      { text: "克制住，明天再看", effects: { attributes: { intelligence: 2 } } , resultText: "我狠狠心合上书，把它塞到枕头底下。躺在床上翻来覆去，满脑子都是主角接下来会怎样。我强迫自己数羊，数到五百只才迷迷糊糊睡去。第二天一早，我做的第一件事就是翻开书——章节的末尾，等着我的是更大的悬念。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_green", title: "春萌影涩",
    description: "你发现镜子里的那张脸有些陌生。身体在悄悄变化，心里冒出一些从未有过的情绪——莫名其妙地烦躁，又莫名其妙地欢喜。你好像正在变成另一个人。",
    minAge: createAge(12), maxAge: createAge(16),
    statRequirements: { appearance: 2 }, weight: 2,
    choices: [
      { text: "坦然接受成长的变化", effects: { attributes: { appearance: 2, luck: 1 } } , resultText: "我对着镜子仔细端详自己——好像确实有些不一样了。下巴尖了一些，肩膀宽了一些。我学着大人的样子挺了挺胸，虽然有点别扭，但也不全是坏事。变成另一个人，也许没那么可怕。"},
      { text: "有些不安，躲进自己的世界", effects: { attributes: { creativity: 2, appearance: -1 } } , resultText: "我把帽檐压得低低的，不想让人注意到我的变化。一个人躲在房间里画画、看书，和那些不会变化的纸张待在一起才安心。外面的世界变得太快了——我只想在自己的壳里多待一会儿。"},
    ],
  },
  {
    type: "parametric", id: "p_kid_rebel", title: "持明夜手",
    description: "老师在全班面前严厉批评了你。你攥紧拳头，一股从未有过的愤怒涌上心头。你想反驳，想摔门而去，想告诉所有人——你不是他们想象中的那个样子。",
    minAge: createAge(14), maxAge: createAge(17), weight: 3,
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
    statRequirements: { intelligence: 3 }, weight: 3,
    choices: [
      { text: "踏实工作积累经验", effects: { attributes: { wealth: 2, intelligence: 1 } } , resultText: "我每天第一个到公司，给前辈们倒好咖啡。那些复印、整理、跑腿的活儿，我做得很认真。三个月后，主管开始让我碰真正的业务——原来所有的弯路，都是为了让你看清正路的样子。"},
      { text: "投机取巧走捷径", effects: { attributes: { wealth: 3, luck: -2 } } , resultText: "我发现了一些'聪明'的做法——比如虚报工时、把别人的功劳往自己身上揽。工资条上的数字确实好看了，但同事们看我的眼神变了。深夜躺在床上，我问自己：这就是我想要的成功吗？"},
    ],
  },
  {
    type: "parametric", id: "p_young_travel", title: "船没云水",
    description: "你独自背包旅行。火车穿过陌生的田野，你感到前所未有的自由。",
    minAge: createAge(19), maxAge: createAge(26), weight: 2,
    choices: [
      { text: "深度体验当地文化", effects: { attributes: { creativity: 3, intelligence: 1 } } , resultText: "我在小巷里迷了路，却误入一家当地人常去的老茶馆。老板用方言和我说了很多，我大半没听懂，只是笑着点头。离开时他拍了拍我的肩——那一刻我忽然明白，旅行的意义不是看到什么，而是感受到什么。"},
      { text: "拍照打卡发朋友圈", effects: { attributes: { appearance: 2 } } , resultText: "我举着手机在每一个网红景点前摆出精心设计的pose。朋友圈的点赞数在飙升，但我坐在民宿的床上翻看照片时，却记不起那些景点背后的故事。镜头里的笑容很完美，心里却有个声音在问：你究竟是来旅行，还是来收集点赞的？"},
    ],
  },
  {
    type: "parametric", id: "p_young_network", title: "诚盟远溯",
    description: "一个重要的社交场合。你遇到了可以改变你职业轨迹的人。",
    minAge: createAge(22), maxAge: createAge(28),
    statRequirements: { appearance: 5 }, weight: 2,
    choices: [
      { text: "真诚介绍自己", effects: { attributes: { wealth: 3, luck: 2 } } , resultText: "我没有用那些华丽的修饰词，只是诚实地说了自己的经历和想法。那个行业前辈听完后沉默了几秒，然后说：'年轻人，你很特别。'他递给我一张名片——那是我职业生涯的第一个转折点。原来真诚，才是最高级的社交技巧。"},
      { text: "夸夸其谈", effects: { attributes: { wealth: 1, appearance: -1 } } , resultText: "我把简历上的经历放大了一倍，添油加醋地描述自己的'辉煌战绩'。对方笑着点头，但我看到他眼神里的敷衍。散场后，我连他的联系方式都没要到。牛皮吹得越大，摔得越惨——年轻的虚荣，给我上了现实的第一课。"},
    ],
  },
  {
    type: "parametric", id: "p_young_create", title: "沉眠欲深",
    description: "凌晨三点，你被一个绝妙的创意惊醒。你打开电脑，开始疯狂敲字。",
    minAge: createAge(20), maxAge: createAge(28),
    statRequirements: { creativity: 7 }, weight: 3,
    choices: [
      { text: "通宵完成它", effects: { attributes: { creativity: 5, physique: -2 } } , resultText: "我灌下第三杯咖啡，手指在键盘上飞舞。窗外的天空从漆黑变成深蓝，又从深蓝变成鱼肚白。当我敲完最后一个字保存时，整个人瘫在椅子里，手都在抖。但看着屏幕上完整的方案，我觉得值了——那是我人生中第一个真正属于自己的作品。"},
      { text: "记录下来明天再说", effects: { attributes: { creativity: 2 } } , resultText: "我打开备忘录快速记下了那个灵感的骨架，然后强迫自己关掉电脑。躺在床上，脑子里还在疯狂运转，所有细节争先恐后地涌现。第二天醒来，笔记上的几行字显得那么单薄——有些灵感就像夜里的梦，天亮就散了。"},
    ],
  },
  {
    type: "parametric", id: "p_young_health", title: "常明夜室",
    description: "你连续熬夜后病倒了。高烧中，你梦见月亮被阴影吞没。",
    minAge: createAge(20), maxAge: createAge(28),
    statRequirements: { physique: 3 }, weight: 2, maxTriggers: 3,
    choices: [
      { text: "好好休养", effects: { attributes: { physique: 3 } } , resultText: "我请了病假，把自己裹在被子里。母亲打来电话，听到我的声音沙哑，急得差点要买票过来。我笑着说没事，挂掉电话后鼻子一酸。原来在生病的时候，人才会承认自己不是铁打的。"},
      { text: "硬撑着继续工作", effects: { attributes: { physique: -3, intelligence: 1 } } , resultText: "我吞了两片退烧药，把电脑搬到床上继续改方案。额头发烫，视线模糊，但deadline不会等人。凌晨终于交稿时，我瘫倒在床上，感觉自己像一台过度运转后冒烟的机器——年轻的身体，原来也是有额度的。"},
    ],
  },
  {
    type: "parametric", id: "p_young_money", title: "错买饮食",
    description: "你心血来潮做了一笔投资，但标的不太对劲。",
    minAge: createAge(22), maxAge: createAge(30), weight: 1,
    choices: [
      { text: "及时止损", effects: { attributes: { wealth: -1, intelligence: 1 } } , resultText: "我看着账户里缩水的数字，心痛得不行。但还是在跌停前咬牙卖掉了——后来那只股票果然一路狂跌。朋友说我运气好，只有我知道，那不是什么运气，是学会了跟自己的贪欲和解。吃一堑，长一智。"},
      { text: "加倍投入博反弹", effects: { attributes: { wealth: -3, luck: -2 }, isLethal: false } , resultText: "我不信命，又投了一笔进去。盯着K线图的眼睛熬得通红，心脏随着数字的跳动忽上忽下。最后爆仓的那天，我蹲在出租屋的阳台上抽了一整包烟。赌徒心态，是年轻人最容易犯的错——而我用真金白银交了学费。"},
    ],
  },
  {
    type: "parametric", id: "p_young_snow_plum", title: "春陌云生",
    description: "寒冬腊月，你独自踏雪而行。天地苍茫间，一树红梅傲然绽放，像极了你不肯熄灭的理想。你伸手触碰花瓣，指尖的冰凉让你愈发清醒——原来美好，从来都需要穿越风雪才能遇见。",
    minAge: createAge(20), maxAge: createAge(26), weight: 2,
    choices: [
      { text: "折一枝带回出租屋", effects: { attributes: { creativity: 3, luck: 1 } } , resultText: "我把那枝红梅插在矿泉水瓶里，放在窗台上。简陋的出租屋因为这抹颜色，忽然有了生气。每天清晨醒来看到它，就觉得这座城市也不是那么冰冷——至少还有一朵花，是为你而开的。"},
      { text: "拍张照片继续赶路", effects: { attributes: { intelligence: 1, physique: 1 } } , resultText: "我掏出手机拍了张照片，然后把手缩回口袋，缩着脖子继续赶路。后来那张照片一直躺在相册里，每次翻到，都会想起那个冬天的早上——有一树梅花在风雪里开得那么好，而我匆匆路过了它。"},
    ],
  },
  {
    type: "parametric", id: "p_young_dim_lights", title: "城暮夜疏",
    description: "深夜的城市万家灯火，却没有一盏为你而亮。你站在天桥上，看车流如河，忽然意识到自己不过是这座城市里的一粒尘埃——但尘埃也有尘埃的骄傲，至少你还在路上。",
    minAge: createAge(22), maxAge: createAge(28), weight: 2, maxTriggers: 2,
    choices: [
      { text: "给自己买一碗热汤", effects: { attributes: { physique: 2, luck: 1 } } , resultText: "我走进街角那家还亮着灯的馄饨店。热汤下肚的瞬间，冻僵的手指和脚趾开始恢复知觉。老板多给我加了两颗馄饨，说'年轻人别太省'。我低头喝汤，热气模糊了眼镜——也模糊了眼眶。"},
      { text: "匿名给陌生人点一份外卖", effects: { attributes: { appearance: 1, luck: 2 } } , resultText: "我打开外卖软件，选了一家深夜还营业的店，匿名给备注里写着'加班到凌晨'的陌生人点了一份热粥。做完这件事，心里好像没那么空了——原来在陌生的城市里温暖另一个人，也是在温暖自己。"},
    ],
  },
  {
    type: "parametric", id: "p_young_drunken", title: "沉梦远逝",
    description: "你喝醉了，躺在出租屋的地板上。耳边回响着李白那句'仰天大笑出门去，我辈岂是蓬蒿人'——可你连明天的早会都还没准备。理想和现实之间，隔着一地空酒瓶。",
    minAge: createAge(20), maxAge: createAge(26),
    statRequirements: { creativity: 4 }, weight: 2,
    choices: [
      { text: "借着酒劲写一首诗", effects: { attributes: { creativity: 4, physique: -1 } } , resultText: "我拿起笔，字迹歪歪扭扭，但句子像洪水一样倾泻而出。写了什么已经记不太清了，只记得那些字里行间全是不甘——不甘平庸，不甘认命，不甘就这样在出租屋里老去。第二天醒来看到满纸潦草的诗句，笑了。酒后吐的真言，其实一直都在心底。"},
      { text: "洗把脸，明天还要上班", effects: { attributes: { intelligence: 2, wealth: 1 } } , resultText: "我用冷水冲了把脸，看着镜子里狼狈的自己。那个意气风发的少年什么时候变成了这样？我深吸一口气，定好闹钟，关灯躺下。成年人的崩溃是无声的，也是有时限的——明天早会还要汇报，容不得你矫情太久。"},
    ],
  },
  {
    type: "parametric", id: "p_young_night_rain", title: "愁漫雨声",
    description: "职场如江湖。你被同事暗算背了黑锅，一个人在雨夜加班到凌晨。那些表面笑脸，不过是一场无声的厮杀。你盯着电脑屏幕，屏幕上的字渐渐模糊成一片——原来长大，就是学会咽下委屈。",
    minAge: createAge(22), maxAge: createAge(30),
    statRequirements: { intelligence: 3 }, weight: 3, maxTriggers: 2,
    choices: [
      { text: "收集证据，保护自己", effects: { attributes: { intelligence: 3, luck: 2 } } , resultText: "我开始不动声色地保留邮件截图、聊天记录，整理每一个时间线。两个月后，当领导追责时，我拿出了完整的证据链。会议室里鸦雀无声——我没有报复任何人，只是学会了在这个江湖里保护好自己。"},
      { text: "忍一时风平浪静", effects: { attributes: { luck: 1, physique: 1 } } , resultText: "我咽下了这口气，默默把黑锅背了。后来那个陷害我的同事又故技重施，终于被公司开除了。我庆幸自己没冲动，但也明白了一个道理——善良如果没有牙齿，就是软弱。忍一时风平浪静，退一步未必海阔天空。"},
    ],
  },
  {
    type: "parametric", id: "p_young_reforge", title: "残铓永生",
    description: "你失败了。你赌上一切的事，以惨败告终。你坐在河边，把石头狠狠扔进水里，溅起的水花打湿了你的脸。剑已断，可你还不想认输——因为你知道，真正的剑客不是从不倒下，而是每次倒下都能站起来。",
    minAge: createAge(22), maxAge: createAge(30), weight: 2, maxTriggers: 1,
    choices: [
      { text: "从零开始，再来一次", effects: { attributes: { creativity: 4, luck: 2, physique: -2 } } , resultText: "我擦干眼泪，把所有的积蓄重新摊在桌上。这一次我什么都没有了，但也什么都不怕了。失败像一盆冷水，浇醒了我所有的幻想。我开始认真复盘每一个错误——真正的强者不是从不失败，而是把失败踩成台阶。"},
      { text: "换一条路走", effects: { attributes: { intelligence: 3, luck: 1 } } , resultText: "我承认了——这条路走不通。不是认输，是换一条赛道。那些打不倒你的，确实会让你变得更强大——但前提是，你得懂得转弯。我收起残剑，走向了另一片江湖。谁规定一条路必须走到底呢？"},
    ],
  },
  {
    type: "parametric", id: "p_young_barefoot", title: "赤迈洋沙",
    description: "为了省下房租，你住在没有暖气的隔断间。清晨赤脚踩在冰冷的地板上，寒意从脚底窜到头顶。你咬了咬牙——今年冬天一定要撑过去。春天会来的，只要你不放弃。",
    minAge: createAge(19), maxAge: createAge(25), weight: 1,
    choices: [
      { text: "咬牙坚持", effects: { attributes: { physique: 3, wealth: 1 } } , resultText: "我买了一条最厚的棉被，晚上裹着它看书。早上闹钟一响，赤脚踩在冰冷的地板上，那股寒意从脚底窜到头顶，人也彻底清醒了。我在日历上画了一个圈——'春天来的那天，我要去吃一顿火锅'。这个念头支撑我熬过了整个冬天。"},
      { text: "向家里求助", effects: { attributes: { wealth: 2, luck: -1 } } , resultText: "我拨通了家里的电话，听到母亲声音的那一刻，眼泪不争气地掉了下来。我说'妈，最近手头有点紧'，她二话不说就转了钱。挂掉电话后我看着那条转账记录发了很久的呆——二十多岁了还在让父母操心，愧疚比寒冷更让人难受。"},
    ],
  },
  {
    type: "parametric", id: "p_young_star_chase", title: "采梦云上",
    description: "你报名了一个看似遥不可及的比赛。报名表上的截止日期刺眼地提醒着你——离截止只有三天。周围人都说你疯了，可你偏要试试。万一呢？万一那颗星星，真的能被你摘到呢？",
    minAge: createAge(20), maxAge: createAge(27),
    statRequirements: { creativity: 5 }, weight: 2, maxTriggers: 1,
    choices: [
      { text: "通宵三天也要完成", effects: { attributes: { creativity: 5, physique: -3 } } , resultText: "我把窗帘拉上，切断了和外界的所有联系。困了就趴十分钟，醒了继续。第三天凌晨，当我点击'提交'按钮的那一刻，整个人虚脱般倒在键盘上。显示器散发着微弱的光，像一颗终于被摘到的星星，虽然微小，却是我自己的光。"},
      { text: "理性评估，量力而行", effects: { attributes: { intelligence: 2, creativity: 1 } } , resultText: "我拿出纸笔，认真分析了参赛需要的时间和能力，最后决定——暂时放弃。不是懦弱，是把这次冲动转化为下一年的积累。我在计划本上写下：'等我准备好了，一定会来。'少年人的热血不一定要在当下挥洒，沉淀后的力量才更持久。"},
    ],
  },
  {
    type: "parametric", id: "p_young_upstream", title: "船没远驶",
    description: "同期入职的朋友已经开始躺平，而你还在咬牙进修。深夜的图书馆里，只有你的台灯还亮着。你揉了揉酸涩的眼睛，翻开下一页。不进则退，你不想退——因为你知道，所有看似无用的努力，都在悄悄塑造未来的你。",
    minAge: createAge(20), maxAge: createAge(28), weight: 3,
    choices: [
      { text: "坚持学下去", effects: { attributes: { intelligence: 4, physique: -2 } } , resultText: "眼皮在打架，咖啡已经喝到第三杯。身边的座位一个个空了，只有头顶那盏灯还亮着。我揉了揉发酸的眼睛，在笔记本上又写了一页。走出图书馆时已经是深夜，路灯把我的影子拉得很长——但我在这条路上，每一步都算数。"},
      { text: "休息一天，别太累", effects: { attributes: { physique: 2, intelligence: 1 } } , resultText: "我合上书本，去操场走了几圈。晚风很凉，吹散了脑中的混沌。回来后又翻了几页书，效率反而比硬撑着高了许多。原来有时候，停下来是为了走得更远——这个道理我用了很久才真正明白。"},
    ],
  },
  {
    type: "parametric", id: "p_young_drifting", title: "草茂叶生",
    description: "你又搬家了。这已经是毕业后的第五个住处。打包行李时你忽然想不起来——'家'到底在哪里。你看着房间里渐渐空掉的墙壁，有些恍惚。浮萍虽无根，却也能在漂泊中开出花来。",
    minAge: createAge(20), maxAge: createAge(27), weight: 2,
    choices: [
      { text: "给老家的父母打个电话", effects: { attributes: { luck: 2, creativity: 2 } } , resultText: "电话响了两声就接通了，仿佛母亲一直在等。我没说搬家的事，只是问她最近身体怎么样。她絮絮叨叨说了很多——院子里的柿子树今年结了很多果，隔壁家的狗又生了。我听着听着就笑了，原来无论搬到哪里，电话那头的声音就是家的坐标。"},
      { text: "在新家种一盆植物", effects: { attributes: { physique: 1, luck: 1 } } , resultText: "我在楼下的花店买了一盆绿萝，放在新房间的窗台上。给它浇水的时候，忽然觉得这个陌生的房间有了一点烟火气。植物不会说话，但它倔强地绿着，好像在替我告诉这座城市——我打算在这里待下去了。"},
    ],
  },
  {
    type: "parametric", id: "p_young_butterfly", title: "出明羽身",
    description: "你终于走出了舒适区。那个曾经在人群中不敢说话的自己，现在站在讲台上侃侃而谈。台下的掌声响起时，你忽然有点想哭——原来破茧的痛，是为了飞翔的这一刻。所有的怯懦，都化作了翅膀上的鳞粉。",
    minAge: createAge(22), maxAge: createAge(30),
    statRequirements: { appearance: 3 }, weight: 3, maxTriggers: 1,
    choices: [
      { text: "接受更大的挑战", effects: { attributes: { appearance: 4, luck: 2, physique: -2 } } , resultText: "我接下了一个难度远超我能力范围的项目。准备方案的那几周，我每天只睡四五个小时，PPT改了十几版。汇报那天，我从头到尾讲完后，台下响起了掌声。那一刻我忽然明白——成长不是准备好了才出发，而是出发了才能准备好。"},
      { text: "享受这个时刻", effects: { attributes: { appearance: 2, luck: 2 } } , resultText: "我站在镜子前，看着那个坦然微笑的自己。从前的我从不敢直视自己的眼睛。我给妈妈打了个电话，说'妈，我今天在台上讲话没有发抖'。她在电话那头笑了很久。我知道这只是开始，但至少——我终于迈出了那一步。"},
    ],
  },
  {
    type: "parametric", id: "p_young_moon_toast", title: "愁满夜深",
    description: "又是一个人的生日。你给自己买了瓶酒，对着窗外的月亮碰杯。孤独吗？也许吧。但也自由。你忽然理解了李白为什么总是一个人喝酒——有些路，注定要一个人走；有些月光，只属于独自仰望的人。",
    minAge: createAge(22), maxAge: createAge(29), weight: 1,
    choices: [
      { text: "写下给自己的信", effects: { attributes: { creativity: 3, luck: 1 } } , resultText: "我打开手机备忘录，写下：'亲爱的自己，今天你25岁了。你一个人在这座城市，一事无成，但又拥有一切可能。'写完后我读了一遍，又读了一遍，眼泪不知道什么时候流了下来。月光洒在屏幕上，那些字亮晶晶的，像星星。"},
      { text: "找个朋友视频聊天", effects: { attributes: { appearance: 2, luck: 1 } } , resultText: "我拨通了老友的视频，屏幕那头的他也刚下班，脸上的疲惫和我一模一样。我们隔着屏幕干了一杯——他喝啤酒，我喝二锅头。聊到凌晨两点，从理想到现实，从过去到未来。挂掉电话时，孤独还在，但没那么重了。"},
    ],
  },
  {
    type: "parametric", id: "p_young_forest", title: "策马云山",
    description: "你接到了一个需要去陌生城市的offer。前途未卜，但心里有团火在烧。你想起小时候看过的武侠片——少年提剑入江湖，凭的就是一腔孤勇。你不知道前方是什么，但你知道，不去会后悔一辈子。",
    minAge: createAge(19), maxAge: createAge(26),
    statRequirements: { physique: 3, creativity: 3 }, weight: 2, maxTriggers: 1,
    choices: [
      { text: "义无反顾地出发", effects: { attributes: { creativity: 4, luck: 3, wealth: -2 } } , resultText: "我递了辞呈，拖着行李箱去了那座陌生的城市。出站的那一刻，潮湿的海风扑面而来，我深吸了一口气——这味道里有未知，有自由，也有一丝恐惧。我给朋友发了条消息：'我到了。'然后关掉手机，走进了那片属于我的森林。"},
      { text: "做好万全准备再走", effects: { attributes: { intelligence: 2, wealth: 2 } } , resultText: "我没有急着走，而是先在网上了解了那座城市的情况，存够了半年的房租，甚至提前联系了几个可能的住处。当终于坐上火车时，我比想象中平静。年少时的冲动很美，但深思熟虑后的出发，才是成年人该有的勇敢。"},
    ],
  },

  // ── 壮年期 31-60 ──
  {
    type: "parametric", id: "p_mid_career", title: "撑明永世",
    description: "你的事业到了关键转折点。一个重大项目摆在面前，成则飞升，败则重来。整个团队都在看着你——你已经不是那个可以输得起的少年了。",
    minAge: createAge(31), maxAge: createAge(50), weight: 3,
    choices: [
      { text: "全力以赴，背水一战", effects: { attributes: { wealth: 5, intelligence: 2, physique: -2 } } , resultText: "你带着核心团队连续奋战了三个月，办公室的灯几乎没熄过。项目上线那天凌晨，你站在落地窗前看着城市的轮廓在晨光中浮现——你赢了。你摸了摸鬓角，又多了几根白发，但这都不重要了。"},
      { text: "委托团队稳健推进", effects: { attributes: { wealth: 2, luck: 1 } } , resultText: "你把任务拆分得清清楚楚，交给最信任的几个骨干。每周的例会上你听取汇报、把控方向，不越级也不插手。项目平稳交付那天，你准时下班回家，陪家人吃了一顿久违的晚饭。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_family", title: "春梦永世",
    description: "你站在婚礼的殿堂上，看着TA的眼睛。这一生的承诺，从此刻开始。",
    minAge: createAge(25), maxAge: createAge(35), weight: 2, maxTriggers: 1,
    choices: [
      { text: "深情宣誓", effects: { attributes: { luck: 3, creativity: 2 } } , resultText: "你站在聚光灯下，握着TA的手，那些准备好的誓词忽然全部忘了。沉默了几秒，你只说了句：'以后的路，我们一起走。'台下有人笑了，也有人偷偷抹眼泪。那一夜，你第一次觉得'归宿'这个词有了形状。"},
      { text: "务实规划未来", effects: { attributes: { wealth: 2, intelligence: 2 } } , resultText: "你和TA在厨房餐桌上摊开账本，一笔一笔地算——房贷、育儿基金、养老储备。没有海誓山盟，只有密密麻麻的数字。但你知道，这比任何情话都实在：真正的承诺，写在柴米油盐里。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_crisis", title: "愁眠雨声",
    description: "中年危机如约而至。你坐在深夜的阳台上，雨声敲打着内心的不安。",
    minAge: createAge(38), maxAge: createAge(50), weight: 2,
    choices: [
      { text: "重新审视人生方向", effects: { attributes: { creativity: 3, intelligence: 2 } } , resultText: "你报了一个心理咨询课程，每周去见一次治疗师。第一次说出'我不快乐'的时候，你哭了。治疗师递来纸巾，你擦了擦脸，觉得心里那块压了多年的石头终于松动了一点。"},
      { text: "买一辆跑车", effects: { attributes: { wealth: -2, appearance: 1 } } , resultText: "你提了那辆关注了三年的跑车。发动引擎的轰鸣声让你笑了出来，像一个叛逆的少年。回家后你看到女儿惊讶的眼神，忽然有点不好意思——但你不打算解释，这是你为自己做的一个梦。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_health", title: "草木有衰",
    description: "体检报告上出现了几个红字。你盯着它们，第一次认真思考'健康'的意义。",
    minAge: createAge(40), maxAge: createAge(55), weight: 2,
    choices: [
      { text: "开始规律运动", effects: { attributes: { physique: 5 } } , resultText: "你办了健身卡，每天早晨六点准时出现在健身房。最开始那两周浑身酸痛，上楼梯都龇牙咧嘴。一个月后你发现精神好了很多，连脾气都变好了——原来身体不会骗你，你对它好，它就对你好。"},
      { text: "无所谓，继续喝酒", effects: { attributes: { physique: -5, luck: -2 } } , resultText: "你照常参加每一个酒局，红光满面地谈笑风生。深夜回家你把体检报告塞进抽屉最深处，不去看那些加粗的指标。反正人都有一死——你这样安慰自己，但半夜醒来时，心慌得怎么也睡不着。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_invest", title: "沉没一瞬",
    description: "一个朋友拉你合伙创业。你看着商业计划书，热血沸腾。",
    minAge: createAge(32), maxAge: createAge(45),
    statRequirements: { wealth: 5 }, weight: 2,
    choices: [
      { text: "全力投入创业", effects: { attributes: { wealth: 6, intelligence: 2, physique: -3 } } , resultText: "你辞了职，全身心扑在那个项目上。每天只睡五个小时，凌晨还在和团队讨论方案。你瘦了，但眼睛亮了。妻子说你看起来像回到了二十岁——你知道她没说出口的是，她也担心你会像年轻时那样狠狠摔一跤。"},
      { text: "谨慎注资，不参与管理", effects: { attributes: { wealth: 2, luck: 1 } } , resultText: "你投了一笔钱，签了协议，不干涉日常运营。每个季度看看报表，偶尔去办公室转转。朋友说你太谨慎，你摇摇头——这个年纪，稳比快重要。你知道自己几斤几两。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_greyhair", title: "愁明银色",
    description: "清晨洗漱时，你对着镜子愣住了——鬓角多了一根白发。你小心翼翼地拔掉它，却发现旁边还有两根。时光从不说谎，它把所有痕迹都刻在你的身上。",
    minAge: createAge(35), maxAge: createAge(45), weight: 2, maxTriggers: 2,
    choices: [
      { text: "坦然接受变老的事实", effects: { attributes: { creativity: 2, luck: 1 } } , resultText: "你把白发留在那里，任它们占领你的鬓角和头顶。同事们夸你'有味道了'，你苦笑着想——不接受又能怎样？但你发现，当你不再和这件事较劲的时候，反而觉得自在了许多。"},
      { text: "染发，跟时间较劲", effects: { attributes: { appearance: 2, physique: -1 } } , resultText: "你每两个月去一次理发店，坐在镜前看着染发膏一点点遮住白色。走出来的时候确实年轻了几岁，可你也知道，下次白发还会长出来，就像潮水一定会再次涌起。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_nightwork", title: "迟暮夜深",
    description: "凌晨一点，你终于走出写字楼。月光洒在空荡荡的街道上，你的影子被拉得很长。出租车里，电台放着老歌，你靠着车窗，眼皮越来越重。手机屏幕还亮着——家人发来的消息没来得及回。",
    minAge: createAge(32), maxAge: createAge(48), weight: 3, maxTriggers: 3,
    choices: [
      { text: "再拼几年就好了", effects: { attributes: { wealth: 3, physique: -2, intelligence: 1 } } , resultText: "你把回不了的消息设成自动回复，把错过晚饭的愧疚藏在心里。凌晨的出租车上，你默默算了一笔账——再熬两年就能还清房贷。你闭上眼睛，让疲惫随着车身的晃动沉入夜色。"},
      { text: "命要紧，换份轻松的工作", effects: { attributes: { wealth: -1, physique: 3, luck: 1 } } , resultText: "你递交了辞呈，主管惊讶地看了你三秒：'想清楚了？'你点点头。走出写字楼的那一刻，阳光有些刺眼，你深呼吸了一口——空气里有种久违的自由的味道。虽然薪水少了一半，但你又能看到日出了。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_toast", title: "愁迷影碎",
    description: "酒桌上觥筹交错。你举起酒杯，透过琥珀色的液体看着对面那张笑脸——是真心还是假意？中年人的社交，每一杯酒都有它的价钱，推杯换盏间全是算计。",
    minAge: createAge(35), maxAge: createAge(50),
    statRequirements: { wealth: 3 }, weight: 2, maxTriggers: 3,
    choices: [
      { text: "一饮而尽，谈成生意", effects: { attributes: { wealth: 3, physique: -2, appearance: 1 } } , resultText: "你仰头把酒灌下去，火辣辣地划过喉咙。对面的人笑了，向你伸出了手。你握住那只手，知道这笔生意成了。但你也知道，今晚又要胃痛了——你摸了摸口袋里的胃药，心想，这就是代价。"},
      { text: "以茶代酒，守住底线", effects: { attributes: { physique: 2, luck: 1 } } , resultText: "你端起茶杯，在觥筹交错间显得格格不入。有人打趣你'老了'，你笑笑不说话。酒局散场时你是唯一清醒的人，送同事回家的路上，你靠着车窗，心里出奇地平静。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_storm", title: "沉没雨时",
    description: "家里出了大事。你拖着疲惫的身躯回到家，TA什么也没说，只是默默给你倒了一杯热水，然后坐在你身边。那一刻你明白，所谓夫妻，就是同一条船上的人，风浪再大也不松手。",
    minAge: createAge(33), maxAge: createAge(50), weight: 2, maxTriggers: 2,
    choices: [
      { text: "紧紧握住TA的手", effects: { attributes: { luck: 3, creativity: 2 } } , resultText: "你握住TA的手，指节发白。千言万语堵在喉咙里，最后只挤出一句：'有我呢。'TA的眼泪滴在你手背上，滚烫。那晚你们在沙发上坐了很久，谁也没有松开谁——有些风雨，握紧了手就能走过去。"},
      { text: "一个人扛，不让TA担心", effects: { attributes: { physique: -2, intelligence: 2, wealth: 1 } } , resultText: "你笑着说'没事'，转身走进书房，轻轻关上了门。你坐在黑暗里，盯着手机上的数字发呆。你不想让TA看到你崩溃的样子——不是不信任，而是你觉得，有些重量注定只能一个人扛。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_alone", title: "垂目影深",
    description: "周末下午，你一个人坐在江边垂钓。水面平静如镜，倒映着你不再年轻的脸。手机响了——是工作群的消息。你没有点开，继续盯着水面发呆。人到中年，热闹是别人的，孤独是自己的。",
    minAge: createAge(40), maxAge: createAge(55), weight: 2, maxTriggers: 2,
    choices: [
      { text: "享受这份独处的宁静", effects: { attributes: { creativity: 3, luck: 2 } } , resultText: "你把手机调成静音，扣在石头上。浮漂在水面轻轻晃动，你的思绪也跟着漂到了很远的地方。这些年你一直在扮演各种角色——员工、父母、子女——只有这一刻，你只是你自己。"},
      { text: "收起鱼竿，回到人群中去", effects: { attributes: { appearance: 2, wealth: 1 } } , resultText: "你收起鱼竿，回到家中。妻子问你钓到没有，你说'没有'，她也不失望。你坐在沙发上看电视，女儿发来视频，小外孙在镜头里叫你'爷爷'。你笑了——或许你并不是真的想独处，只是累了。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_help", title: "持梅应手",
    description: "老友遇到困难，深夜打来电话，声音哽咽。你听着电话那头的倾诉，想起当年他也曾帮过你。人到了这个年纪，朋友就像冬天的炭火——越来越少，但每一个都珍贵得舍不得用。",
    minAge: createAge(35), maxAge: createAge(55),
    statRequirements: { wealth: 3 }, weight: 2, maxTriggers: 2,
    choices: [
      { text: "倾囊相助，情义无价", effects: { attributes: { wealth: -3, luck: 4, appearance: 2 } } , resultText: "你把银行卡递过去的时候，老友的泪水夺眶而出。你拍了拍他的肩膀，什么也没说。回家的路上妻子看了你一眼，欲言又止，最终只说了句：'做得对。'你知道那笔钱可能回不来了，但你更知道，有些东西比钱珍贵得多。"},
      { text: "量力而行，点到为止", effects: { attributes: { wealth: 1, intelligence: 1 } } , resultText: "你借出一笔在他偿还能力范围内的数目，又帮忙联系了几个熟人。老友千恩万谢，你说'都是小事'。回到办公室你记了一笔账——不只是钱的账，也是人情的账。中年人的友谊，经不起透支。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_fame", title: "尘没云散",
    description: "你升职了，但内心毫无波澜。坐在更大的办公室里，你看着墙上那些奖状和锦旗，突然觉得很空。这些曾经让你热血沸腾的东西，如今不过是墙上的灰尘。你拿起一块奖牌擦了擦，又放下了。",
    minAge: createAge(45), maxAge: createAge(58),
    statRequirements: { wealth: 5 }, weight: 2, maxTriggers: 1,
    choices: [
      { text: "看淡名利，追求内心", effects: { attributes: { creativity: 4, luck: 2, wealth: -1 } } , resultText: "你把那些奖杯从柜子上拿下来，一件件擦拭干净，收进了纸箱。儿子不解地问：'爸，这不是你的荣誉吗？'你摸了摸他的头：'荣誉在心里，不在柜子上。'那天下午，你翻开了一本想了很久却一直没空看的书。"},
      { text: "位置越高责任越大", effects: { attributes: { wealth: 3, intelligence: 2, physique: -2 } } , resultText: "你坐在新办公室里，窗外的视野更开阔了，但你看到的不是风景，是更多的责任。会议一个接一个，决策文件堆满了桌角。你揉了揉太阳穴，想起刚入职时的自己——那个只想'混口饭吃'的年轻人，如今扛着一千多人的生计。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_undercurrent", title: "沉脉隐生",
    description: "公司里的人心开始浮动。两个派系都在拉拢你，同事在茶水间的窃窃私语多了起来。你知道，站队的时候到了。选错了，前半生的积累可能付诸东流；不选，两边都不会把你当自己人。",
    minAge: createAge(35), maxAge: createAge(50),
    statRequirements: { intelligence: 5 }, weight: 2, maxTriggers: 2,
    choices: [
      { text: "明哲保身，谁也不站", effects: { attributes: { intelligence: 2, luck: -1 } } , resultText: "你在办公室里挂了一幅字——'静观其变'。两边的人都来拉拢你，你始终是同一副笑容：'做好自己的事就好。'你知道这样做两面都不讨好，但在职场活了二十年的老狐狸都明白——不站队，才能站到最后。"},
      { text: "选择有前途的一方", effects: { attributes: { wealth: 3, appearance: 1, luck: -2 } } , resultText: "你斟酌了整整一周，分析了每个派系的势力和走向。最终你选定了那一方，在下班后的'偶遇'中递出了橄榄枝。这是一场赌博——中年人的职场就像棋盘，不动棋子的人，最先被吃掉。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_radical", title: "抽脉隐伤",
    description: "你手里握着辞职信，在总经理办公室门口站了很久。这份做了十五年的工作，像一个温暖的牢笼——让你饿不死也撑不着。是继续安稳还是破釜沉舟？你听见自己的心跳声。",
    minAge: createAge(38), maxAge: createAge(52),
    statRequirements: { wealth: 5, intelligence: 5 }, weight: 2, maxTriggers: 1,
    choices: [
      { text: "辞职，自己创业", effects: { attributes: { wealth: 5, creativity: 3, physique: -3, luck: -2 } } , resultText: "你端着纸箱走出公司大门，保安小哥敬了个礼。你回头看了一眼那栋工作了十五年的楼，忽然觉得自己像一个刚出狱的人——自由，但也茫然。你深吸一口气，拨通了第一个客户的电话。"},
      { text: "忍了，稳定压倒一切", effects: { attributes: { wealth: 1, luck: 2, creativity: -2 } } , resultText: "你把辞职信撕碎，扔进垃圾桶。然后打开电脑，继续做那份做了十五年的PPT。下班时同事问你晚上有局吗，你摇了摇头。开车回家的路上收音机里放着老歌，你跟着哼了两句——其实也不算太差。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_mentor", title: "传脉永生",
    description: "一个年轻人叫你'师傅'。你看着他求知若渴的眼神，想起三十年前的自己——也是这么莽撞、这么热忱。你知道自己这辈子的经验和教训，总得有个地方传下去。",
    minAge: createAge(42), maxAge: createAge(58),
    statRequirements: { intelligence: 6, wealth: 3 }, weight: 2, maxTriggers: 1,
    choices: [
      { text: "倾囊相授，毫无保留", effects: { attributes: { intelligence: 3, luck: 3, creativity: 2 } } , resultText: "你把自己几十年的经验整理成文档，从方法论到踩过的坑，事无巨细。那个年轻人每次听完都两眼放光，笔记记了厚厚一本。你看着他，像看着一棵正在长大的树——你知道他终将超越你，而你觉得那很好。"},
      { text: "教七分留三分", effects: { attributes: { intelligence: 1, wealth: 1 } } , resultText: "你教他业务，教他为人，但从不把自己压箱底的心法全部说出。这不是自私——你告诉自己——有些路必须自己走过才算数。你在一旁看着，偶尔点拨一句。既为师徒，便不能替他走路。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_ruin", title: "船没夜深",
    description: "最坏的消息来了。你看着财务报表上刺眼的赤字，或者那份解聘通知，又或者是合伙人带着核心客户消失了。世界在你面前崩塌，但你必须站着——身后还有一家老小指望你。",
    minAge: createAge(40), maxAge: createAge(55),
    statRequirements: { wealth: 4 }, weight: 2, maxTriggers: 1,
    choices: [
      { text: "咬牙坚持，从头再来", effects: { attributes: { physique: -2, luck: 3, creativity: 2, wealth: -2 } } , resultText: "你卖掉了车，退掉了办公室，坐在空荡荡的客厅里打了一圈电话。合伙人走了一半，但手里还有几个愿意相信你的人。你在白纸上重新写下了计划书——字迹有些抖，但每一笔都比从前更用力。"},
      { text: "及时止损，另找出路", effects: { attributes: { wealth: -1, intelligence: 2, luck: 1 } } , resultText: "你在最后一份文件上签了字，结束了这场噩梦。清算师同情地看着你，你反倒安慰他：'没事，人还在。'你走出大楼，天正下着小雨。你没有打伞，在雨里走了很久，想着接下来该怎么办。"},
    ],
  },
  {
    type: "parametric", id: "p_mid_silence", title: "沉眠欲逝",
    description: "凌晨三点，你突然醒来，再也睡不着。身边人睡得很沉。你披着外套走到窗边，看着沉睡的城市。万籁俱寂中，你第一次听见自己内心的声音——它已经沉默了太多年。你问自己：这是我想要的生活吗？",
    minAge: createAge(38), maxAge: createAge(55), weight: 2, maxTriggers: 2,
    choices: [
      { text: "直面内心，承认不快乐", effects: { attributes: { creativity: 3, luck: -1 } } , resultText: "你在日记本上写下第一行字：'我不快乐。'笔尖戳破了纸。你继续写——深夜的焦躁、白天的面具、无声的争吵。写到手指发酸的时候抬头看窗外，天快亮了。你觉得自己像一块冰，正在慢慢融化。"},
      { text: "明天还要上班，继续睡", effects: { attributes: { physique: 2, intelligence: 1 } } , resultText: "你翻了个身，把被子裹紧。闹钟在四个小时后会准时响起，你需要那点睡眠去应付明天的会议。你闭上眼睛，把那些没用的念头赶走——想这些干什么？又不能当饭吃。你很快睡着了，呼吸均匀。"},
    ],
  },

  // ── 晚年期 61-100 ──
  {
    type: "parametric", id: "p_elder_retire", title: "垂暮夜色",
    description: "你退休了。数十年的职场生涯在一场简单的告别会上画上句号。",
    minAge: createAge(60), maxAge: createAge(65), weight: 3,
    choices: [
      { text: "开启人生第二春", effects: { attributes: { creativity: 5, luck: 2 } } , resultText: "你脱下工装的那天，感到的不是失落，而是一种久违的轻盈。余生还长，你的第二程才刚刚开始。窗外的天空比任何时候都要蓝。"},
      { text: "享受悠闲时光", effects: { attributes: { physique: 3, wealth: -1 } } , resultText: "退休后的第一个早晨，你睡到自然醒。阳光透过窗帘洒在地板上，你端着一杯茶，什么也不想做。忙碌了大半辈子，终于可以理直气壮地浪费时间了。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_return", title: "辞母远逝",
    description: "你回到阔别多年的故乡。老屋还在，巷口那棵槐树却已被砍去。物是人非，感慨万千。",
    minAge: createAge(62), maxAge: createAge(72), weight: 2,
    choices: [
      { text: "重修老屋，落叶归根", effects: { attributes: { wealth: -1, luck: 3, creativity: 2 } } , resultText: "你找来工匠，一砖一瓦地修复老屋。每一道墙缝都藏着记忆，每一扇窗户都照见过往。你决定在这里住下来，不再漂泊。"},
      { text: "只是静静走一圈就走了", effects: { attributes: { creativity: 2 } } , resultText: "你沿着巷子慢慢地走，用手抚摸每一面斑驳的墙。一切都变了，又好像什么都没变。你转身离开，没有回头——故乡在心里，不必强求归期。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_garden", title: "策马远山",
    description: "你在院子里种了一片菜园。日出而作，日落而息。原来陶渊明说的'采菊东篱下'是这样的感觉。",
    minAge: createAge(65), maxAge: createAge(78), weight: 2,
    choices: [
      { text: "全身心投入田园生活", effects: { attributes: { physique: 3, creativity: 3 } } , resultText: "你扛起锄头翻土、播种、浇水，汗水滴在泥土里。看着幼苗破土而出，你心里涌起一种久违的踏实。这一亩三分地，就是你的天下。"},
      { text: "随便种种，打发时间", effects: { attributes: { physique: 1, luck: 1 } } , resultText: "你漫不经心地在院子里撒下几颗种子，没想到它们真的发了芽。你蹲在菜畦边，看着那抹嫩绿出了神。日子，原来可以这样慢。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_memory", title: "尘满云散",
    description: "你坐在窗前，翻看一本旧相册。那些面孔和场景从指间流过，像握不住的沙。你试图留住什么，却发现一切都已成往事。",
    minAge: createAge(65), maxAge: createAge(80),
    statRequirements: { creativity: 5 }, weight: 2,
    choices: [
      { text: "写出真实的故事", effects: { attributes: { creativity: 5, luck: 2 } } , resultText: "你铺开稿纸，笔尖停了很久。然后你开始写——不修饰、不回避，把那些真实的欢乐与伤痛都写下来。写到动情处，你摘下老花镜擦了擦眼角。有些故事，只有真实的才动人。"},
      { text: "美化过去", effects: { attributes: { creativity: 2 } } , resultText: "你在回忆中挑挑拣拣，把那些灰暗的部分轻轻抹去。留下的画面温暖而柔和，像一张泛黄的老照片。你知道这不完全是真相，但这样让心里舒坦。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_reunion", title: "春梦玉碎",
    description: "老友聚会。当年的少年如今满头白发，推杯换盏间，那些遥远的名字又被提起。",
    minAge: createAge(68), maxAge: createAge(82), weight: 2,
    choices: [
      { text: "组织定期聚会", effects: { attributes: { appearance: 2, luck: 3 } } , resultText: "你建了个老友群，定下每月一聚的规矩。第一次聚会来了八个人，第二次又少了两个。但你不在乎——能来的，都是时间淘洗后的真朋友。酒不必多，说说话就好。"},
      { text: "珍惜每一次见面", effects: { attributes: { creativity: 3, luck: 1 } } , resultText: "你举起酒杯，和每一个老友碰杯。你知道这样的聚会越来越少，所以格外认真地看每个人的脸。席散后你站在门口目送大家离去，路灯把影子拉得很长。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_legacy", title: "草木一生",
    description: "你开始思考这一生留下了什么。后代？作品？还是只是一个故事？",
    minAge: createAge(70), maxAge: createAge(85), weight: 2,
    choices: [
      { text: "把经验传授给年轻人", effects: { attributes: { intelligence: 3, luck: 3 } } , resultText: "你坐在年轻人中间，把自己一辈子的经验和教训摊开来讲。他们认真地记笔记，问问题。你忽然觉得——原来这一生没有白过，哪怕只点亮了一盏灯。"},
      { text: "写一份遗嘱清单", effects: { attributes: { wealth: 2 } } , resultText: "你戴上老花镜，一笔一划地写下这份清单。财产不多，但每一件物品背后都有一个故事。你希望收到它们的人，能明白这些物的重量。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_hospital", title: "沉眠欲逝",
    description: "你因病住进了医院。白色的天花板，点滴的节拍声。你第一次认真思考'终点'这个词。",
    minAge: createAge(72), maxAge: createAge(88),
    statRequirements: { physique: 5 }, weight: 2,
    choices: [
      { text: "积极配合治疗", effects: { attributes: { physique: 3, luck: 2 } } , resultText: "你每天按时吃药、做康复训练，咬着牙和病痛较劲。护士夸你心态好，你笑了笑——这辈子什么风浪没见过。能多活一天，都是赚的。"},
      { text: "把时间留给家人", effects: { attributes: { appearance: 2, luck: 2, physique: -1 } } , resultText: "你拒绝了部分治疗，选择回家。家人围在身边，你握着每个人的手，仔细端详他们的脸。窗外阳光正好。你忽然觉得，这样就已经很好了。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_wisdom", title: "沧溟遗石",
    description: "你在整理旧物时发现了一本泛黄的笔记本。上面记录的，是你年轻时的一个绝妙创意——它从未被实现。",
    minAge: createAge(75), maxAge: createAge(92),
    statRequirements: { creativity: 6 }, weight: 2,
    choices: [
      { text: "暮年也要把它做出来", effects: { attributes: { creativity: 6, intelligence: 2, physique: -2 } } , resultText: "你戴上老花镜，从满是灰尘的工作台上翻出当年的图纸。手指已不太灵便，但心还是热的。你花了大半年把它做了出来——虽然晚了五十年，但终究没有带着它进坟墓。"},
      { text: "传给下一代去实现", effects: { attributes: { luck: 3, intelligence: 2 } } , resultText: "你小心翼翼地把那本泛黄的笔记本交给孙辈。他们好奇地翻看着，眼睛里闪着光。你拍拍他们的肩说：'这是我的遗憾，但不是你们的。'"},
    ],
  },
  {
    type: "parametric", id: "p_elder_peace", title: "纯美月色",
    description: "某个夜晚，你独自坐在院子里。月光清澈如水，你感到前所未有的平静。",
    minAge: createAge(75), maxAge: createAge(90), weight: 2,
    choices: [
      { text: "享受这片刻宁静", effects: { attributes: { luck: 5, creativity: 2 } } , resultText: "你靠在藤椅上，月光洒在你的脸上。远处传来几声狗吠，更衬得夜色安静。你闭上眼睛，感觉自己像一片羽毛，漂浮在时间之外。"},
      { text: "叫家人一起赏月", effects: { attributes: { appearance: 2, luck: 3 } } , resultText: "你招呼家人搬了椅子出来。孩子们起初还在看手机，后来也渐渐被这月色打动。一家人就这样静静地坐着，看着同一轮明月。千年前的古人，大概也是这样的吧。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_reborn", title: "残木迎生",
    description: "你年过花甲，本以为人生已无新意。某个寻常的午后，一缕久违的冲动忽然涌上心头——你想学一件年轻时从未触碰的事。枯木逢春，或许为时未晚。",
    minAge: createAge(65), maxAge: createAge(80), weight: 2, maxTriggers: 1,
    statRequirements: { creativity: 4 },
    choices: [
      { text: "全心投入这迟来的热情", effects: { attributes: { creativity: 5, luck: 2 } } , resultText: "你报了老年大学，坐在第一排认真听讲。旁边的年轻人以为你是来旁听的老教授，你笑了笑没解释。手指有些生疏，但心里的火却越烧越旺。"},
      { text: "不过是一时冲动罢了", effects: { attributes: { creativity: 2 } } , resultText: "你放下那个念头，继续过着平静的日子。但偶尔午夜梦回，那缕冲动还是会悄悄冒出来——像一根刺，轻轻地扎你一下。你翻个身，继续睡去。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_unfinished", title: "残没欲收",
    description: "深夜无眠，你想起年轻时那个被搁置的梦想。它像一个未解的生死劫，在心头盘桓了大半生。如今棋子尚在，棋盘却已蒙尘。",
    minAge: createAge(70), maxAge: createAge(90), weight: 2, maxTriggers: 1,
    statRequirements: { creativity: 4 },
    choices: [
      { text: "去完成它，趁还来得及", effects: { attributes: { creativity: 4, intelligence: 2, physique: -2 } } , resultText: "你重新打开尘封已久的工具箱，双手虽然颤抖，但眼神异常坚定。那些未完成的线条和色彩，在你的手中渐渐活了过来。你赶在日落之前，终于画完了最后一笔。"},
      { text: "把它交给后人去实现", effects: { attributes: { luck: 3, intelligence: 1 } } , resultText: "你把这些年的构思和积累整理成册，郑重地交到年轻人手中。看着他们接下这份未竟的事业，你心里既有释然，也有一丝说不清的酸楚。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_ember", title: "残墨雨湿",
    description: "社区里缺人手，有人来请你帮忙。你本可以推托，但那些求助的眼睛让你想起当年的自己——也曾被人扶过一把。",
    minAge: createAge(70), maxAge: createAge(88), weight: 2, maxTriggers: 2,
    statRequirements: { physique: 3 },
    choices: [
      { text: "发挥余热，不计回报", effects: { attributes: { luck: 3, creativity: 3 } } , resultText: "你穿上志愿者的红马甲，在社区里忙前忙后。帮人修锁、教孩子写毛笔字、陪孤寡老人聊天。虽然累，但心里充实——原来被人需要，是这么温暖的事。"},
      { text: "婉拒，安心养老", effects: { attributes: { physique: 2, luck: 1 } } , resultText: "你婉言谢绝了对方的请求，心里却没有完全放下。夜晚你望着窗外的万家灯火，想那些需要帮助的人是否已经得到了回应。你轻轻叹了口气，合上眼不再想。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_together", title: "苍眉影深",
    description: "你和老伴一起在院子里晒太阳。TA的头发已经全白了，你的也是。你们没说几句话，但手一直握在一起。",
    minAge: createAge(68), maxAge: createAge(85), weight: 2, maxTriggers: 2,
    choices: [
      { text: "牵起TA的手，说一声'辛苦了'", effects: { attributes: { luck: 3, appearance: 2 } } , resultText: "你握住TA布满皱纹的手，千言万语化作一句'辛苦了'。TA的眼眶湿了，你也湿了。这一路走来不容易，好在——你们一直在一起。"},
      { text: "默默陪伴，不必多言", effects: { attributes: { luck: 2, creativity: 2 } } , resultText: "你什么都没说，只是把TA的手握得更紧了一些。阳光暖暖地照着，你们像两棵老树，根早已纠缠在一起，枝叶在风中沙沙作响。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_friendless", title: "沉默欲散",
    description: "你翻看手机通讯录，发现很多号码已经很久没打过了。你试着拨了一个——接电话的是对方的女儿。TA上个月走了。",
    minAge: createAge(75), maxAge: createAge(92), weight: 2, maxTriggers: 2,
    choices: [
      { text: "去送最后一程", effects: { attributes: { luck: 2, creativity: 3 } } , resultText: "你拄着拐杖参加了葬礼。看着墓碑上那张熟悉的笑脸，你没有哭。你只是站在那儿，在心里和他说了很久的话。老朋友，你先走一步，我们终会再见。"},
      { text: "在心底默默告别", effects: { attributes: { creativity: 2, physique: 1 } } , resultText: "你没有去葬礼，而是在那天独自去了你们常去的小公园。你坐在长椅上，看着落叶一片片飘下来。有些告别不需要仪式，心里的那声'再见'同样沉重。"},
    ],
  },
  {
    type: "parametric", id: "p_elder_great", title: "沉默永逝",
    description: "你坐在院中老槐树下看落日。邻家的孩子跑来问你：'爷爷，人活着到底为了什么？'你沉默了很久，然后笑了。",
    minAge: createAge(78), maxAge: createAge(98), weight: 2, maxTriggers: 1,
    statRequirements: { intelligence: 6 },
    choices: [
      { text: "'好好活着就是答案'", effects: { attributes: { intelligence: 3, luck: 2 } } , resultText: "孩子歪着头想了想，似懂非懂地跑开了。你望着他的背影，想起自己也曾问过同样的问题。如今你终于有了答案——不是用语言，而是用这一生。"},
      { text: "讲一个故事来回答", effects: { attributes: { creativity: 4, intelligence: 1 } } },
    ],
  },
  {
    type: "parametric", id: "p_elder_curtain", title: "尘没已逝",
    description: "你感到身体越来越轻。床前围满了熟悉的面孔，有人在哭，有人在轻声唤你的名字。你想说别难过，但已经发不出声音了。舞台的灯光，终于要灭了。",
    minAge: createAge(85), maxAge: createAge(100), weight: 3, maxTriggers: 1,
    choices: [
      { text: "微笑着闭上眼睛", effects: { attributes: { luck: 3, creativity: 2 }, isLethal: true } },
      { text: "留下最后的嘱托", effects: { attributes: { intelligence: 2, appearance: 2 }, isLethal: true } },
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
