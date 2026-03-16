import { MoodRecord } from '../types';

export const COPY_DICT = {
  feeling:[
    "暂停一下\n感受当下的呼吸",
    "此时此刻\n思绪漂到了哪里？",
    "把纷扰卸下\n把此刻留下",
    "听听内心的声音",
    "世界很吵，这里很静",
    // --- 新增扩容 ---
    "此刻的底色是什么样的？",
    "不急慢慢梳理此刻的思绪",
    "每一次心跳都值得被记录",
    //这里不会换行，不知道为啥捏
  ],
  tags:[
    "发生了什么？",
    "是什么触动了你？",
    "这些瞬间构成了今天",
    "给此刻贴个标签",
    // --- 新增扩容 ---
    "谁或者什么\n参与了你的此刻",
    "将庞杂的生活\n拆解为几个词汇",
    "锚定那些\n让你泛起涟漪的事物",
    "感受碎片",
    "试着去具象化\n发生的一切"
  ],
  note:[
    "一句话记录",
    "想对自己说点什么？",
    "把心情写在云端",
    "碎碎念也是诗",
    // --- 新增扩容 ---
    "哪怕只是\n无意义的呢喃\n也没有关系",
    "将无法言说的\n留给这片空白",
    "写下那些\n稍纵即逝的念头",
  ],
  daily:[
    "日常点滴",
    "岁月的痕迹",
    "生活在发光",
    "记录即存在",
    // --- 新增扩容 ---
    "时间的另一种形状",
    "与自己相处的足迹"
  ]
};

export const ROUTINE_TEXTS = {
  sleep: {
    initial:[
      "让疲惫清零的碎片时间",
      "闭目养神，暂别喧嚣",
      "给紧绷的神经松松绑",
      "一段安静的休眠期",
      "一次微小的能量回充",
      "将思维调至静音模式",
      "短暂的抽离也是一种前进"
    ],
    continuation:[
      "梦境的续写，让电量再满一点",
      "再贪恋一会安静，把余味留长",
      "给电量条再加最后一点格数",
      "在舒适区里多留连了片刻",
      "呼吸慢一点，让刚才的宁静延展"
    ],
    guide: {
      initial: "记录整晚的睡眠时长",
      continuation: "补充额外的贪睡时间"
    }
  },
  exercise: {
    initial:[
      "身体的舒展也是情绪的释放",
      "找回肌肉与呼吸的掌控感",
      "让心跳带走一些沉闷",
      "用行动重塑内心的秩序",
      "一次与身体的诚实对话",
      "感受力量在四肢里流淌",
    ],
    continuation:[
      "节奏不停，汗水在为意志加勋",
      "身体的余热，还想再沸腾一会",
      "趁着心跳未平，多感受一点力量",
      "多出来的这几分钟，是送给健康的奖赏",
      "让多巴胺的释放再久那么一点点"
    ],
    guide: {
      initial: "记录身体的运动时长",
      continuation: "补充多出的运动时间"
    }
  },
  study: {
    initial:[
      "沉浸在不被打扰的心流中",
      "为精神领地添砖加瓦",
      "专注本身就是一种深度的休息",
      "思维的触角又延伸了一些",
      "在属于自己的绝对领域里深潜",
      "屏蔽噪音，建造内心的秩序",
      "与未知的世界再靠近一点"
    ],
    continuation:[
      "在认知的深海里，又向下潜了几米",
      "思维的火花还在继续碰撞",
      "内心的秩序在这一刻变得更稳固",
      "专注的惯性带着你走得更远了些",
      "又一块精神砖块垒在了理想之上"
    ],
    guide: {
      initial: "记录当下的专注时长",
      continuation: "补充延续的思考时间"
    }
  }
};

export const FEEDBACK_POOL = {
  high:[
    "捕捉到了你的光亮，真为你开心",
    "让这份好心情\n在梦里也开出花来吧",
    "今天的你本身就在发光",
    // --- 新增扩容 ---
    "这股轻盈的风\n也许能吹散明天的阴霾",
    "真好\n生活偶尔也会慷慨地发糖",
    "你的步履间\n似乎带上了一点明朗",
    "愿这片晴朗\n在你心里多驻足一会"
  ],
  neutral:[
    "这一刻的静谧\n被妥善收藏了",
    "世界很吵\n但这里只属于你",
    "安稳的秩序\n是送给自己的礼物",
    "听见了\n此刻的你很自由",
    "愿这分从容能陪你入睡",
    // --- 新增扩容 ---
    "没有波澜的日子\n本身就是一种恩赐",
    "像水一样平静\n像风一样自由",
    "不去定义好坏\n只是存在着就很好",
    "平淡的锚点\n能稳住生活的重心",
    "感受安宁\n在匀速流淌的时光里"
  ],
  low:[
    "辛苦了\n在这里你可以不用那么坚强",
    "即使是阴影\n也是生活真实的一部分",
    "今晚给自己一个大大的拥抱吧",
    "别担心\n云朵后面月亮一直都在",
    // --- 新增扩容 ---
    "没关系的\n不是每天都必须元气满满",
    "雨天也有雨天的意义\n允许自己淋会儿雨",
    "你的疲惫这里都接得住",
    "不需要强求开心\n安静地待着也可以"
  ]
};

export function getRandomText(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)];
}

export function getNonRepeatingText(array: string[], lastIndex: number = -1) {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * array.length);
  } while (newIndex === lastIndex && array.length > 1);
  return { text: array[newIndex], index: newIndex };
}

export function getSmartFeedback(moodScore: number): string {
  let pool;
  if (moodScore >= 1) pool = FEEDBACK_POOL.high;
  else if (moodScore === 0) pool = FEEDBACK_POOL.neutral;
  else pool = FEEDBACK_POOL.low;
  
  return pool[Math.floor(Math.random() * pool.length)];
}

export function generateGreeting(lastRecord: MoodRecord | null): { time: string, text: string } {
  const currentHour = new Date().getHours();
  let timeGreeting = "";

  if (currentHour < 9) timeGreeting = "晨光微起。";
  else if (currentHour < 14) timeGreeting = "午后好。";
  else if (currentHour < 19) timeGreeting = "日落了。";
  else timeGreeting = "夜深了。";

  if (!lastRecord) return { 
    time: timeGreeting, 
    text: "今天想带着怎样的心情出发？" 
  };

  const timeDiff = Date.now() - lastRecord.timestamp;
  const hoursSinceLast = timeDiff / (1000 * 60 * 60);

  // 情绪上下文感知（低落）
  if (lastRecord.mood_score <= -1 && hoursSinceLast < 6) {
    const comfortTexts =[
      "感觉好些了吗？",
      "情绪像海浪\n我们在岸上陪你",
      "深呼吸，慢慢来",
      "没关系\n允许自己难过一会儿",
      // --- 新增扩容 ---
      "稍微缓过来一点了吗？",
      "今天好像有些沉重\n抱抱你",
      "即使天没晴\n你也可以给自己撑把伞",
      "在这里\n不用假装情绪稳定"
    ];
    return { 
      time: timeGreeting, 
      text: comfortTexts[Math.floor(Math.random() * comfortTexts.length)] 
    };
  }

  // 情绪上下文感知（开心）
  if (lastRecord.mood_score >= 1 && hoursSinceLast < 6) {
    const happyTexts =[
      "看来好心情还在延续",
      "愿这份轻盈\n能陪你更久一点",
      "捕捉到了，这一抹亮色",
      // --- 新增扩容 ---
      "还带着刚才的笑意吗？",
      "好情绪的余温\n好像还在空气里",
      "看到你状态不错，真好",
      "那份雀跃\n是不是还在心头跳动？",
      "阳光好像一直照在你的窗边"
    ];
    return { 
      time: timeGreeting, 
      text: happyTexts[Math.floor(Math.random() * happyTexts.length)] 
    };
  }

  const normalTexts = COPY_DICT.feeling;
  return { 
    time: timeGreeting, 
    text: getRandomText(normalTexts) 
  };
}
