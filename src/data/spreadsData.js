export const spreadsData = [
  {
    id: 'single',
    name: '单牌阵',
    nameEn: 'Single Card',
    cardCount: 1,
    description: '最简单的占卜方式，获得当前最重要的指引',
    positions: [
      { id: 0, name: '核心指引', meaning: '当前最关键的指引信息' }
    ],
    layout: [
      { id: 0, col: 1, row: 1 }
    ]
  },
  {
    id: 'three',
    name: '三牌阵',
    nameEn: 'Three Cards',
    cardCount: 3,
    description: '经典的时间之流阵型，洞悉过去、现在与未来',
    positions: [
      { id: 0, name: '过去', meaning: '已经发生的事情，影响当前状况的根源' },
      { id: 1, name: '现在', meaning: '当前的状态和核心问题所在' },
      { id: 2, name: '未来', meaning: '事情可能的发展方向与结果' }
    ],
    layout: [
      { id: 0, col: 1, row: 1 },
      { id: 1, col: 2, row: 1 },
      { id: 2, col: 3, row: 1 }
    ]
  },
  {
    id: 'love-cross',
    name: '爱情十字',
    nameEn: 'Love Cross',
    cardCount: 5,
    description: '专为爱情关系设计的阵型，剖析情感深层',
    positions: [
      { id: 0, name: '你的心意', meaning: '你对这段关系的真实感受' },
      { id: 1, name: '对方心意', meaning: '对方的真实感受和态度' },
      { id: 2, name: '现状', meaning: '你们关系当前的状态' },
      { id: 3, name: '阻碍', meaning: '关系中存在的障碍或挑战' },
      { id: 4, name: '结果', meaning: '关系可能的发展结果' }
    ],
    layout: [
      { id: 0, col: 1, row: 1 },
      { id: 1, col: 3, row: 1 },
      { id: 2, col: 2, row: 2 },
      { id: 3, col: 2, row: 3 },
      { id: 4, col: 2, row: 4 }
    ]
  },
  // {
  //   id: 'hexagram',
  //   name: '六芒星',
  //   nameEn: 'Hexagram',
  //   cardCount: 7,
  //   description: '全面的分析阵型，涵盖生活的多个维度',
  //   positions: [
  //     { id: 0, name: '过去', meaning: '过去的经历和影响' },
  //     { id: 1, name: '现在', meaning: '当前的状态' },
  //     { id: 2, name: '未来', meaning: '近期发展趋势' },
  //     { id: 3, name: '对策', meaning: '应对当前问题的建议' },
  //     { id: 4, name: '环境', meaning: '周围环境和他人影响' },
  //     { id: 5, name: '希望', meaning: '你的期望和内心渴望' },
  //     { id: 6, name: '结果', meaning: '最终可能出现的结果' }
  //   ],
  //   layout: [
  //     { id: 0, col: 1, row: 2 },
  //     { id: 1, col: 2, row: 1 },
  //     { id: 2, col: 3, row: 2 },
  //     { id: 3, col: 3, row: 3 },
  //     { id: 4, col: 2, row: 4 },
  //     { id: 5, col: 1, row: 3 },
  //     { id: 6, col: 2, row: 3 }
  //   ]
  // },
  // {
  //   id: 'celtic-cross',
  //   name: '凯尔特十字',
  //   nameEn: 'Celtic Cross',
  //   cardCount: 10,
  //   description: '最经典的深度占卜阵型，全面解析问题',
  //   positions: [
  //     { id: 0, name: '现状', meaning: '当前问题的核心所在' },
  //     { id: 1, name: '阻碍', meaning: '横亘在面前的障碍或挑战' },
  //     { id: 2, name: '根源', meaning: '问题的深层原因和基础' },
  //     { id: 3, name: '过去', meaning: '导致当前状况的过往事件' },
  //     { id: 4, name: '目标', meaning: '可以达到的最佳结果' },
  //     { id: 5, name: '近期未来', meaning: '即将发生的事件' },
  //     { id: 6, name: '自我', meaning: '你在此问题中的态度和立场' },
  //     { id: 7, name: '环境', meaning: '外部环境和他人的影响' },
  //     { id: 8, name: '希望/恐惧', meaning: '内心的希望和潜在的恐惧' },
  //     { id: 9, name: '最终结果', meaning: '事情发展的最终结局' }
  //   ],
  //   layout: [
  //     { id: 0, col: 2, row: 1 },
  //     { id: 1, col: 2, row: 2 },
  //     { id: 2, col: 1, row: 2 },
  //     { id: 3, col: 3, row: 2 },
  //     { id: 4, col: 4, row: 1 },
  //     { id: 5, col: 4, row: 2 },
  //     { id: 6, col: 4, row: 3 },
  //     { id: 7, col: 3, row: 3 },
  //     { id: 8, col: 1, row: 3 },
  //     { id: 9, col: 4, row: 4 }
  //   ]
  // }
]