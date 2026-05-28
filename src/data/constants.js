// 塔罗牌分类映射（category key -> 中文名称）
export const categoryMap = {
  major: '大阿卡纳',
  wands: '权杖',
  cups: '圣杯',
  swords: '宝剑',
  pentacles: '星币'
}

// 导航链接配置（桌面端/移动端共用路径和基础标签）
export const navLinks = [
  { path: '/', label: '殿堂', mobileLabel: '首页', icon: 'home' },
  { path: '/library', label: '秘典', mobileLabel: '牌库', icon: 'library' },
  { path: '/divination', label: '启命', mobileLabel: '占卜', icon: 'sparkle' },
  { path: '/history', label: '觅迹', mobileLabel: '历史', icon: 'history' }
]

// 历史记录最大存储条数
export const MAX_HISTORY_RECORDS = 100
