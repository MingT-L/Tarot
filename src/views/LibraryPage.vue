<template>
  <div class="library-page">
    <!-- 星尘粒子背景 -->
    <StarryBackground />

    <!-- 顶部装饰 -->
    <header class="library-header">
      <div class="header-ornament">
        <svg width="80" height="24" viewBox="0 0 80 24" fill="none">
          <path d="M0 12 L20 12 L28 4 L36 12 L44 4 L52 12 L60 4 L68 12 L80 12"
                stroke="url(#headerGradient)" stroke-width="0.8" fill="none" opacity="0.4"/>
          <circle cx="40" cy="12" r="2" fill="#c9a84c" opacity="0.5"/>
          <circle cx="40" cy="12" r="4" stroke="#c9a84c" stroke-width="0.5" fill="none" opacity="0.3"/>
          <defs>
            <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#c9a84c" stop-opacity="0"/>
              <stop offset="50%" stop-color="#c9a84c" stop-opacity="1"/>
              <stop offset="100%" stop-color="#c9a84c" stop-opacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h1 class="library-title gold-text-glow">塔罗牌库</h1>
      <p class="library-subtitle">
        <span class="subtitle-ornament">✦</span>
        共 <span class="count-highlight">{{ allCards.length }}</span> 张神秘牌卡
        <span class="subtitle-ornament">✦</span>
      </p>
    </header>

    <!-- 神秘分隔线 -->
    <div class="mystic-divider">
      <span class="mystic-divider__line mystic-divider__line--left"></span>
      <div class="mystic-divider__center">
        <span class="mystic-divider__dot"></span>
        <span class="mystic-divider__diamond">◆</span>
        <span class="mystic-divider__dot"></span>
      </div>
      <span class="mystic-divider__line mystic-divider__line--right"></span>
    </div>

    <!-- 分类筛选栏 -->
    <CardFilter
      v-model="activeCategory"
      :categories="filterCategories"
    />

    <!-- 牌卡网格 -->
    <div class="cards-grid" v-if="filteredCards.length > 0">
      <div
        v-for="(card, index) in filteredCards"
        :key="card.id"
        class="card-wrapper"
        :style="{ '--delay': `${index * 0.08}s` }"
      >
        <TarotCard
          :card="card"
          @click="openDetail(card)"
        />
        <div class="card-glow-effect"></div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-state__icon">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="30" r="28" stroke="currentColor" stroke-width="0.8" stroke-dasharray="4 4" opacity="0.3"/>
          <path d="M30 10 L33 25 L48 28 L33 31 L30 46 L27 31 L12 28 L27 25 Z"
                stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.4"/>
          <circle cx="30" cy="30" r="3" fill="currentColor" opacity="0.5"/>
        </svg>
      </div>
      <p class="empty-state__text">星空中暂无此命名的牌卡</p>
      <p class="empty-state__hint">请尝试选择其他分类</p>
    </div>

    <!-- 全屏详情模态框 -->
    <Transition name="modal-expand">
      <CardDetailModal
        v-if="selectedCard"
        :card="selectedCard"
        :visible="modalVisible"
        @close="closeDetail"
      />
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCardStore } from '@/stores/cardStore'
import TarotCard from '@/components/TarotCard.vue'
import CardFilter from '@/components/CardFilter.vue'
import CardDetailModal from '@/components/CardDetailModal.vue'
import StarryBackground from '@/components/StarryBackground.vue'

const cardStore = useCardStore()

const activeCategory = ref('all')

const modalVisible = ref(false)

const selectedCard = ref(null)

const filterCategories = computed(() => [
  { key: 'all', label: '全部', count: cardStore.cards.length },
  { key: 'major', label: '大阿卡纳', count: cardStore.majorArcana.length },
  { key: 'wands', label: '权杖', count: cardStore.wandsCards.length },
  { key: 'cups', label: '圣杯', count: cardStore.cupsCards.length },
  { key: 'swords', label: '宝剑', count: cardStore.swordsCards.length },
  { key: 'pentacles', label: '星币', count: cardStore.pentaclesCards.length }
])

const allCards = computed(() => cardStore.cards)

const filteredCards = computed(() => {
  if (activeCategory.value === 'all') {
    return allCards.value
  }
  const categoryMap = {
    major: cardStore.majorArcana,
    wands: cardStore.wandsCards,
    cups: cardStore.cupsCards,
    swords: cardStore.swordsCards,
    pentacles: cardStore.pentaclesCards
  }
  return categoryMap[activeCategory.value] || []
})

function openDetail(card) {
  selectedCard.value = card
  modalVisible.value = true
}

function closeDetail() {
  modalVisible.value = false
  setTimeout(() => {
    selectedCard.value = null
  }, 500)
}
</script>

<style scoped>
/* ===== 页面容器 ===== */
.library-page {
  min-height: 100vh;
  padding: 40px 0 80px;
  position: relative;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(74, 30, 110, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(201, 168, 76, 0.06) 0%, transparent 45%),
    radial-gradient(ellipse at 50% 50%, rgba(20, 15, 35, 0.2) 0%, transparent 60%),
    linear-gradient(180deg, #0a0a12 0%, #0d0b16 50%, #0a0a12 100%);
}

/* ===== 顶部装饰 ===== */
.header-ornament {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  animation: ornamentFadeIn 1.2s ease-out;
}

@keyframes ornamentFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ===== 标题区域 ===== */
.library-header {
  text-align: center;
  padding: 20px 16px 12px;
  position: relative;
  animation: headerSlideDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes headerSlideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.library-title {
  font-family: var(--font-display), 'Cinzel Decorative', 'Noto Serif SC', serif;
  font-size: 2.8rem;
  font-weight: 700;
  color: #c9a84c;
  margin-bottom: 12px;
  letter-spacing: 0.15em;
  text-shadow:
    0 0 40px rgba(201, 168, 76, 0.5),
    0 0 80px rgba(201, 168, 76, 0.25),
    0 4px 8px rgba(0, 0, 0, 0.8);
}

.library-subtitle {
  font-size: 1rem;
  color: rgba(232, 228, 218, 0.6);
  font-style: italic;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.subtitle-ornament {
  font-size: 0.7rem;
  color: #c9a84c;
  opacity: 0.5;
  animation: ornamentPulse 3s ease-in-out infinite;
}

.subtitle-ornament:last-child {
  animation-delay: 1.5s;
}

@keyframes ornamentPulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.2); }
}

.count-highlight {
  color: #e8d48b;
  font-weight: 700;
  font-size: 1.15rem;
  text-shadow: 0 0 20px rgba(201, 168, 76, 0.5);
}

/* ===== 金色神秘分隔线 ===== */
.mystic-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  max-width: 400px;
  margin: 20px auto 24px;
  padding: 0 24px;
  animation: dividerExpand 1s ease-out 0.3s both;
}

@keyframes dividerExpand {
  from {
    opacity: 0;
    transform: scaleX(0);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

.mystic-divider__line {
  flex: 1;
  height: 1px;
  max-width: 120px;
}

.mystic-divider__line--left {
  background: linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.3));
}

.mystic-divider__line--right {
  background: linear-gradient(90deg, rgba(201, 168, 76, 0.3), transparent);
}

.mystic-divider__center {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mystic-divider__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #c9a84c;
  opacity: 0.4;
  animation: dotPulse 2.5s ease-in-out infinite;
}

.mystic-divider__dot:last-child {
  animation-delay: 1.25s;
}

@keyframes dotPulse {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 0.8; transform: scale(1.2); }
}

.mystic-divider__diamond {
  font-size: 0.6rem;
  color: #c9a84c;
  opacity: 0.5;
  animation: diamondRotate 4s linear infinite;
}

@keyframes diamondRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ===== 牌卡网格 ===== */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 16px 24px 60px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.card-wrapper {
  position: relative;
  animation: cardRitualAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) var(--delay, 0s) both;
}

.card-wrapper:nth-child(n+17) {
  --delay: 1.28s;
}

@keyframes cardRitualAppear {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.9) rotateX(15deg);
    filter: blur(4px);
  }
  60% {
    opacity: 0.6;
    filter: blur(1px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0deg);
    filter: blur(0);
  }
}

.card-glow-effect {
  position: absolute;
  inset: -20px;
  background: radial-gradient(
    ellipse at center,
    rgba(201, 168, 76, 0.08) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
  z-index: -1;
}

.card-wrapper:hover .card-glow-effect {
  opacity: 1;
  animation: glowExpand 2s ease-in-out infinite;
}

@keyframes glowExpand {
  0%, 100% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

/* 平板端：3 列 */
@media (min-width: 640px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    padding: 16px 32px 60px;
  }
}

/* 桌面端：4-5 列 */
@media (min-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 28px;
    padding: 20px 40px 80px;
  }

  .library-title {
    font-size: 3.2rem;
  }

  .library-header {
    padding: 32px 16px 20px;
  }
}

@media (min-width: 1400px) {
  .cards-grid {
    grid-template-columns: repeat(5, 1fr);
    max-width: 1400px;
  }
}

/* 窄屏移动端（320px）优化 */
@media (max-width: 380px) {
  .cards-grid {
    gap: 12px;
    padding: 12px 14px 40px;
  }
}

/* ===== 空状态 ===== */
.empty-state {
  text-align: center;
  padding: 100px 20px;
  position: relative;
}

.empty-state__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  color: #c9a84c;
  animation: emptyIconFloat 3s ease-in-out infinite;
}

@keyframes emptyIconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.empty-state__text {
  font-size: 1.1rem;
  color: rgba(232, 228, 218, 0.7);
  margin-bottom: 8px;
  letter-spacing: 0.05em;
}

.empty-state__hint {
  font-size: 0.85rem;
  color: rgba(201, 168, 76, 0.5);
  font-style: italic;
}

/* ===== 响应式 ===== */
@media (max-width: 767px) {
  .library-page {
    padding: 20px 0 60px;
  }

  .library-title {
    font-size: 2rem;
    letter-spacing: 0.1em;
  }

  .library-subtitle {
    font-size: 0.85rem;
  }

  .mystic-divider {
    margin: 16px auto 20px;
  }

  .header-ornament svg {
    width: 60px;
    height: 20px;
  }
}

/* ===== 触摸设备优化 ===== */
@media (hover: none) and (pointer: coarse) {
  .card-wrapper:hover .card-glow-effect {
    opacity: 0;
  }

  .card-wrapper:active .card-glow-effect {
    opacity: 1;
  }

  .subtitle-ornament {
    animation: none;
    opacity: 0.5;
  }

  .mystic-divider__dot {
    animation: none;
    opacity: 0.5;
  }

  .mystic-divider__diamond {
    animation: none;
  }
}

/* ===== 模态框展开动画 ===== */
.modal-expand-enter-active {
  transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.modal-expand-leave-active {
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-expand-enter-from,
.modal-expand-leave-to {
  opacity: 0;
}
</style>
