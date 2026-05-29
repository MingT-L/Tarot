# 神秘塔罗 Mystic Tarot

> 探索灵魂的指引，开启命运的光之旅程 —— 一款基于 Vue 3 的线上塔罗牌占卜应用

## 项目简介

神秘塔罗（Mystic Tarot）是一个交互式塔罗牌占卜 Web 应用，提供完整的 78 张塔罗牌库浏览和多种占卜牌阵。用户可以选择心仪的牌阵，输入心中困惑，通过抽取塔罗牌获得命运指引与详细解牌。

## 项目预览

| 首页（殿堂） | 牌库（秘典） |
|--------------|--------------|
| ![首页截图](https://raw.githubusercontent.com/MingT-L/Tarot/main/docs/home.png) | ![牌库截图](https://raw.githubusercontent.com/MingT-L/Tarot/main/docs/cardList.png) |

| 占卜选择 | 抽牌界面 |
|----------|----------|
| ![牌阵选择](https://raw.githubusercontent.com/MingT-L/Tarot/main/docs/divination_list.png) | ![轮盘抽牌](https://raw.githubusercontent.com/MingT-L/Tarot/main/docs/divination_chioice.png) |

| 结果解读 | 历史记录 |
|----------|----------|
| ![解牌结果](https://raw.githubusercontent.com/MingT-L/Tarot/main/docs/divination_result.png) | ![历史记录](https://raw.githubusercontent.com/MingT-L/Tarot/main/docs/history.png) |

### 在线预览

[https://mingt-l.github.io/Tarot/](https://mingt-l.github.io/Tarot/)

### 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 (Composition API + `<script setup>`) |
| 构建工具 | Vite 8 |
| 路由 | Vue Router 5 (Hash 模式) |
| 状态管理 | Pinia 3 |
| 样式方案 | 原生 CSS + CSS 变量 |
| 字体 | Google Fonts (Cinzel Decorative + Noto Serif SC) |
| 包管理器 | pnpm |

### 功能特性

- **牌库浏览** —— 78 张塔罗牌（22 张大阿卡纳 + 56 张小阿卡纳）完整展示，支持分类筛选
- **多种牌阵** —— 单牌阵、三牌阵、爱情十字阵，满足不同占卜需求
- **占卜抽牌** —— 输入占卜问题，通过轮盘式选牌器抽取对应数量的塔罗牌
- **结果解读** —— 每张牌包含正逆位关键词、详细解读和牌面描述，多角度综合分析
- **历史记录** —— localStorage 持久化保存占卜历史，支持查看、筛选和删除
- **响应式设计** —— 桌面端与移动端适配，支持顶部导航栏和底部导航栏
- **神秘学视觉风格** —— 暗黑金色主题，粒子星尘背景，仪式感十足的 UI 设计

## 项目结构

```
Tarot/
├── public/
│   └── favicon.svg               # 网站图标
├── src/
│   ├── assets/                   # 静态资源（图片、全局样式）
│   │   ├── bg.png                # 全局背景图
│   │   ├── btn.png               # 按钮背景图
│   │   ├── card_bg.png           # 卡牌背景图
│   │   ├── fool.png              # 愚者卡牌图
│   │   ├── moon.png              # 月亮卡牌图
│   │   ├── star.png              # 星星卡牌图
│   │   ├── main.css              # 全局样式
│   │   └── ...
│   ├── components/               # 可复用组件
│   │   ├── CardBack.vue          # 塔罗牌背面组件
│   │   ├── CardDetailModal.vue   # 卡牌详情弹窗
│   │   ├── CardDrawArea.vue      # 抽牌区域组件
│   │   ├── CardFilter.vue        # 卡牌分类筛选组件
│   │   ├── FloatingNav.vue       # 桌面端浮动导航栏
│   │   ├── HistoryCard.vue       # 历史记录卡片组件
│   │   ├── MobileNav.vue         # 移动端底部导航栏
│   │   ├── SpreadSelector.vue    # 牌阵选择器组件
│   │   ├── StarryBackground.vue  # 星尘粒子背景组件
│   │   ├── TarotCard.vue         # 塔罗牌展示组件
│   │   ├── TarotCircleSelector.vue # 轮盘式卡牌选择器组件
│   │   ├── TarotScene3D.vue      # 3D 塔罗场景组件（预留）
│   │   └── TopNavBar.vue         # 顶部导航栏组件
│   ├── composables/              # 组合式函数
│   │   └── useTimeoutCleanup.js  # 超时清理工具
│   ├── data/                     # 数据层
│   │   ├── cardsData.js          # 78 张塔罗牌完整数据集
│   │   ├── constants.js          # 常量配置
│   │   └── spreadsData.js        # 牌阵配置数据
│   ├── router/
│   │   └── index.js              # 路由配置
│   ├── stores/                   # Pinia 状态管理
│   │   ├── cardStore.js          # 卡牌状态管理
│   │   └── historyStore.js       # 历史记录状态管理
│   ├── views/                    # 页面组件
│   │   ├── HomePage.vue          # 首页（殿堂）
│   │   ├── LibraryPage.vue       # 牌库页（秘典）
│   │   ├── DivinationPage.vue    # 占卜页（启命）
│   │   ├── ResultPage.vue        # 结果页
│   │   ├── HistoryPage.vue       # 历史页（觅迹）
│   │   └── TestPage.vue          # 测试页
│   ├── App.vue                   # 根组件
│   └── main.js                   # 应用入口
├── train/                        # 78 张塔罗牌图片（原始资源）
├── index.html                    # HTML 入口
├── vite.config.js                # Vite 构建配置
├── package.json                  # 项目依赖配置
├── pnpm-lock.yaml                # pnpm 依赖锁定文件
└── .gitignore                    # Git 忽略规则
```

## 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0（推荐）或 npm >= 9.0.0

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

### 启动开发服务器

```bash
pnpm dev
```

开发服务器默认运行在 `http://localhost:5173`。

### 构建生产版本

```bash
pnpm build
```

构建产物输出到 `dist/` 目录。

### 预览生产构建

```bash
pnpm preview
```

## 使用说明

### 浏览牌库

访问「秘典」页面即可查看全部 78 张塔罗牌。使用顶部分类筛选栏可在「大阿卡纳」「权杖」「圣杯」「宝剑」「星币」五个类别间切换。点击任意卡牌可查看详细信息：正逆位关键词、详细解读和牌面描述。

### 进行占卜

1. 访问「启命」页面
2. 在输入框中输入你想占卜的问题（例如："我最近的事业发展如何？"）
3. 选择适合的牌阵（单牌阵 / 三牌阵 / 爱情十字阵）
4. 点击「叩问星辰」按钮
5. 在轮盘式选牌器中依次点击卡牌完成抽牌
6. 抽牌完成后自动跳转到结果解读页面
7. 查看每张牌的详细解读和综合分析

### 查看历史记录

访问「觅迹」页面可查看所有占卜历史记录。支持按牌阵类型筛选、单条删除和全部清空。历史记录保存在浏览器 localStorage 中，注意清除浏览器数据会导致记录丢失。

## 路由说明

| 路径 | 名称 | 页面 | 说明 |
|------|------|------|------|
| `/` | home | 殿堂 | 首页，品牌展示与导航入口 |
| `/library` | library | 秘典 | 78 张塔罗牌库浏览 |
| `/divination` | divination | 启命 | 占卜流程：选择牌阵 → 抽牌 |
| `/result/:id` | result | 结果 | 根据历史记录 ID 查看占卜结果 |
| `/history` | history | 觅迹 | 历史记录管理与回顾 |
| `/test` | test | 测试页 | 功能测试页面 |

## 塔罗牌分类

| 分类 | 中文名 | 英文名 | 数量 |
|------|--------|--------|------|
| major | 大阿卡纳 | Major Arcana | 22 张 |
| wands | 权杖 | Wands | 14 张 |
| cups | 圣杯 | Cups | 14 张 |
| swords | 宝剑 | Swords | 14 张 |
| pentacles | 星币 | Pentacles | 14 张 |

## 贡献指南

欢迎提交 Issue 和 Pull Request 参与项目改进。

### 提交规范

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature-name`
3. 保持代码风格与项目一致（2 空格缩进、kebab-case Vue 组件、中文注释）
4. 确保功能正常后提交：`git commit -m 'feat: 添加某功能'`
5. 推送到分支：`git push origin feature/your-feature-name`
6. 创建 Pull Request

### 代码规范

- 使用 Composition API（`<script setup>` 语法糖）
- 组件文件使用 kebab-case 命名
- 路由路径使用 kebab-case
- 变量使用 camelCase，常量使用 UPPER_SNAKE_CASE
- 代码注释使用中文

