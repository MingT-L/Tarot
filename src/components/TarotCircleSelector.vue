<template>
  <div class="tarot-circle-selector" :class="{ 'tarot-circle-selector--visible': visible }">
    <!-- 占卜背景图 -->
    <div class="zhanbo-bg"></div>

    <div
      ref="stageRef"
      class="circle-stage"
      :class="{ 'circle-stage--locked': animating }"
    >
      <!-- 牌阵信息提示 -->
      <div class="stage-header">
        <h3 class="stage-header__title">{{ spreadInfo.name }}</h3>
        <p class="stage-header__hint">
          <template v-if="phase === 'draw'">
            请点击卡牌选择 · 剩余 <span class="stage-header__count">{{ cardsRemaining }}</span> 张
          </template>
          <template v-else-if="phase === 'complete'">
            占卜完成 · 所有卡牌已就位
          </template>
        </p>
      </div>

      <!-- 牌阵位置标记 -->
      <div class="spread-layout">
        <div
          v-for="(pos, idx) in spreadInfo.positions"
          :key="pos.id"
          class="layout-position"
          :class="{
            'layout-position--filled': spreadCards[idx],
            'layout-position--current': nextPosition === idx && phase === 'draw',
            'layout-position--completed': phase === 'complete'
          }"
          :style="getLayoutStyle(idx)"
        >
          <div v-if="spreadCards[idx]" class="layout-card">
            <div class="layout-card__inner">
              <img :src="`${baseUrl}${spreadCards[idx].file}`" :alt="spreadCards[idx].nameCn" class="layout-card__image" />
            </div>
            <div class="layout-card__info">
              <span class="layout-card__pos-name">{{ pos.name }}</span>
              <span class="layout-card__card-name">{{ spreadCards[idx].nameCn }}</span>
              <span class="layout-card__reversed" v-if="spreadCards[idx].reversed">逆位</span>
            </div>
          </div>
          <div v-else class="layout-placeholder">
            <span class="layout-placeholder__label">{{ pos.name }}</span>
            <span class="layout-placeholder__number">{{ idx + 1 }}</span>
          </div>
        </div>
      </div>

      <!-- 圆心指示器 -->
      <div class="center-marker" :class="{ 'center-marker--active': phase === 'complete' }"></div>

      <!-- 卡牌列表 -->
      <div
        v-for="(card, idx) in displayCards"
        :key="card.id"
        class="tarot-card"
        :class="{
          'tarot-card--entered': card.entered,
          'tarot-card--selected': card.selected,
          'tarot-card--animating': card.animating,
          'tarot-card--locked': !canClickCard(card),
          'tarot-card--revealed': card.selected && phase === 'complete'
        }"
        :style="getCardStyle(idx, card)"
        @click.stop="handleCardClick(card, idx)"
      >
        <!-- 卡牌背面 -->
        <div class="tarot-card__back">
          <img :src="cardBg" alt="card back" class="tarot-card__back-image" />
          <div class="tarot-card__back-overlay"></div>
        </div>
        <!-- 卡牌正面 -->
        <div class="tarot-card__front">
          <div class="tarot-card__shine"></div>
          <img :src="`${baseUrl}${card.file}`" :alt="card.nameCn" class="tarot-card__front-image" />
          <div class="tarot-card__front-info">
            <span class="tarot-card__front-name">{{ card.nameCn }}</span>
            <span class="tarot-card__front-reversed" v-if="card.selected && card.reversed">逆位</span>
          </div>
        </div>
      </div>

      <!-- 返回按钮 -->
      <button class="back-btn" @click="goBack" :disabled="animating">
        <span class="back-btn__text">返回</span>
      </button>

      <!-- 完成按钮 -->
      <div class="complete-prompt" v-if="phase === 'complete'">
        <button class="complete-btn" @click="finish">
          <span class="complete-btn__icon"></span>
          <span class="complete-btn__text">查看解读</span>
          <span class="complete-btn__icon">✦</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { allCards } from '@/data/cardsData'
import cardBg from '@/assets/card_bg.png'

const baseUrl = import.meta.env.BASE_URL || ''

const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  spreadInfo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['back', 'result', 'cards-selected'])

const phase = ref('draw')
const animating = ref(false)
const selectedCards = ref([])
const spreadCards = ref([])
const nextPosition = ref(0)
const rotation = ref(0)
let rotationAnimId = null
let lastTimestamp = 0

const displayCards = ref([])
const stageRef = ref(null)

const cardsRemaining = computed(() => {
  const needed = props.spreadInfo?.cardCount || 1
  return Math.max(0, needed - selectedCards.value.length)
})

function startRotation(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp
  const delta = timestamp - lastTimestamp
  lastTimestamp = timestamp
  rotation.value += delta * 0.002
  rotationAnimId = requestAnimationFrame(startRotation)
}

function stopRotation() {
  if (rotationAnimId) {
    cancelAnimationFrame(rotationAnimId)
    rotationAnimId = null
  }
  lastTimestamp = 0
}

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function initCards() {
  const shuffled = shuffle(allCards)
  displayCards.value = shuffled.map((card, idx) => ({
    ...card,
    index: idx,
    selected: false,
    animating: false,
    reversed: false,
    entered: false
  }))
  // 依次触发入场动画
  displayCards.value.forEach((card, idx) => {
    setTimeout(() => {
      card.entered = true
    }, idx * 80 + 300)
  })
  // 卡片入场后启动旋转
  setTimeout(() => {
    startRotation(performance.now())
  }, displayCards.value.length * 80 + 500)
}

function getCardStyle(idx, card) {
  if (card.selected && !card.animating) {
    return {
      transform: 'translate(-50%, -50%) translate(0, 0) rotate(0deg) scale(1.5)',
      zIndex: 1000,
      left: '50%',
      top: '50%'
    }
  }

  if (card.selected && card.animating) {
    return {
      transform: 'translate(-50%, -50%) translate(0, 0) rotate(0deg) scale(1)',
      zIndex: 1000,
      left: '50%',
      top: '50%'
    }
  }

  const totalCards = displayCards.value.length
  const angle = (idx / totalCards) * 2 * Math.PI + (rotation.value * Math.PI / 180)
  const { radius, yOffset } = getRingPosition()
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius + yOffset
  const rotate = (angle + Math.PI / 2) * (180 / Math.PI)

  if (!card.entered) {
    return {
      transform: 'translate(-50%, -50%) translate(0, 500px) rotate(180deg) scale(0.5)',
      opacity: 0,
      zIndex: 1,
      left: '50%',
      top: '50%'
    }
  }

  return {
    transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotate}deg)`,
    '--card-transform': `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotate}deg)`,
    zIndex: card.animating ? 999 : 1,
    left: '50%',
    top: '50%'
  }
}

function getRingPosition() {
  if (!stageRef.value) return { radius: 200, yOffset: 0 }

  const stageRect = stageRef.value.getBoundingClientRect()
  const stageWidth = stageRect.width
  const stageHeight = stageRect.height

  const imgWidth = 1200
  const imgHeight = 800
  const isMobile = stageWidth <= 768
  const cardWidth = isMobile ? 80 : 100

  const ringRadiusInImage = 340

  // cover 模式下，圆环中心始终与舞台中心重合
  const scale = Math.max(stageWidth / imgWidth, stageHeight / imgHeight)
  const ringRadiusPx = ringRadiusInImage * scale

  return {
    radius: ringRadiusPx - cardWidth / 2,
    yOffset: 0
  }
}

function getLayoutStyle(idx) {
  const positions = props.spreadInfo?.positions || []
  const count = positions.length

  if (count === 1) {
    return {
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    }
  }

  if (count === 3) {
    const spacing = 140
    const offsetX = (idx - 1) * spacing
    return {
      left: `calc(50% + ${offsetX}px)`,
      top: '50%',
      transform: 'translate(-50%, -50%)'
    }
  }

  if (count === 5) {
    const spacing = 120
    const layouts = [
      { x: -spacing, y: 0 },
      { x: spacing, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: spacing },
      { x: 0, y: spacing * 2 }
    ]
    const pos = layouts[idx]
    return {
      left: `calc(50% + ${pos.x}px)`,
      top: `calc(50% + ${pos.y}px)`,
      transform: 'translate(-50%, -50%)'
    }
  }

  return {
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }
}

function canClickCard(card) {
  if (animating.value || card.selected) return false
  return phase.value === 'draw' && cardsRemaining.value > 0
}

function handleCardClick(card, idx) {
  if (!canClickCard(card)) return

  animating.value = true
  card.animating = true
  stopRotation()

  // 第一阶段：微弹效果 (150ms)
  setTimeout(() => {
    // 第二阶段：执行3D翻转 + 移动到中心
    card.selected = true

    // 翻转完成后处理数据
    setTimeout(() => {
      card.animating = false

      const reversed = Math.random() < 0.5
      card.reversed = reversed

      const positionId = props.spreadInfo?.positions[nextPosition.value]?.id || nextPosition.value
      selectedCards.value.push({
        positionId,
        positionName: props.spreadInfo?.positions[nextPosition.value]?.name || '',
        cardId: card.id,
        cardNameCn: card.nameCn,
        cardNameEn: card.nameEn,
        reversed,
        image: `${baseUrl}${card.file}`
      })

      spreadCards.value[nextPosition.value] = {
        ...card,
        reversed
      }
      nextPosition.value++

      animating.value = false
      startRotation(performance.now())

      if (selectedCards.value.length >= props.spreadInfo?.cardCount) {
        setTimeout(() => {
          stopRotation()
          phase.value = 'complete'
          emit('cards-selected', selectedCards.value)
        }, 500)
      }
    }, 700)
  }, 150)
}

function goBack() {
  emit('back')
}

function finish() {
  emit('result')
}

onMounted(() => {
  initCards()
})

watch(() => props.visible, (val) => {
  if (val) {
    stopRotation()
    phase.value = 'draw'
    animating.value = false
    selectedCards.value = []
    spreadCards.value = []
    nextPosition.value = 0
    rotation.value = 0
    initCards()
  }
})

onUnmounted(() => {
  stopRotation()
})
</script>

<style scoped>
.tarot-circle-selector {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: radial-gradient(ellipse at center, #1a0a2e 0%, #0d0515 50%, #05020a 100%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.tarot-circle-selector--visible {
  opacity: 1;
  pointer-events: auto;
}

/* 占卜背景图 */
.zhanbo-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/zhanbo_bg2.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  pointer-events: none;
  z-index: 0;
}

.stage-header {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 150;
}

.stage-header__title {
  font-family: var(--font-display, 'Noto Serif SC', serif);
  font-size: 1.3rem;
  color: var(--color-gold, #c9a84c);
  margin-bottom: 4px;
  text-shadow: 0 0 20px rgba(201, 168, 76, 0.5);
  letter-spacing: 0.1em;
}

.stage-header__hint {
  font-family: var(--font-display, 'Noto Serif SC', serif);
  font-size: 0.85rem;
  color: rgba(232, 228, 218, 0.6);
  letter-spacing: 0.05em;
}

.stage-header__count {
  color: var(--color-gold, #c9a84c);
  font-weight: 600;
}

.circle-stage {
  position: relative;
  width: 100%;
  height: 100%;
}

.circle-stage--locked {
  pointer-events: none;
}

.center-marker {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 60px;
  height: 60px;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(201, 168, 76, 0.3);
  border-radius: 50%;
  z-index: 5;
  transition: all 0.5s ease;
}

.center-marker::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  transform: translate(-50%, -50%);
  background: var(--color-gold, #c9a84c);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(201, 168, 76, 0.8);
}

.center-marker--active {
  border-color: rgba(201, 168, 76, 0.8);
  box-shadow: 0 0 30px rgba(201, 168, 76, 0.3);
}

.center-marker--active::after {
  content: '✦';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
  color: var(--color-gold, #c9a84c);
  animation: rotateStar 3s linear infinite;
}

@keyframes rotateStar {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* 牌阵布局 */
.spread-layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
}

.layout-position {
  position: absolute;
  width: 100px;
  height: 140px;
  pointer-events: auto;
}

.layout-placeholder {
  width: 100%;
  height: 100%;
  border: 2px dashed rgba(201, 168, 76, 0.4);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.layout-position--current .layout-placeholder {
  border-color: var(--color-gold, #c9a84c);
  box-shadow: 0 0 20px rgba(201, 168, 76, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

.layout-placeholder__label {
  font-family: var(--font-display, 'Noto Serif SC', serif);
  font-size: 0.75rem;
  color: rgba(201, 168, 76, 0.7);
  text-align: center;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.layout-placeholder__number {
  font-family: var(--font-display, 'Noto Serif SC', serif);
  font-size: 0.7rem;
  color: rgba(201, 168, 76, 0.4);
}

.layout-card {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid var(--color-gold, #c9a84c);
  box-shadow: 0 0 20px rgba(201, 168, 76, 0.4);
  animation: cardAppear 0.5s ease;
}

.layout-card__inner {
  width: 100%;
  height: 100px;
  overflow: hidden;
}

.layout-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.layout-card__info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px;
  background: rgba(0, 0, 0, 0.6);
  gap: 2px;
}

.layout-card__pos-name {
  font-family: var(--font-display, 'Noto Serif SC', serif);
  font-size: 0.7rem;
  color: rgba(201, 168, 76, 0.7);
}

.layout-card__card-name {
  font-family: var(--font-display, 'Noto Serif SC', serif);
  font-size: 0.75rem;
  color: var(--color-gold, #c9a84c);
  line-height: 1.2;
}

.layout-card__reversed {
  font-family: var(--font-display, 'Noto Serif SC', serif);
  font-size: 0.65rem;
  color: #ff6b6b;
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: scale(0.8) rotateY(90deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotateY(0deg);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* 塔罗卡牌 */
.tarot-card {
  position: absolute;
  width: 100px;
  height: 140px;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
              filter 0.4s ease,
              z-index 0s;
  transform-style: preserve-3d;
  perspective: 1000px;
  opacity: 0;
}

/* 入场动画 */
.tarot-card--entered {
  opacity: 1;
  animation: cardEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes cardEntrance {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) translate(0, 500px) rotate(180deg) scale(0.5);
    filter: brightness(0.5) blur(4px);
  }
  60% {
    opacity: 1;
    filter: brightness(1.2) blur(0px);
  }
  100% {
    opacity: 1;
    filter: brightness(1) blur(0px);
  }
}

.tarot-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 10px;
  border: 2px solid var(--color-gold, #c9a84c);
  box-shadow:
    0 0 10px rgba(201, 168, 76, 0.3),
    inset 0 0 10px rgba(201, 168, 76, 0.1);
  pointer-events: none;
  z-index: 10;
  transition: all 0.3s ease;
}

.tarot-card:hover:not(.tarot-card--selected):not(.tarot-card--animating):not(.tarot-card--locked) {
  filter: brightness(1.2);
  z-index: 50;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
              filter 0.4s ease,
              z-index 0s;
}

.tarot-card:hover:not(.tarot-card--selected):not(.tarot-card--animating):not(.tarot-card--locked)::before {
  box-shadow:
    0 0 30px rgba(201, 168, 76, 0.6),
    0 0 60px rgba(138, 43, 226, 0.3),
    0 8px 25px rgba(0, 0, 0, 0.5),
    inset 0 0 20px rgba(201, 168, 76, 0.2);
  border-color: rgba(201, 168, 76, 0.9);
}

.tarot-card--locked {
  cursor: default;
  filter: grayscale(0.5) brightness(0.7);
  pointer-events: none;
}

.tarot-card--selected {
  cursor: default;
}

.tarot-card--animating {
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 选中后放大展示 */
.tarot-card--selected:not(.tarot-card--animating) {
  animation: cardSelect 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes cardSelect {
  0% {
    transform: translate(-50%, -50%) translate(0, 0) rotate(0deg) scale(1);
  }
  40% {
    transform: translate(-50%, -50%) translate(0, 0) rotate(0deg) scale(0.92);
  }
  100% {
    transform: translate(-50%, -50%) translate(0, 0) rotate(0deg) scale(1.5);
  }
}

.tarot-card--revealed::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(201, 168, 76, 0.15) 0%, transparent 60%);
  pointer-events: none;
  z-index: 11;
  animation: revealGlow 2s ease-in-out infinite;
}

@keyframes revealGlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.tarot-card__back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  backface-visibility: hidden;
  transition: transform 0.6s ease, opacity 0.3s ease;
}

.tarot-card--animating .tarot-card__back {
  animation: flipBack 0.6s ease forwards;
}

@keyframes flipBack {
  0% { transform: rotateY(0deg); opacity: 1; }
  100% { transform: rotateY(-180deg); opacity: 0; }
}

.tarot-card__back-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.9) contrast(1.1);
}

.tarot-card__back-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4));
  pointer-events: none;
}

.tarot-card__front {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  opacity: 0;
}

.tarot-card--animating .tarot-card__front {
  animation: flipFront 0.6s ease forwards;
}

@keyframes flipFront {
  0% { transform: rotateY(180deg); opacity: 0; }
  100% { transform: rotateY(0deg); opacity: 1; }
}

.tarot-card--selected .tarot-card__front {
  opacity: 1;
  transform: rotateY(0deg);
}

.tarot-card__front-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 闪光扫过效果 */
.tarot-card__shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 30%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0.1) 70%,
    transparent 100%
  );
  transform: skewX(-20deg);
  pointer-events: none;
  z-index: 20;
}

.tarot-card--animating .tarot-card__shine {
  animation: shinePass 0.7s ease 0.15s;
}

@keyframes shinePass {
  0% { left: -100%; }
  100% { left: 200%; }
}

.tarot-card__front-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  text-align: center;
}

.tarot-card__front-name {
  font-family: var(--font-display, 'Noto Serif SC', serif);
  font-size: 0.85rem;
  color: var(--color-gold, #c9a84c);
  letter-spacing: 0.05em;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}

.tarot-card__front-reversed {
  display: block;
  font-family: var(--font-display, 'Noto Serif SC', serif);
  font-size: 0.7rem;
  color: #ff6b6b;
  margin-top: 2px;
}

/* 返回按钮 */
.back-btn {
  position: absolute;
  bottom: 30px;
  left: 30px;
  padding: 10px 24px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(201, 168, 76, 0.4);
  border-radius: 20px;
  color: var(--color-text-primary, #e8e4da);
  font-family: var(--font-display, 'Noto Serif SC', serif);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 200;
}

.back-btn:hover:not(:disabled) {
  background: rgba(201, 168, 76, 0.2);
  border-color: var(--color-gold, #c9a84c);
}

.back-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 完成提示 */
.complete-prompt {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
}

.complete-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 40px;
  background: linear-gradient(135deg, rgba(201, 168, 76, 0.4), rgba(201, 168, 76, 0.2));
  border: 1px solid var(--color-gold, #c9a84c);
  border-radius: 30px;
  color: var(--color-gold, #c9a84c);
  font-family: var(--font-display, 'Noto Serif SC', serif);
  font-size: 1.1rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: glow 2s ease-in-out infinite alternate;
}

.complete-btn:hover {
  background: linear-gradient(135deg, rgba(201, 168, 76, 0.6), rgba(201, 168, 76, 0.3));
  box-shadow: 0 0 40px rgba(201, 168, 76, 0.5);
  transform: translateY(-2px);
}

.complete-btn__icon {
  font-size: 0.9rem;
  animation: sparkle 1.5s ease-in-out infinite;
}

.complete-btn__icon:last-child {
  animation-delay: 0.75s;
}

@keyframes sparkle {
  0%, 100% { opacity: 0.5; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes glow {
  0% { box-shadow: 0 0 20px rgba(201, 168, 76, 0.3); }
  100% { box-shadow: 0 0 40px rgba(201, 168, 76, 0.6); }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .stage-header__title {
    font-size: 1.1rem;
  }

  .stage-header__hint {
    font-size: 0.75rem;
  }

  .tarot-card {
    width: 80px;
    height: 112px;
  }

  .layout-position {
    width: 80px;
    height: 112px;
  }

  .layout-card__inner {
    height: 80px;
  }

  .layout-card__pos-name {
    font-size: 0.6rem;
  }

  .layout-card__card-name {
    font-size: 0.65rem;
  }

  .layout-card__reversed {
    font-size: 0.55rem;
  }

  .layout-placeholder__label {
    font-size: 0.6rem;
  }

  .layout-placeholder__number {
    font-size: 0.6rem;
  }

  .tarot-card__front-name {
    font-size: 0.75rem;
  }

  .tarot-card__front-reversed {
    font-size: 0.6rem;
  }

  .complete-btn {
    padding: 12px 30px;
    font-size: 1rem;
  }

  .back-btn {
    bottom: 20px;
    left: 20px;
    padding: 8px 18px;
    font-size: 0.8rem;
  }
}
</style>
