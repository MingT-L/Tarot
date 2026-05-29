<template>
  <div
    class="tarot-card-container"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    <div class="tarot-card-inner" :class="{ 'is-flipped': isFlipped }">
      <!-- 正面：牌面 -->
      <div class="tarot-card-face tarot-card-front">
        <div class="card-pattern-border"></div>
        <div class="card-image-wrapper">
          <img
            :src="`${baseUrl}${card.file}`"
            :alt="card.nameCn"
            class="card-image"
            loading="lazy"
            @load="onImageLoad"
            @error="onImageError"
          />
          <div class="card-shine"></div>
        </div>
        <div class="card-front-overlay">
          <span class="card-name-glow">{{ card.nameCn }}</span>
          <span class="card-category-tag">{{ categoryLabel }}</span>
        </div>
        <div class="card-corner card-corner--tl"></div>
        <div class="card-corner card-corner--tr"></div>
        <div class="card-corner card-corner--bl"></div>
        <div class="card-corner card-corner--br"></div>
      </div>

      <!-- 背面：详细信息 -->
      <div class="tarot-card-face tarot-card-back">
        <div class="card-pattern-border"></div>
        <div class="card-back-inner">
          <h3 class="back-title gold-text-glow">{{ card.nameCn }}</h3>
          <p class="back-subtitle">{{ card.nameEn }}</p>

          <div class="back-section">
            <h4 class="back-section-title">
              <span class="back-section-icon">✦</span> 正位解读
            </h4>
            <p class="back-text">{{ card.meaning?.upright || card.description }}</p>
            <div class="back-keywords" v-if="uprightKeywords.length">
              <span
                v-for="kw in uprightKeywords"
                :key="kw"
                class="keyword-pill keyword-pill--upright"
              >{{ kw }}</span>
            </div>
          </div>

          <div class="back-divider">
            <span class="back-divider-line"></span>
            <span class="back-divider-symbol">◆</span>
            <span class="back-divider-line"></span>
          </div>

          <div class="back-section" v-if="card.meaning?.reversed">
            <h4 class="back-section-title back-section-title--reversed">
              <span class="back-section-icon">▼</span> 逆位解读
            </h4>
            <p class="back-text">{{ card.meaning.reversed }}</p>
            <div class="back-keywords" v-if="reversedKeywords.length">
              <span
                v-for="kw in reversedKeywords"
                :key="kw"
                class="keyword-pill keyword-pill--reversed"
              >{{ kw }}</span>
            </div>
          </div>
        </div>
        <div class="card-corner card-corner--tl"></div>
        <div class="card-corner card-corner--tr"></div>
        <div class="card-corner card-corner--bl"></div>
        <div class="card-corner card-corner--br"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { categoryMap } from '@/data/constants'

const baseUrl = import.meta.env.BASE_URL || ''

const props = defineProps({
  card: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click', 'flip'])

const isFlipped = ref(false)

const categoryLabel = computed(() => {
  return categoryMap[props.card.category] || props.card.category
})

const uprightKeywords = computed(() => {
  if (!props.card.keywords?.upright) return []
  return props.card.keywords.upright.split('、').map(k => k.trim()).filter(Boolean).slice(0, 4)
})

const reversedKeywords = computed(() => {
  if (!props.card.keywords?.reversed) return []
  return props.card.keywords.reversed.split('、').map(k => k.trim()).filter(Boolean).slice(0, 4)
})

function handleMouseEnter() {
  isFlipped.value = true
}

function handleMouseLeave() {
  isFlipped.value = false
}

function handleClick() {
  emit('click', props.card)
}

function onImageLoad(event) {
  event.target.classList.add('loaded')
}

function onImageError(event) {
  event.target.classList.add('loaded')
}
</script>

<style scoped>
/* ===== 容器设置 ===== */
.tarot-card-container {
  perspective: 1200px;
  width: 100%;
  aspect-ratio: 3 / 5;
  cursor: pointer;
}

.tarot-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tarot-card-inner.is-flipped {
  transform: rotateY(180deg);
}

/* ===== 卡片正反面通用样式 ===== */
.tarot-card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(145deg, #13131f 0%, #0a0a12 100%);
  border: 1px solid rgba(201, 168, 76, 0.15);
}

.tarot-card-face::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    rgba(201, 168, 76, 0.08) 0%,
    transparent 40%,
    transparent 60%,
    rgba(201, 168, 76, 0.08) 100%
  );
  pointer-events: none;
}

/* ===== 悬停效果 - 卡片上浮和辉光 ===== */
.tarot-card-container:hover .tarot-card-inner {
  transform: translateY(-12px);
}

.tarot-card-container:hover .tarot-card-inner.is-flipped {
  transform: translateY(-12px) rotateY(180deg);
}

.tarot-card-container:hover .tarot-card-face {
  border-color: rgba(201, 168, 76, 0.5);
  box-shadow:
    0 0 40px rgba(201, 168, 76, 0.3),
    0 0 80px rgba(201, 168, 76, 0.15),
    0 0 120px rgba(201, 168, 76, 0.08),
    0 20px 50px rgba(0, 0, 0, 0.6),
    inset 0 0 30px rgba(201, 168, 76, 0.05);
}

/* ===== 四角装饰 ===== */
.card-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: rgba(201, 168, 76, 0.4);
  border-style: solid;
  border-width: 0;
  transition: border-color 0.4s ease;
}

.tarot-card-container:hover .card-corner {
  border-color: rgba(201, 168, 76, 0.8);
}

.card-corner--tl {
  top: 8px;
  left: 8px;
  border-top-width: 2px;
  border-left-width: 2px;
  border-top-left-radius: 4px;
}

.card-corner--tr {
  top: 8px;
  right: 8px;
  border-top-width: 2px;
  border-right-width: 2px;
  border-top-right-radius: 4px;
}

.card-corner--bl {
  bottom: 8px;
  left: 8px;
  border-bottom-width: 2px;
  border-left-width: 2px;
  border-bottom-left-radius: 4px;
}

.card-corner--br {
  bottom: 8px;
  right: 8px;
  border-bottom-width: 2px;
  border-right-width: 2px;
  border-bottom-right-radius: 4px;
}

/* ===== 边框图案 ===== */
.card-pattern-border {
  position: absolute;
  inset: 4px;
  border: 1px solid rgba(201, 168, 76, 0.08);
  border-radius: 10px;
  pointer-events: none;
  transition: border-color 0.4s ease;
}

.tarot-card-container:hover .card-pattern-border {
  border-color: rgba(201, 168, 76, 0.2);
}

/* ===== 正面样式 ===== */
.tarot-card-front {
  transform: rotateY(0deg);
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.4s ease;
  filter: saturate(0.9) contrast(1.05);
}

.tarot-card-container:hover .card-image {
  transform: scale(1.08);
  filter: saturate(1.1) contrast(1.1);
}

.card-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(201, 168, 76, 0.05) 50%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.tarot-card-container:hover .card-shine {
  opacity: 1;
  animation: shineMove 1.5s ease-in-out infinite;
}

@keyframes shineMove {
  0% { transform: translateX(-100%) rotate(35deg); }
  100% { transform: translateX(100%) rotate(35deg); }
}

.card-front-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 12px;
  background: linear-gradient(0deg, rgba(10, 10, 18, 0.95) 0%, rgba(10, 10, 18, 0.6) 60%, transparent 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.card-name-glow {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  color: #e8d48b;
  text-align: center;
  text-shadow: 0 0 20px rgba(201, 168, 76, 0.6), 0 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.08em;
  transition: text-shadow 0.4s ease;
}

.tarot-card-container:hover .card-name-glow {
  text-shadow: 0 0 30px rgba(201, 168, 76, 0.9), 0 0 60px rgba(201, 168, 76, 0.4), 0 2px 4px rgba(0, 0, 0, 0.8);
}

.card-category-tag {
  font-size: 0.65rem;
  color: rgba(201, 168, 76, 0.7);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* ===== 背面样式 ===== */
.tarot-card-back {
  transform: rotateY(180deg);
  background: linear-gradient(145deg, #0f0f1a 0%, #13131f 50%, #0a0a12 100%);
  display: flex;
  align-items: stretch;
  justify-content: center;
}

.card-back-inner {
  width: 100%;
  height: 100%;
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.back-title {
  font-family: var(--font-display);
  font-size: 1.0rem;
  font-weight: 700;
  color: #c9a84c;
  text-align: center;
  margin-bottom: 2px;
  letter-spacing: 0.05em;
}

.back-subtitle {
  font-size: 0.68rem;
  color: rgba(232, 228, 218, 0.5);
  text-align: center;
  font-style: italic;
  margin-bottom: 8px;
  letter-spacing: 0.03em;
}

.back-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 4px;
}

.back-section:last-of-type {
  margin-bottom: 0;
}

.back-section-title {
  font-size: 0.72rem;
  font-weight: 600;
  color: #c9a84c;
  margin-bottom: 3px;
  display: flex;
  align-items: center;
  gap: 4px;
  letter-spacing: 0.04em;
}

.back-section-title--reversed {
  color: #8b5fbf;
}

.back-section-icon {
  font-size: 0.58rem;
  opacity: 0.7;
}

.back-text {
  font-size: 0.68rem;
  color: rgba(232, 228, 218, 0.85);
  line-height: 1.45;
  margin-bottom: 4px;
  flex-shrink: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
}

.back-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
}

.keyword-pill {
  display: inline-flex;
  align-items: center;
  padding: 1.5px 6px;
  border-radius: 6px;
  font-size: 0.62rem;
  font-weight: 500;
  flex-shrink: 0;
}

.keyword-pill--upright {
  background: rgba(201, 168, 76, 0.1);
  color: #e8d48b;
  border: 1px solid rgba(201, 168, 76, 0.18);
}

.keyword-pill--reversed {
  background: rgba(139, 95, 191, 0.1);
  color: #c9a3f0;
  border: 1px solid rgba(139, 95, 191, 0.18);
}

.back-divider {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 6px 0;
}

.back-divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.15), transparent);
}

.back-divider-symbol {
  font-size: 0.45rem;
  color: rgba(201, 168, 76, 0.35);
}

/* ===== 触摸设备优化 ===== */
@media (hover: none) and (pointer: coarse) {
  .tarot-card-container:hover .tarot-card-inner {
    transform: none;
  }

  .tarot-card-container:active .tarot-card-inner {
    transform: rotateY(180deg);
  }

  .tarot-card-container:active .tarot-card-inner.is-flipped {
    transform: rotateY(0deg);
  }

  .tarot-card-container:hover .tarot-card-face {
    box-shadow:
      0 0 20px rgba(201, 168, 76, 0.2),
      0 10px 30px rgba(0, 0, 0, 0.5);
  }
}

/* ===== 窄屏优化 ===== */
@media (max-width: 380px) {
  .card-back-inner {
    padding: 16px 12px;
  }

  .back-title {
    font-size: 0.95rem;
  }

  .back-text {
    font-size: 0.68rem;
  }
}
</style>
