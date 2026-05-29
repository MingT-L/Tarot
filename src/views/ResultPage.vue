<template>
  <!--
    ResultPage - 占卜结果解读页面（神秘学 / 暗黑金色 / 神谕启示风格）
    包含：星尘背景、仪式感标题、牌阵翻转揭示、羊皮纸逐牌解读、分段综合解读
  -->
  <div class="result-page">
    <!-- ==================== 星尘粒子背景层 ==================== -->
    <div class="star-field" aria-hidden="true">
      <span
        v-for="star in stars"
        :key="star.id"
        class="star-field__particle"
        :style="{
          left: star.left + '%',
          top: star.top + '%',
          width: star.size + 'px',
          height: star.size + 'px',
          animationDelay: star.delay + 's',
          animationDuration: star.duration + 's'
        }"
      ></span>
    </div>

    <!-- ==================== 记录未找到状态 ==================== -->
    <section v-if="!record" class="result-not-found">
      <div class="result-not-found__icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          <path d="M2 12h20"/>
        </svg>
      </div>
      <h2 class="result-not-found__title">记录未找到</h2>
      <p class="result-not-found__text">该占卜记录可能已被删除，或 ID 无效</p>
      <router-link to="/divination" class="btn btn-gold result-not-found__btn">
        开始新的占卜
      </router-link>
    </section>

    <!-- ==================== 结果内容（记录存在时） ==================== -->
    <template v-if="record">
      <!-- ==================== 二、页面标题仪式感 ==================== -->
      <section ref="headerSection" class="result-header" :class="{ 'is-visible': headerVisible }">
        <div class="result-header__ornament">
          <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
            <path d="M0 20 L12 6 L24 20 L36 6 L40 20 L44 6 L56 20 L68 6 L80 20 L68 34 L56 20 L44 34 L40 20 L36 34 L24 20 L12 34 Z" stroke="#c9a84c" stroke-width="0.5" fill="none" opacity="0.25"/>
            <circle cx="40" cy="20" r="5" stroke="#c9a84c" stroke-width="0.5" fill="none" opacity="0.35"/>
            <circle cx="40" cy="20" r="2" fill="#c9a84c" opacity="0.25"/>
          </svg>
        </div>
        <h1 class="result-header__title">占卜结果</h1>
        <!-- 金色装饰分隔线，中间嵌太阳符号 -->
        <div class="result-header__divider">
          <span class="result-header__divider-line"></span>
          <span class="result-header__divider-symbol">☉</span>
          <span class="result-header__divider-line"></span>
        </div>
      </section>

      <!-- ==================== 三、牌阵布局区域——核心视觉焦点 ==================== -->
      <section
        ref="spreadSection"
        class="spread-visual"
        :class="{ 'is-visible': spreadVisible }"
      >
        <!-- 金色光晕放射背景 -->
        <div class="spread-visual__aura"></div>

        <h2 class="section-title">牌阵布局</h2>

        <div class="spread-visual__grid" :style="gridStyle">
          <div
            v-for="(cell, index) in gridCells"
            :key="cell.key"
            class="spread-visual__cell"
            :class="{
              'spread-visual__cell--empty': !cell.card,
              'spread-visual__cell--reversed': cell.card && cell.isReversed
            }"
            :style="{ gridColumn: cell.col, gridRow: cell.row }"
          >
            <!-- 有牌时：翻转揭示容器 -->
            <template v-if="cell.card">
              <div
                class="spread-visual__flip-container"
                :class="{ 'is-flipped': flipStates[cell.key] }"
                :style="{ transitionDelay: flipStates[cell.key] ? '0s' : (index * 0.5) + 's' }"
              >
                <div class="spread-visual__flip-inner">
                  <!-- 牌背（初始可见） -->
                  <div class="spread-visual__card-back">
                    <div class="spread-visual__card-back-inner">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <circle cx="20" cy="20" r="18" stroke="#c9a84c" stroke-width="0.6" opacity="0.5"/>
                        <circle cx="20" cy="20" r="10" stroke="#c9a84c" stroke-width="0.4" opacity="0.3"/>
                        <path d="M20 2 L22 18 L38 20 L22 22 L20 38 L18 22 L2 20 L18 18 Z" fill="#c9a84c" opacity="0.4"/>
                      </svg>
                    </div>
                  </div>
                  <!-- 牌面（翻转后显示） -->
                  <div class="spread-visual__card-front">
                    <img
                      :src="getImagePath(cell.card.file)"
                      :alt="cell.card.nameCn"
                      class="spread-visual__card-img"
                      :class="{ 'spread-visual__card-img--reversed': cell.isReversed }"
                    />
                    <!-- 粒子爆发伪元素通过 CSS 实现 -->
                    <div class="spread-visual__particle-burst" v-if="flipStates[cell.key]"></div>
                  </div>
                </div>
              </div>
              <!-- 正逆位标识 -->
              <span
                class="spread-visual__orientation"
                :class="cell.isReversed ? 'spread-visual__orientation--reversed' : 'spread-visual__orientation--upright'"
              >
                {{ cell.isReversed ? '逆位' : '正位' }}
              </span>
              <p class="spread-visual__pos-name">{{ cell.positionName }}</p>
              <p class="spread-visual__card-name">{{ cell.card.nameCn }}</p>
            </template>

            <!-- 空牌位 -->
            <template v-else>
              <div class="spread-visual__empty-slot">
                <span class="spread-visual__empty-label">{{ cell.positionName }}</span>
              </div>
            </template>
          </div>
        </div>
      </section>

      <!-- 牌阵与逐牌解读之间的分隔 -->
      <div class="mystic-divider">
        <span class="mystic-divider__dot"></span>
        <span class="mystic-divider__line"></span>
        <span class="mystic-divider__diamond">✦</span>
        <span class="mystic-divider__line"></span>
        <span class="mystic-divider__dot"></span>
      </div>

      <!-- ==================== 四、逐牌解读区域——卡片式展开 ==================== -->
      <section class="card-readings">
        <h2 class="section-title">逐牌解读</h2>

        <div
          v-for="(item, idx) in readingList"
          :key="item.positionId"
          :ref="el => { if (el) readingCardRefs[idx] = el }"
          class="reading-card"
          :class="{
            'reading-card--reversed': item.isReversed,
            'reading-card--upright': !item.isReversed,
            'is-visible': readingVisible[idx]
          }"
        >
          <!-- 牌位标题 + 正逆位箭头 -->
          <div class="reading-card__header">
            <div class="reading-card__orientation-indicator">
              <span
                class="reading-card__arrow"
                :class="item.isReversed ? 'reading-card__arrow--down' : 'reading-card__arrow--up'"
              >
                <svg v-if="!item.isReversed" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"/>
                  <polyline points="5 12 12 5 19 12"/>
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <polyline points="19 12 12 19 5 12"/>
                </svg>
              </span>
              <span class="reading-card__orientation-text">
                {{ item.isReversed ? '逆位' : '正位' }}
              </span>
            </div>
            <h3 class="reading-card__pos-title">{{ item.positionName }}</h3>
          </div>

          <!-- 卡片主体 -->
          <div class="reading-card__body">
            <!-- 牌面缩略图 -->
            <div class="reading-card__image-wrap">
              <div class="reading-card__image-glow"></div>
              <img
                :src="getImagePath(item.card.file)"
                :alt="item.card.nameCn"
                class="reading-card__image"
                :class="{ 'reading-card__image--reversed': item.isReversed }"
              />
            </div>

            <!-- 牌名与解读内容 -->
            <div class="reading-card__content">
              <!-- 牌名中文 + 英文 -->
              <h4 class="reading-card__card-name-zh">{{ item.card.nameCn }}</h4>
              <p class="reading-card__card-name-en">{{ item.card.nameEn }}</p>

              <!-- 关键词胶囊标签 -->
              <div class="reading-card__keywords">
                <span
                  v-for="kw in getKeywordList(item)"
                  :key="kw"
                  class="reading-card__keyword-tag"
                >{{ kw }}</span>
              </div>

              <!-- 牌位含义（引号装饰） -->
              <div class="reading-card__pos-meaning">
                <span class="reading-card__pos-meaning-quote">"</span>
                <span class="reading-card__pos-meaning-text">{{ item.positionDesc }}</span>
                <span class="reading-card__pos-meaning-quote">"</span>
              </div>

              <!-- 解读正文 -->
              <div class="reading-card__reading">
                <p class="reading-card__reading-text">
                  {{ item.isReversed ? item.card.meaning.reversed : item.card.meaning.upright }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 逐牌解读与综合解读之间的分隔 -->
      <div class="mystic-divider">
        <span class="mystic-divider__dot"></span>
        <span class="mystic-divider__line"></span>
        <span class="mystic-divider__diamond">✦</span>
        <span class="mystic-divider__line"></span>
        <span class="mystic-divider__dot"></span>
      </div>

      <!-- ==================== 五、综合解读区域——分段递进展示 ==================== -->
      <section class="summary-section">
        <h2 class="section-title">综合解读</h2>

        <div class="summary-cards">
          <!-- 灵性指引卡片 -->
          <div
            ref="spiritualCardRef"
            class="summary-card summary-card--spiritual"
            :class="{ 'is-visible': spiritualVisible }"
          >
            <div class="summary-card__icon summary-card__icon--spiritual">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </div>
            <h3 class="summary-card__title">灵性指引</h3>
            <p class="summary-card__stat">
              大阿卡纳 <strong>{{ summary.majorCount }}</strong> 张，小阿卡纳 <strong>{{ summary.minorCount }}</strong> 张
            </p>
            <p class="summary-card__desc">
              {{ summary.majorCount > summary.minorCount ? '本次占卜的灵性指引力量较强，深层的心灵议题和人生重大课题正在显现。' : '本次占卜更聚焦于日常生活的具体事务，通过务实的态度和行动来应对当前课题。' }}
            </p>
          </div>

          <!-- 元素分布卡片 -->
          <div
            ref="elementsCardRef"
            class="summary-card summary-card--elements"
            :class="{ 'is-visible': elementsVisible }"
          >
            <div class="summary-card__icon summary-card__icon--elements">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
                <line x1="12" y1="22" x2="12" y2="8.5"/>
                <polyline points="22 8.5 12 15.5 2 8.5"/>
              </svg>
            </div>
            <h3 class="summary-card__title">元素分布</h3>
            <!-- 元素分布可视化条 -->
            <div class="summary-card__elements">
              <div class="summary-card__element summary-card__element--fire" v-if="summary.elements.wands > 0">
                <span class="summary-card__element-color"></span>
                <span class="summary-card__element-label">权杖（火）</span>
                <div class="summary-card__element-bar-wrap">
                  <div
                    class="summary-card__element-bar"
                    :style="{ width: getElementPercent(summary.elements.wands) + '%' }"
                  ></div>
                </div>
                <span class="summary-card__element-count">{{ summary.elements.wands }} 张</span>
              </div>
              <div class="summary-card__element summary-card__element--water" v-if="summary.elements.cups > 0">
                <span class="summary-card__element-color"></span>
                <span class="summary-card__element-label">圣杯（水）</span>
                <div class="summary-card__element-bar-wrap">
                  <div
                    class="summary-card__element-bar"
                    :style="{ width: getElementPercent(summary.elements.cups) + '%' }"
                  ></div>
                </div>
                <span class="summary-card__element-count">{{ summary.elements.cups }} 张</span>
              </div>
              <div class="summary-card__element summary-card__element--air" v-if="summary.elements.swords > 0">
                <span class="summary-card__element-color"></span>
                <span class="summary-card__element-label">宝剑（风）</span>
                <div class="summary-card__element-bar-wrap">
                  <div
                    class="summary-card__element-bar"
                    :style="{ width: getElementPercent(summary.elements.swords) + '%' }"
                  ></div>
                </div>
                <span class="summary-card__element-count">{{ summary.elements.swords }} 张</span>
              </div>
              <div class="summary-card__element summary-card__element--earth" v-if="summary.elements.pentacles > 0">
                <span class="summary-card__element-color"></span>
                <span class="summary-card__element-label">星币（土）</span>
                <div class="summary-card__element-bar-wrap">
                  <div
                    class="summary-card__element-bar"
                    :style="{ width: getElementPercent(summary.elements.pentacles) + '%' }"
                  ></div>
                </div>
                <span class="summary-card__element-count">{{ summary.elements.pentacles }} 张</span>
              </div>
            </div>
            <p class="summary-card__desc" v-if="summary.dominantElement">
              {{ summary.dominantElementDesc }}
            </p>
          </div>

          <!-- 正逆位比例卡片 -->
          <div
            ref="ratioCardRef"
            class="summary-card summary-card--ratio"
            :class="{ 'is-visible': ratioVisible }"
          >
            <div class="summary-card__icon summary-card__icon--ratio">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <h3 class="summary-card__title">正逆位比例</h3>
            <!-- 环形比例可视化 -->
            <div class="summary-card__ring-wrap">
              <svg class="summary-card__ring" viewBox="0 0 120 120">
                <circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke="rgba(201,168,76,0.12)"
                  stroke-width="10"
                />
                <circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke="#c9a84c"
                  stroke-width="10"
                  stroke-linecap="round"
                  :stroke-dasharray="getUprightDashArray() + ' 314.16'"
                  transform="rotate(-90 60 60)"
                  class="summary-card__ring-upright"
                />
                <circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke="#a78bfa"
                  stroke-width="10"
                  stroke-linecap="round"
                  :stroke-dasharray="getReversedDashArray() + ' 314.16'"
                  :stroke-dashoffset="-getUprightDashArray()"
                  transform="rotate(-90 60 60)"
                  class="summary-card__ring-reversed"
                />
                <text x="60" y="56" text-anchor="middle" fill="#e8d48b" font-size="14" font-weight="700" font-family="'Cinzel Decorative', serif">
                  {{ summary.uprightPercent }}%
                </text>
                <text x="60" y="74" text-anchor="middle" fill="#6b6780" font-size="9" font-family="'Noto Serif SC', serif">
                  正位
                </text>
              </svg>
              <div class="summary-card__ring-labels">
                <span class="summary-card__ring-label summary-card__ring-label--upright">
                  <span class="summary-card__ring-dot summary-card__ring-dot--gold"></span>
                  正位 {{ summary.uprightCount }} 张
                </span>
                <span class="summary-card__ring-label summary-card__ring-label--reversed">
                  <span class="summary-card__ring-dot summary-card__ring-dot--purple"></span>
                  逆位 {{ summary.reversedCount }} 张
                </span>
              </div>
            </div>
            <p class="summary-card__desc">
              {{ summary.reversedCount > summary.uprightCount ? '逆位牌偏多，提示当前课题存在较多内在阻碍、延迟的能量或需要反思的方面。建议放慢节奏，审视内在的抗拒与阴影。' : summary.uprightCount > summary.reversedCount ? '正位牌偏多，能量顺畅流动，当前处境中积极的因素和建设性的力量占主导。顺势而为，把握当下的有利时机。' : '正逆位均等，当前课题处于动态平衡中，既有机遇也有挑战，需要综合考量各种因素做出判断。' }}
            </p>
          </div>

          <!-- 综合解读压轴卡片 -->
          <div
            ref="comprehensiveCardRef"
            class="summary-card summary-card--comprehensive"
            :class="{ 'is-visible': comprehensiveVisible }"
          >
            <div class="summary-card__icon summary-card__icon--comprehensive">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <h3 class="summary-card__title">
              {{ spreadConfig?.name || '占卜' }} 综合解读
            </h3>
            <div class="summary-card__reading">
              <p
                v-for="(para, pIdx) in summaryParagraphs"
                :key="pIdx"
                class="summary-card__reading-para"
              >{{ para }}</p>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { spreadsData } from '@/data/spreadsData'
import { getCardById } from '@/data/cardsData'
import { useHistoryStore } from '@/stores/historyStore'

// ==================== 路由与 Store ====================
const route = useRoute()
const historyStore = useHistoryStore()
const resultId = computed(() => route.params.id || '')

// ==================== 星尘粒子数据 ====================
const stars = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: 1 + Math.random() * 2.5,
  delay: Math.random() * 4,
  duration: 2 + Math.random() * 3
}))

// ==================== 数据获取 ====================
const record = computed(() => {
  if (!resultId.value) return null
  return historyStore.getRecordById(resultId.value) || null
})

const spreadConfig = computed(() => {
  if (!record.value) return null
  return spreadsData.find(s => s.id === record.value.spreadId) || null
})

const baseUrl = import.meta.env.BASE_URL || ''

// ==================== 图像路径 ====================
function getImagePath(file) {
  if (!file) return ''
  return `${baseUrl}${file}`
}

// ==================== 阵型网格数据 ====================
const gridCells = computed(() => {
  if (!spreadConfig.value || !record.value) return []
  const { layout, positions } = spreadConfig.value
  const recordCards = record.value.cards || []

  return layout.map(layoutItem => {
    const cardData = recordCards.find(rc => rc.positionId === layoutItem.id)
    const pos = positions.find(p => p.id === layoutItem.id)

    if (cardData) {
      const fullCard = getCardById(cardData.cardId)
      return {
        key: `pos-${layoutItem.id}`,
        col: layoutItem.col,
        row: layoutItem.row,
        positionName: pos ? pos.name : cardData.positionName || '',
        card: fullCard,
        isReversed: cardData.reversed
      }
    }

    return {
      key: `pos-${layoutItem.id}`,
      col: layoutItem.col,
      row: layoutItem.row,
      positionName: pos ? pos.name : '',
      card: null,
      isReversed: false
    }
  })
})

const gridStyle = computed(() => {
  if (!spreadConfig.value) return {}
  const layout = spreadConfig.value.layout
  const maxCol = Math.max(...layout.map(l => l.col), 1)
  const maxRow = Math.max(...layout.map(l => l.row), 1)
  return {
    gridTemplateColumns: `repeat(${maxCol}, 1fr)`,
    gridTemplateRows: `repeat(${maxRow}, auto)`
  }
})

// ==================== 牌面翻转状态 ====================
const flipStates = reactive({})

// ==================== 逐牌解读数据 ====================
const readingList = computed(() => {
  if (!record.value || !spreadConfig.value) return []
  const recordCards = record.value.cards || []
  const positions = spreadConfig.value.positions || []

  return recordCards.map(rc => {
    const fullCard = getCardById(rc.cardId)
    const pos = positions.find(p => p.id === rc.positionId)

    return {
      positionId: rc.positionId,
      positionName: pos ? pos.name : rc.positionName || '',
      positionMeaning: pos ? pos.name : '',
      positionDesc: pos ? pos.meaning : '',
      card: fullCard,
      isReversed: rc.reversed
    }
  })
})

// ==================== 关键词拆分 ====================
function getKeywordList(item) {
  const text = item.isReversed
    ? item.card.keywords.reversed
    : item.card.keywords.upright
  if (!text) return []
  return text.split(/[,，、]/).map(k => k.trim()).filter(Boolean)
}

// ==================== 综合解读生成 ====================
const ELEMENT_NAMES = {
  wands: '权杖（火）',
  cups: '圣杯（水）',
  swords: '宝剑（风）',
  pentacles: '星币（土）'
}

const summary = computed(() => {
  if (!record.value) {
    return {
      majorCount: 0, minorCount: 0,
      elements: { wands: 0, cups: 0, swords: 0, pentacles: 0 },
      uprightCount: 0, reversedCount: 0,
      uprightPercent: 50, reversedPercent: 50,
      dominantElement: null, dominantElementDesc: '',
      text: ''
    }
  }

  const cards = record.value.cards || []
  const total = cards.length || 1
  let majorCount = 0
  const elements = { wands: 0, cups: 0, swords: 0, pentacles: 0 }
  let uprightCount = 0

  cards.forEach(rc => {
    const card = getCardById(rc.cardId)
    if (!card) return
    if (card.category === 'major') {
      majorCount++
    } else if (card.category && elements.hasOwnProperty(card.category)) {
      elements[card.category]++
    }
    if (!rc.reversed) uprightCount++
  })

  const minorCount = total - majorCount
  const reversedCount = total - uprightCount
  const uprightPercent = Math.round((uprightCount / total) * 100)
  const reversedPercent = 100 - uprightPercent

  let dominantElement = null
  let maxElementCount = 0
  for (const [key, count] of Object.entries(elements)) {
    if (count > maxElementCount) {
      maxElementCount = count
      dominantElement = key
    }
  }

  const dominantElementDesc = dominantElement
    ? generateElementDescription(dominantElement, maxElementCount, total)
    : ''
  const text = generateSummaryText({
    majorCount, minorCount, elements, uprightCount, reversedCount,
    dominantElement, total,
    spreadName: record.value.spreadName || '占卜',
    cards
  })

  return {
    majorCount, minorCount, elements, uprightCount, reversedCount,
    uprightPercent, reversedPercent, dominantElement, dominantElementDesc, text
  }
})

function generateElementDescription(element, count, total) {
  const ratio = count / total
  const dominanceLevel = ratio >= 0.6 ? '显著' : '较为'
  const descriptions = {
    wands: `${dominanceLevel}突出，火元素的能量澎湃涌动。行动力、创造力和激情是当前课题的核心驱动力。建议主动出击，追随内心的热情，但需注意避免冲动行事。`,
    cups: `${dominanceLevel}突出，水元素的情感能量主导。情感关系、直觉感受和心灵连接是当前最重要的主题。建议倾听内心的声音，珍视情感的流动，保持同理心。`,
    swords: `${dominanceLevel}突出，风元素的思维力量集中。理性分析、清晰沟通和智慧决断是关键。建议运用逻辑思维解决问题，坦诚表达，同时避免过度批判。`,
    pentacles: `${dominanceLevel}突出，土元素的务实能量稳固。物质基础、实际成果和稳定发展是当下的核心。建议脚踏实地，关注实际收益，耐心耕耘以获长久的回报。`
  }
  return descriptions[element] || ''
}

function generateSummaryText(params) {
  const {
    majorCount, minorCount, elements, uprightCount, reversedCount,
    dominantElement, total, spreadName
  } = params
  const parts = []

  parts.push(`这是你通过"${spreadName}"阵型进行的占卜，共抽取了 ${total} 张塔罗牌。`)

  if (majorCount > minorCount) {
    parts.push(
      `本次占卜中大阿卡纳出现了 ${majorCount} 张，占比超过一半，这表明当前的课题触及了深层的灵魂层面。` +
      `大阿卡纳象征着生命中重要的原型力量和精神成长课题，你的潜意识正在通过强大的象征符号向你传达重要的讯息。` +
      `建议你深入反思这些牌所揭示的人生课题，它们很可能指向一个关键的成长转折点。`
    )
  } else if (majorCount > 0) {
    parts.push(
      `本次出现了 ${majorCount} 张大阿卡纳牌，它们为占卜注入了灵性的深度，提示在具体事务背后存在着更深层的心灵课题值得关注。`
    )
  } else {
    parts.push(
      `本次占卜全部由小阿卡纳组成，关注点集中在日常生活的具体层面。` +
      `这并不是说缺乏灵性指引，而是提示当前最重要的课题就在你的日常事务和实际行动之中。`
    )
  }

  if (dominantElement) {
    const elementParts = []
    for (const [key, count] of Object.entries(elements)) {
      if (count > 0) elementParts.push(`${ELEMENT_NAMES[key]} ${count} 张`)
    }
    parts.push(
      `在元素分布方面，${elementParts.join('、')}。` +
      `${ELEMENT_NAMES[dominantElement]}的能量占据主导，` +
      `${dominantElement === 'wands' ? '提示你需要发挥行动力和创造力，勇敢追求目标。' : ''}` +
      `${dominantElement === 'cups' ? '提示你关注情感世界和人际关系，用心感受而非仅凭理性判断。' : ''}` +
      `${dominantElement === 'swords' ? '提示你需要清晰的思维和果断的决策，用智慧和逻辑应对挑战。' : ''}` +
      `${dominantElement === 'pentacles' ? '提示你注重实际成果和物质基础，稳步构建长期的价值。' : ''}`
    )
  }

  if (reversedCount > uprightCount) {
    parts.push(
      `本次占卜中逆位牌出现了 ${reversedCount} 张（${Math.round((reversedCount / total) * 100)}%），` +
      `逆位能量偏强提示当前可能存在内在的抗拒、延迟的能量或需要反思的阴影面。` +
      `这不是坏消息，而是提醒你审视那些被你忽略或压抑的方面，逆位是内在成长的邀请函。`
    )
  } else if (uprightCount > reversedCount) {
    parts.push(
      `本次占卜中正位牌出现了 ${uprightCount} 张（${Math.round((uprightCount / total) * 100)}%），` +
      `正位能量占据主导，意味着当前的能量流动较为顺畅，积极因素和建设性力量在支持着你。` +
      `这是一个顺势而为的好时机，勇敢迈出步伐，宇宙在给予你正面的回应。`
    )
  } else {
    parts.push(
      `正位与逆位各占一半，表明当前课题处于一种动态平衡状态。` +
      `机遇与挑战并存，每个选择都具有两面性，需要你综合考量、审慎决策。`
    )
  }

  parts.push(
    `综合以上分析，请将塔罗牌的智慧作为一面镜子来照见自己的内心，而非绝对的预言。` +
    `每一张牌都反映了你当下意识的一个侧面，最终的走向取决于你的自由意志和行动。` +
    `愿这份解读为你带来启发与指引。`
  )

  return parts.join('\n\n')
}

const summaryParagraphs = computed(() => {
  if (!summary.value.text) return []
  return summary.value.text.split('\n\n').filter(p => p.trim())
})

// ==================== 元素百分比计算 ====================
function getElementPercent(count) {
  const total = summary.value.minorCount || 1
  return Math.round((count / total) * 100)
}

// ==================== 环形图数据 ====================
function getUprightDashArray() {
  const circumference = 2 * Math.PI * 50
  return (summary.value.uprightPercent / 100) * circumference
}

function getReversedDashArray() {
  const circumference = 2 * Math.PI * 50
  return (summary.value.reversedPercent / 100) * circumference
}

// ==================== 动画可见性状态 ====================
const headerVisible = ref(false)
const spreadVisible = ref(false)
const readingVisible = reactive({})
const spiritualVisible = ref(false)
const elementsVisible = ref(false)
const ratioVisible = ref(false)
const comprehensiveVisible = ref(false)

// ==================== DOM 引用 ====================
const headerSection = ref(null)
const spreadSection = ref(null)
const readingCardRefs = ref([])
const spiritualCardRef = ref(null)
const elementsCardRef = ref(null)
const ratioCardRef = ref(null)
const comprehensiveCardRef = ref(null)

// ==================== IntersectionObserver 滚动触发动画 ====================
let observer = null

onMounted(() => {
  // 标题区域立即显示
  nextTick(() => {
    headerVisible.value = true

    // 牌阵区域在下一次 tick 显示并触发翻转
    setTimeout(() => {
      spreadVisible.value = true
      triggerCardFlips()
    }, 300)
  })

  // 创建 IntersectionObserver 监听滚动触发元素
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target
          const dataSection = target.dataset.section
          const dataIndex = target.dataset.index

          if (dataSection === 'reading' && dataIndex !== undefined) {
            readingVisible[dataIndex] = true
          } else if (dataSection === 'spiritual') {
            spiritualVisible.value = true
          } else if (dataSection === 'elements') {
            elementsVisible.value = true
          } else if (dataSection === 'ratio') {
            ratioVisible.value = true
          } else if (dataSection === 'comprehensive') {
            comprehensiveVisible.value = true
          }

          observer.unobserve(target)
        }
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  )

  // 在 nextTick 后注册观察目标
  nextTick(() => {
    // 逐牌解读卡片
    readingCardRefs.value.forEach((el, index) => {
      if (el) {
        el.dataset.section = 'reading'
        el.dataset.index = String(index)
        observer.observe(el)
      }
    })

    // 综合解读子卡片
    if (spiritualCardRef.value) {
      spiritualCardRef.value.dataset.section = 'spiritual'
      observer.observe(spiritualCardRef.value)
    }
    if (elementsCardRef.value) {
      elementsCardRef.value.dataset.section = 'elements'
      observer.observe(elementsCardRef.value)
    }
    if (ratioCardRef.value) {
      ratioCardRef.value.dataset.section = 'ratio'
      observer.observe(ratioCardRef.value)
    }
    if (comprehensiveCardRef.value) {
      comprehensiveCardRef.value.dataset.section = 'comprehensive'
      observer.observe(comprehensiveCardRef.value)
    }
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})

// ==================== 牌面翻转序列触发 ====================
function triggerCardFlips() {
  const cells = gridCells.value.filter(c => c.card)
  cells.forEach((cell, index) => {
    setTimeout(() => {
      flipStates[cell.key] = true
    }, index * 500)
  })
}
</script>

<style scoped>
/* ==========================================================================
   ResultPage - 神秘学 / 暗黑金色 / 神谕启示风格
   色彩体系：深色背景 #0a0a12 / 卡片 #13131f / 金色 #c9a84c / 紫色 #4a1e6e
   ========================================================================== */

/* ==================== 页面容器 ==================== */
.result-page {
  min-height: 100vh;
  padding-top: 60px;
  padding-bottom: 80px;
  position: relative;
  z-index: 1;
}

/* ==================== 星尘粒子背景 ==================== */
.star-field {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.star-field__particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(232, 212, 139, 0.8) 0%, rgba(201, 168, 76, 0) 70%);
  animation: starBreath 3s ease-in-out infinite;
  will-change: opacity, transform;
}

@keyframes starBreath {
  0%, 100% { opacity: 0.15; transform: scale(1); }
  30% { opacity: 0.7; transform: scale(1.8); }
  50% { opacity: 0.25; transform: scale(0.9); }
  70% { opacity: 0.6; transform: scale(1.5); }
}

/* ==================== 金色神秘分隔线 ==================== */
.mystic-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  max-width: 500px;
  margin: 52px auto;
  padding: 0 24px;
}

.mystic-divider__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-gold);
  opacity: 0.4;
  flex-shrink: 0;
  animation: dividerPulse 3s ease-in-out infinite;
}

.mystic-divider__line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.3), transparent);
  max-width: 100px;
}

.mystic-divider__diamond {
  font-size: 0.75rem;
  color: var(--color-gold);
  opacity: 0.45;
  animation: dividerPulse 3s ease-in-out infinite;
}

@keyframes dividerPulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.2); }
}

/* ==================== 区域标题 ==================== */
.section-title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-gold);
  margin-bottom: 36px;
  text-align: center;
  letter-spacing: 0.1em;
  position: relative;
  text-shadow: 0 0 30px rgba(201, 168, 76, 0.25);
}

.section-title::before,
.section-title::after {
  content: '✦';
  font-size: 0.6rem;
  margin: 0 16px;
  opacity: 0.3;
  vertical-align: middle;
}

/* ==================== 二、页面标题仪式感 ==================== */
.result-header {
  max-width: 800px;
  margin: 0 auto;
  padding: 52px 24px 32px;
  text-align: center;
  position: relative;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.result-header.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.result-header__ornament {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  animation: ornamentAppear 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes ornamentAppear {
  from { opacity: 0; transform: scale(0.4) rotate(-90deg); }
  to { opacity: 1; transform: scale(1) rotate(0deg); }
}

.result-header__title {
  font-family: var(--font-display);
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--color-gold);
  margin-bottom: 20px;
  letter-spacing: 0.15em;
  text-shadow:
    0 0 30px rgba(201, 168, 76, 0.4),
    0 0 60px rgba(201, 168, 76, 0.15);
  background: linear-gradient(
    180deg,
    var(--color-gold-light) 0%,
    var(--color-gold) 40%,
    var(--color-gold-dark) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 金色装饰分隔线（中间嵌太阳符号） */
.result-header__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  max-width: 320px;
  margin: 0 auto;
}

.result-header__divider-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(201, 168, 76, 0.15),
    rgba(201, 168, 76, 0.45),
    rgba(201, 168, 76, 0.6),
    rgba(201, 168, 76, 0.45),
    rgba(201, 168, 76, 0.15),
    transparent
  );
}

.result-header__divider-symbol {
  font-size: 1.4rem;
  color: var(--color-gold);
  opacity: 0.6;
  flex-shrink: 0;
  animation: dividerPulse 3s ease-in-out infinite;
}

/* ==================== 未找到状态 ==================== */
.result-not-found {
  max-width: 480px;
  margin: 80px auto;
  text-align: center;
  padding: 56px 24px;
  border: 1px solid rgba(201, 168, 76, 0.15);
  border-radius: var(--radius-md);
  background: rgba(18, 14, 26, 0.7);
  position: relative;
}

.result-not-found__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: var(--color-gold);
  opacity: 0.3;
}

.result-not-found__title {
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: var(--color-gold);
  margin-bottom: 10px;
}

.result-not-found__text {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 28px;
}

.result-not-found__btn {
  display: inline-flex;
}

/* ==================== 三、牌阵布局区域——核心视觉焦点 ==================== */
.spread-visual {
  max-width: 900px;
  margin: 0 auto 32px;
  padding: 48px 32px;
  position: relative;
  opacity: 0;
  transform: translateY(15px);
  transition: opacity 0.7s ease 0.15s, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s;
}

.spread-visual.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* 金色光晕放射背景——模拟「神谕降临」 */
.spread-visual__aura {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150%;
  padding-bottom: 150%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background:
    radial-gradient(ellipse at center, rgba(201, 168, 76, 0.08) 0%, transparent 30%),
    radial-gradient(ellipse at center, rgba(201, 168, 76, 0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 25% 25%, rgba(232, 212, 139, 0.06) 0%, transparent 35%),
    radial-gradient(ellipse at 75% 75%, rgba(201, 168, 76, 0.05) 0%, transparent 35%);
  pointer-events: none;
  z-index: 0;
  animation: auraBreathe 5s ease-in-out infinite;
}

@keyframes auraBreathe {
  0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.06); }
}

.spread-visual__grid {
  display: grid;
  gap: 24px;
  max-width: 750px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.spread-visual__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 140px;
}

.spread-visual__cell--empty {
  border: 1px dashed rgba(201, 168, 76, 0.15);
  border-radius: var(--radius-sm);
  background: rgba(45, 31, 78, 0.06);
}

/* ==================== 牌面 3D 翻转容器 ==================== */
.spread-visual__flip-container {
  perspective: 1200px;
  width: 100px;
  height: 160px;
}

.spread-visual__flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-style: preserve-3d;
}

.spread-visual__flip-container.is-flipped .spread-visual__flip-inner {
  transform: rotateY(180deg);
}

/* 牌背（初始可见） */
.spread-visual__card-back,
.spread-visual__card-front {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: var(--radius-sm);
}

.spread-visual__card-back {
  background: linear-gradient(
    135deg,
    rgba(18, 14, 26, 0.95),
    rgba(26, 20, 40, 0.98)
  );
  border: 2px solid rgba(201, 168, 76, 0.3);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.5),
    inset 0 0 40px rgba(201, 168, 76, 0.05);
}

.spread-visual__card-back-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 8px,
      rgba(201, 168, 76, 0.03) 8px,
      rgba(201, 168, 76, 0.03) 9px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 8px,
      rgba(201, 168, 76, 0.03) 8px,
      rgba(201, 168, 76, 0.03) 9px
    );
}

/* 牌面（翻转后显示） */
.spread-visual__card-front {
  transform: rotateY(180deg);
  border: 2px solid var(--color-gold);
  box-shadow:
    0 4px 28px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(201, 168, 76, 0.2);
  overflow: hidden;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.spread-visual__card-front:hover {
  box-shadow:
    0 6px 36px rgba(0, 0, 0, 0.6),
    0 0 35px rgba(201, 168, 76, 0.35);
  border-color: var(--color-gold-light);
}

.spread-visual__card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: calc(var(--radius-sm) - 1px);
  transition: transform 0.4s ease;
}

.spread-visual__card-img--reversed {
  transform: rotate(180deg);
}

.spread-visual__card-front:hover .spread-visual__card-img {
  transform: scale(1.06);
}

.spread-visual__card-front:hover .spread-visual__card-img--reversed {
  transform: rotate(180deg) scale(1.06);
}

/* 粒子爆发效果 */
.spread-visual__particle-burst {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  pointer-events: none;
}

.spread-visual__particle-burst::before,
.spread-visual__particle-burst::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(232, 212, 139, 0.8), transparent);
  animation: particleBurst 1s ease-out forwards;
}

.spread-visual__particle-burst::before {
  width: 6px;
  height: 6px;
  animation-name: particleFly1;
}

.spread-visual__particle-burst::after {
  width: 4px;
  height: 4px;
  animation-name: particleFly2;
  animation-delay: 0.15s;
}

@keyframes particleFly1 {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(-30px, -40px) scale(0); opacity: 0; }
}

@keyframes particleFly2 {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(25px, -35px) scale(0); opacity: 0; }
}

/* 多粒子补充 */
.spread-visual__particle-burst {
  box-shadow:
    0 0 0 0 transparent,
    0 0 0 0 transparent,
    0 0 0 0 transparent,
    0 0 0 0 transparent,
    0 0 0 0 transparent;
  animation: particleBurstShadow 1s ease-out forwards;
}

@keyframes particleBurstShadow {
  0% {
    box-shadow:
      0 0 0 0 rgba(232, 212, 139, 0.9),
      0 0 0 0 rgba(201, 168, 76, 0.8),
      0 0 0 0 rgba(232, 212, 139, 0.7),
      0 0 0 0 rgba(201, 168, 76, 0.6),
      0 0 0 0 rgba(232, 212, 139, 0.5);
  }
  100% {
    box-shadow:
      -25px -35px 3px 0px rgba(232, 212, 139, 0),
      20px -30px 2px 0px rgba(201, 168, 76, 0),
      -15px -45px 2px 0px rgba(232, 212, 139, 0),
      30px -20px 3px 0px rgba(201, 168, 76, 0),
      10px -40px 2px 0px rgba(232, 212, 139, 0);
  }
}

/* 正逆位标识 */
.spread-visual__orientation {
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 3px 12px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  white-space: nowrap;
  z-index: 3;
}

.spread-visual__orientation--upright {
  background: linear-gradient(135deg, var(--color-gold), var(--color-gold-dark));
  color: var(--color-bg-primary);
  box-shadow: 0 2px 10px rgba(201, 168, 76, 0.35);
}

.spread-visual__orientation--reversed {
  background: linear-gradient(135deg, var(--color-purple), var(--color-purple-dark));
  color: var(--color-text-primary);
  box-shadow: 0 2px 10px rgba(123, 79, 211, 0.35);
}

.spread-visual__pos-name {
  font-size: 0.8rem;
  color: var(--color-gold);
  font-weight: 600;
  font-family: var(--font-display);
  margin-top: 14px;
  text-align: center;
  letter-spacing: 0.06em;
}

.spread-visual__card-name {
  font-size: 0.74rem;
  color: var(--color-text-secondary);
  text-align: center;
  line-height: 1.3;
}

.spread-visual__empty-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80px;
  border-radius: var(--radius-sm);
}

.spread-visual__empty-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-style: italic;
  opacity: 0.45;
}

/* ==================== 四、逐牌解读区域——卡片式展开 ==================== */
.card-readings {
  max-width: 850px;
  margin: 0 auto 32px;
  padding: 0 24px;
}

/* 解读卡片——羊皮纸质感 */
.reading-card {
  border-radius: var(--radius-md);
  margin-bottom: 32px;
  overflow: hidden;
  position: relative;
  transition: all 0.4s ease;
}

/* 羊皮纸质感背景（渐变 + 噪点模拟） */
.reading-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
  opacity: 0.6;
}

/* 正位卡片 */
.reading-card--upright {
  background: linear-gradient(
    170deg,
    rgba(22, 18, 30, 0.9) 0%,
    rgba(28, 22, 38, 0.88) 30%,
    rgba(24, 18, 32, 0.92) 100%
  );
  border: 1px solid rgba(201, 168, 76, 0.12);
  box-shadow:
    0 6px 32px rgba(0, 0, 0, 0.25),
    inset 0 0 80px rgba(201, 168, 76, 0.02);
}

.reading-card--upright:hover {
  border-color: rgba(201, 168, 76, 0.35);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.35),
    0 0 35px rgba(201, 168, 76, 0.1);
}

/* 逆位卡片 */
.reading-card--reversed {
  background: linear-gradient(
    170deg,
    rgba(22, 18, 30, 0.9) 0%,
    rgba(28, 22, 38, 0.88) 30%,
    rgba(24, 18, 32, 0.92) 100%
  );
  border: 1px solid rgba(123, 79, 211, 0.12);
  box-shadow:
    0 6px 32px rgba(0, 0, 0, 0.25),
    inset 0 0 80px rgba(123, 79, 211, 0.02);
}

.reading-card--reversed:hover {
  border-color: rgba(123, 79, 211, 0.35);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.35),
    0 0 35px rgba(123, 79, 211, 0.1);
}

/* 入场动画 - 从左侧滑入 */
.reading-card {
  opacity: 0;
  transform: translateX(-30px);
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.4s ease, box-shadow 0.4s ease;
}

.reading-card:nth-child(1) { transition-delay: 0s; }
.reading-card:nth-child(2) { transition-delay: 0.15s; }
.reading-card:nth-child(3) { transition-delay: 0.3s; }
.reading-card:nth-child(4) { transition-delay: 0.45s; }
.reading-card:nth-child(5) { transition-delay: 0.6s; }
.reading-card:nth-child(6) { transition-delay: 0.75s; }
.reading-card:nth-child(7) { transition-delay: 0.9s; }
.reading-card:nth-child(8) { transition-delay: 1.05s; }
.reading-card:nth-child(9) { transition-delay: 1.2s; }
.reading-card:nth-child(10) { transition-delay: 1.35s; }

.reading-card.is-visible {
  opacity: 1;
  transform: translateX(0);
}

/* 牌位标题头部 */
.reading-card__header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 28px;
  position: relative;
  z-index: 1;
}

.reading-card--upright .reading-card__header {
  background: linear-gradient(90deg, rgba(201, 168, 76, 0.06), transparent 60%);
  border-bottom: 1px solid rgba(201, 168, 76, 0.06);
}

.reading-card--reversed .reading-card__header {
  background: linear-gradient(90deg, rgba(123, 79, 211, 0.06), transparent 60%);
  border-bottom: 1px solid rgba(123, 79, 211, 0.06);
}

/* 正逆位方向指示器 */
.reading-card__orientation-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.reading-card__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.reading-card__arrow--up {
  color: var(--color-gold);
  background: rgba(201, 168, 76, 0.1);
  border: 1px solid rgba(201, 168, 76, 0.25);
}

.reading-card__arrow--down {
  color: #a0a0b0;
  background: rgba(160, 160, 176, 0.1);
  border: 1px solid rgba(160, 160, 176, 0.25);
}

.reading-card__orientation-text {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.reading-card--upright .reading-card__orientation-text {
  color: var(--color-gold);
}

.reading-card--reversed .reading-card__orientation-text {
  color: #a0a0b0;
}

.reading-card__pos-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-gold);
  font-family: var(--font-display);
  letter-spacing: 0.06em;
}

/* 卡片主体内容 */
.reading-card__body {
  display: flex;
  gap: 28px;
  padding: 24px 28px 28px;
  position: relative;
  z-index: 1;
}

/* 牌面缩略图 */
.reading-card__image-wrap {
  flex-shrink: 0;
  position: relative;
  width: 120px;
  height: 185px;
}

.reading-card__image-glow {
  position: absolute;
  inset: -6px;
  border-radius: var(--radius-sm);
  background: radial-gradient(ellipse at center, rgba(201, 168, 76, 0.15), transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.reading-card__image-wrap:hover .reading-card__image-glow {
  opacity: 1;
}

.reading-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(201, 168, 76, 0.2);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.45),
    0 0 12px rgba(201, 168, 76, 0.06);
  transition: all 0.4s ease;
  position: relative;
  z-index: 1;
}

.reading-card__image--reversed {
  transform: rotate(180deg);
}

.reading-card__image-wrap:hover .reading-card__image {
  transform: scale(1.06);
  border-color: var(--color-gold);
  box-shadow:
    0 6px 28px rgba(0, 0, 0, 0.55),
    0 0 22px rgba(201, 168, 76, 0.18);
}

.reading-card__image-wrap:hover .reading-card__image--reversed {
  transform: rotate(180deg) scale(1.06);
}

/* 解读内容 */
.reading-card__content {
  flex: 1;
  min-width: 0;
}

/* 牌名中文 */
.reading-card__card-name-zh {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-gold);
  margin-bottom: 2px;
  text-shadow: 0 0 20px rgba(201, 168, 76, 0.15);
}

/* 牌名英文 */
.reading-card__card-name-en {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  font-style: italic;
  margin-bottom: 16px;
}

/* 关键词胶囊标签 */
.reading-card__keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}

.reading-card__keyword-tag {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  background: rgba(201, 168, 76, 0.08);
  color: var(--color-gold-light);
  border: 1px solid rgba(201, 168, 76, 0.2);
  transition: all 0.25s ease;
  cursor: default;
}

.reading-card__keyword-tag:hover {
  background: rgba(201, 168, 76, 0.16);
  border-color: var(--color-gold);
  transform: scale(1.06);
}

/* 牌位含义（引号装饰） */
.reading-card__pos-meaning {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin-bottom: 18px;
  padding: 12px 16px;
  background: rgba(123, 79, 211, 0.04);
  border-radius: var(--radius-sm);
  border-left: 2px solid rgba(123, 79, 211, 0.2);
}

.reading-card__pos-meaning-quote {
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--color-purple-light);
  opacity: 0.4;
  line-height: 1;
  flex-shrink: 0;
}

.reading-card__pos-meaning-text {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
  font-style: italic;
}

/* 解读正文 */
.reading-card__reading {
  padding: 18px 20px;
  border-radius: var(--radius-sm);
  position: relative;
}

.reading-card--upright .reading-card__reading {
  background: rgba(201, 168, 76, 0.025);
  border: 1px solid rgba(201, 168, 76, 0.07);
}

.reading-card--reversed .reading-card__reading {
  background: rgba(123, 79, 211, 0.025);
  border: 1px solid rgba(123, 79, 211, 0.07);
}

.reading-card__reading-text {
  font-size: 0.94rem;
  color: var(--color-text-primary);
  line-height: 2;
  font-style: italic;
}

/* ==================== 五、综合解读区域——分段递进展示 ==================== */
.summary-section {
  max-width: 850px;
  margin: 0 auto 80px;
  padding: 0 24px;
}

.summary-cards {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 综合解读子卡片 */
.summary-card {
  border-radius: var(--radius-md);
  padding: 28px 28px;
  position: relative;
  transition: all 0.45s ease;
  border: 1px solid rgba(201, 168, 76, 0.08);
  background: linear-gradient(
    160deg,
    rgba(20, 16, 30, 0.85),
    rgba(24, 18, 34, 0.82)
  );
}

.summary-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.02'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}

.summary-card:hover {
  border-color: rgba(201, 168, 76, 0.28);
  box-shadow: 0 0 24px rgba(201, 168, 76, 0.06);
}

/* 入场动画 - 从下方淡入上移 */
.summary-card {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.4s ease, box-shadow 0.4s ease;
}

.summary-card:nth-child(1) { transition-delay: 0.05s; }
.summary-card:nth-child(2) { transition-delay: 0.25s; }
.summary-card:nth-child(3) { transition-delay: 0.45s; }
.summary-card:nth-child(4) { transition-delay: 0.65s; }

.summary-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* 卡片图标 */
.summary-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.summary-card__icon--spiritual {
  background: rgba(201, 168, 76, 0.1);
  color: var(--color-gold-light);
  border: 1px solid rgba(201, 168, 76, 0.2);
}

.summary-card__icon--elements {
  background: rgba(123, 79, 211, 0.1);
  color: var(--color-purple-light);
  border: 1px solid rgba(123, 79, 211, 0.2);
}

.summary-card__icon--ratio {
  background: rgba(74, 158, 255, 0.08);
  color: #6babf0;
  border: 1px solid rgba(74, 158, 255, 0.2);
}

.summary-card__icon--comprehensive {
  background: rgba(201, 168, 76, 0.12);
  color: var(--color-gold);
  border: 1px solid rgba(201, 168, 76, 0.25);
}

/* 卡片标题 */
.summary-card__title {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-gold);
  margin-bottom: 16px;
  letter-spacing: 0.08em;
  position: relative;
  z-index: 1;
}

.summary-card__stat {
  font-size: 0.9rem;
  color: var(--color-text-primary);
  margin-bottom: 10px;
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

.summary-card__stat strong {
  color: var(--color-gold-light);
  font-size: 1.05rem;
}

.summary-card__desc {
  font-size: 0.84rem;
  color: var(--color-text-muted);
  line-height: 1.8;
  position: relative;
  z-index: 1;
}

/* ==================== 元素分布可视化 ==================== */
.summary-card__elements {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.summary-card__element {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  background: rgba(0, 0, 0, 0.15);
  transition: all 0.25s ease;
}

.summary-card__element:hover {
  background: rgba(201, 168, 76, 0.06);
}

.summary-card__element-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.summary-card__element--fire .summary-card__element-color {
  background: #ff6b35;
  box-shadow: 0 0 8px rgba(255, 107, 53, 0.4);
}

.summary-card__element--water .summary-card__element-color {
  background: #4a9eff;
  box-shadow: 0 0 8px rgba(74, 158, 255, 0.4);
}

.summary-card__element--air .summary-card__element-color {
  background: #d4d46a;
  box-shadow: 0 0 8px rgba(212, 212, 106, 0.4);
}

.summary-card__element--earth .summary-card__element-color {
  background: #6b9e6b;
  box-shadow: 0 0 8px rgba(107, 158, 107, 0.4);
}

.summary-card__element-label {
  font-size: 0.82rem;
  color: var(--color-text-secondary);
  width: 80px;
  flex-shrink: 0;
}

.summary-card__element-bar-wrap {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.summary-card__element--fire .summary-card__element-bar {
  background: linear-gradient(90deg, #ff6b35, #ff8c5a);
  height: 100%;
  border-radius: 4px;
  transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.summary-card__element--water .summary-card__element-bar {
  background: linear-gradient(90deg, #4a9eff, #6bb5ff);
  height: 100%;
  border-radius: 4px;
  transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.summary-card__element--air .summary-card__element-bar {
  background: linear-gradient(90deg, #d4d46a, #e0e080);
  height: 100%;
  border-radius: 4px;
  transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.summary-card__element--earth .summary-card__element-bar {
  background: linear-gradient(90deg, #6b9e6b, #8ab88a);
  height: 100%;
  border-radius: 4px;
  transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.summary-card__element-count {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-gold-light);
  flex-shrink: 0;
  width: 32px;
  text-align: right;
}

/* ==================== 环形比例图 ==================== */
.summary-card__ring-wrap {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.summary-card__ring {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.summary-card__ring-upright {
  transition: stroke-dasharray 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.summary-card__ring-reversed {
  transition: stroke-dasharray 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.summary-card__ring-labels {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-card__ring-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.84rem;
  color: var(--color-text-secondary);
}

.summary-card__ring-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.summary-card__ring-dot--gold {
  background: var(--color-gold);
  box-shadow: 0 0 6px rgba(201, 168, 76, 0.5);
}

.summary-card__ring-dot--purple {
  background: var(--color-purple-light);
  box-shadow: 0 0 6px rgba(167, 139, 250, 0.5);
}

/* ==================== 综合解读压轴卡片 ==================== */
.summary-card--comprehensive {
  border-color: rgba(201, 168, 76, 0.15);
  background: linear-gradient(
    160deg,
    rgba(22, 16, 32, 0.88),
    rgba(26, 18, 36, 0.85)
  );
}

.summary-card--comprehensive:hover {
  border-color: rgba(201, 168, 76, 0.4);
}

.summary-card__reading {
  position: relative;
  z-index: 1;
  padding: 20px;
  border-radius: var(--radius-sm);
  background: radial-gradient(ellipse at 50% 0%, rgba(201, 168, 76, 0.03), transparent 70%);
  border: 1px solid rgba(201, 168, 76, 0.06);
}

.summary-card__reading-para {
  font-size: 0.96rem;
  color: var(--color-text-primary);
  line-height: 2.2;
  font-style: italic;
  margin-bottom: 18px;
}

.summary-card__reading-para:last-child {
  margin-bottom: 0;
}

/* ==================== 响应式 ==================== */
@media (max-width: 767px) {
  .result-page {
    padding-top: 0;
    padding-bottom: 40px;
  }

  .result-header {
    padding: 28px 16px 20px;
  }

  .result-header__title {
    font-size: 1.9rem;
  }

  .result-header__divider {
    max-width: 240px;
  }

  .spread-visual {
    padding: 32px 14px;
    margin: 0 8px 24px;
  }

  .spread-visual__grid {
    gap: 14px;
  }

  .spread-visual__flip-container {
    width: 76px;
    height: 122px;
  }

  .spread-visual__cell {
    min-height: 100px;
  }

  .spread-visual__pos-name {
    font-size: 0.7rem;
  }

  .spread-visual__card-name {
    font-size: 0.64rem;
  }

  .spread-visual__orientation {
    font-size: 0.6rem;
    padding: 2px 8px;
    bottom: -8px;
  }

  .spread-visual__aura {
    width: 180%;
    padding-bottom: 180%;
  }

  .mystic-divider {
    margin: 36px auto;
  }

  .card-readings {
    padding: 0 12px;
  }

  .reading-card__header {
    padding: 14px 16px;
    gap: 10px;
  }

  .reading-card__body {
    flex-direction: column;
    align-items: center;
    padding: 18px 16px;
    gap: 20px;
  }

  .reading-card__image-wrap {
    width: 90px;
    height: 140px;
  }

  .reading-card__card-name-zh {
    text-align: center;
  }

  .reading-card__card-name-en {
    text-align: center;
  }

  .reading-card__keywords {
    justify-content: center;
  }

  .summary-section {
    padding: 0 12px;
  }

  .summary-card {
    padding: 20px 16px;
  }

  .summary-card__ring-wrap {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .summary-card__ring {
    width: 100px;
    height: 100px;
  }

  .section-title {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .spread-visual__flip-container {
    width: 62px;
    height: 100px;
  }

  .spread-visual__grid {
    gap: 10px;
  }

  .result-header__title {
    font-size: 1.5rem;
  }

  .spread-visual__pos-name {
    font-size: 0.64rem;
  }

  .spread-visual__card-name {
    font-size: 0.6rem;
  }

  .reading-card__image-wrap {
    width: 72px;
    height: 112px;
  }

  .reading-card__pos-title {
    font-size: 0.9rem;
  }

  .reading-card__card-name-zh {
    font-size: 1rem;
  }

  .summary-card {
    padding: 16px 14px;
  }

  .summary-card__ring {
    width: 80px;
    height: 80px;
  }
}

/* 平板端 */
@media (min-width: 768px) and (max-width: 1023px) {
  .spread-visual {
    max-width: 92%;
  }

  .spread-visual__flip-container {
    width: 84px;
    height: 134px;
  }

  .card-readings {
    max-width: 92%;
  }

  .summary-section {
    max-width: 92%;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .reading-card:active {
    transform: scale(0.98) !important;
    transition: transform 0.1s ease !important;
  }

  .summary-card:active {
    border-color: rgba(201, 168, 76, 0.3);
    background: rgba(201, 168, 76, 0.03);
  }

  .spread-visual__card-front:active {
    transform: scale(0.95);
    transition: transform 0.08s ease;
  }
}
</style>
