<template>
  <div class="divination-page" :class="{ 'divination-page--locked': phase === 'select' }">
    <div v-if="phase === 'select'" class="divination-page__select">
      <div class="divination-page__select-inner">
        <div class="divination-page__title-section">
          <h1 class="divination-page__title gold-text-glow">选择牌阵</h1>
          <p class="divination-page__subtitle">请选择适合您当前问题的占卜方式</p>
        </div>

        <!-- 占卜问题输入框 -->
        <div class="divination-page__question-section">
          <input
            ref="questionInputRef"
            v-model="userQuestion"
            type="text"
            class="divination-page__question-input"
            placeholder="在此输入您心中的困惑..."
            maxlength="200"
          />
          <div class="divination-page__question-line"></div>
        </div>

        <SpreadSelector
          :spreads="spreadsData"
          :selected="selectedSpread"
          @select="onSpreadSelect"
        />

        <div class="divination-page__actions">
          <button
            class="btn-image-wrapper divination-page__start-btn"
            :disabled="!selectedSpread || !userQuestion.trim()"
            :aria-label="!userQuestion.trim() ? '请先输入占卜问题' : !selectedSpread ? '请先选择牌阵' : '叩问星辰，开始占卜'"
            :aria-disabled="!selectedSpread || !userQuestion.trim()"
            role="button"
            tabindex="0"
            @click="startDivination"
            @keydown.enter="startDivination"
            @keydown.space.prevent="startDivination"
          >
            <img src="../assets/btn.png" alt="" class="btn-image" aria-hidden="true" />
            <span class="btn-text">叩问星辰</span>
          </button>
        </div>
      </div>
    </div>

    <!-- <TarotScene3D
      v-else
      :spread-name="selectedSpread?.name || ''"
      :spread-name-en="selectedSpread?.nameEn || ''"
      :card-count="selectedSpread?.cardCount || 3"
      :visible="phase === 'draw'"
      @back="goBack"
      @result="viewResult"
      @cards-selected="onCardsSelected"
    /> -->

    <TarotCircleSelector
      v-else
      :visible="phase === 'draw'"
      :spread-info="selectedSpread"
      @back="goBack"
      @result="viewResult"
      @cards-selected="onCardsSelected"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { spreadsData } from '@/data/spreadsData'
import { useHistoryStore } from '@/stores/historyStore'
import SpreadSelector from '@/components/SpreadSelector.vue'
import TarotCircleSelector from '@/components/TarotCircleSelector.vue'
// import TarotScene3D from '@/components/TarotScene3D.vue'

const router = useRouter()
const route = useRoute()
const historyStore = useHistoryStore()

const phase = ref('select')
const selectedSpread = ref(null)
const selectedCardsResult = ref([])
const userQuestion = ref('')
const questionInputRef = ref(null)

onMounted(() => {
  const spreadParam = route.query.spread
  if (spreadParam) {
    const spread = spreadsData.find(s => s.id === spreadParam)
    if (spread) {
      selectedSpread.value = spread
    }
  }
  // 页面加载完成后自动聚焦到输入框
  nextTick(() => {
    questionInputRef.value?.focus()
  })
})

function onSpreadSelect(spread) {
  selectedSpread.value = spread
}

function startDivination() {
  if (!selectedSpread.value) return
  phase.value = 'draw'
}

function goBack() {
  phase.value = 'select'
  selectedCardsResult.value = []
}

function onCardsSelected(cardDataArray) {
  // cardDataArray contains { positionId, positionName, cardId, cardNameCn, cardNameEn, reversed, image }
  selectedCardsResult.value = cardDataArray || []
}

function viewResult() {
  if (!selectedSpread.value || selectedCardsResult.value.length === 0) return

  const record = {
    spreadId: selectedSpread.value.id,
    spreadName: selectedSpread.value.name,
    spreadNameEn: selectedSpread.value.nameEn,
    cardCount: selectedSpread.value.cardCount,
    question: userQuestion.value,
    cards: selectedCardsResult.value
  }

  const savedRecord = historyStore.saveRecord(record)
  router.push(`/result/${savedRecord.id}`)
}
</script>

<style scoped>
.divination-page {
  min-height: 100vh;
  padding: 0;
  position: relative;
  display: flex;
  flex-direction: column;
}

.divination-page--locked {
  overflow: hidden;
}

.divination-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(ellipse at 20% 30%, rgba(138, 43, 226, 0.06) 0%, transparent 40%),
    radial-gradient(ellipse at 80% 70%, rgba(65, 105, 225, 0.05) 0%, transparent 35%),
    radial-gradient(ellipse at 50% 50%, rgba(201, 168, 76, 0.02) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.divination-page__select {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  padding: 80px 24px 60px;
}

.divination-page__select-inner {
  width: 100%;
  max-width: 720px;
  animation: selectFadeIn 0.6s ease;
}

@keyframes selectFadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.divination-page__title-section {
  text-align: center;
  margin-bottom: 32px;
}

.divination-page__title {
  font-family: var(--font-display);
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--color-gold);
  margin-bottom: 12px;
  letter-spacing: 0.06em;
}

.divination-page__subtitle {
  font-family: var(--font-display);
  font-size: 1.05rem;
  color: var(--color-purple-light);
  letter-spacing: 0.1em;
  font-style: italic;
  opacity: 0.9;
}

/* ==================== 占卜问题输入框 ==================== */
.divination-page__question-section {
  position: relative;
  max-width: 480px;
  margin: 0 auto 40px;
}

.divination-page__question-input {
  display: block;
  width: 100%;
  padding: 10px 0;
  background: transparent;
  border: none;
  border-bottom: 1.5px solid rgba(201, 168, 76, 0.25);
  color: var(--color-text-primary, #e8e4da);
  font-family: 'Noto Serif SC', var(--font-body, serif);
  font-size: 1rem;
  line-height: 1.6;
  outline: none;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  text-align: center;
}

.divination-page__question-input::placeholder {
  color: var(--color-text-muted, #6b6780);
  font-style: italic;
  opacity: 0.6;
}

.divination-page__question-input:focus {
  border-bottom-color: var(--color-gold, #c9a84c);
}

.divination-page__question-line {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 1.5px;
  width: 0;
  background: linear-gradient(90deg, var(--color-gold, #c9a84c), var(--color-gold-light, #e8d48b));
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.divination-page__question-input:focus ~ .divination-page__question-line {
  width: 100%;
}

.divination-page__actions {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.divination-page__start-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  outline: none;
  transition: transform 0.3s ease, filter 0.3s ease;
}

/* 按钮图片背景 */
.divination-page__start-btn .btn-image {
  display: block;
  width: 280px;
  height: 60px;
  object-fit: cover;
  pointer-events: none;
}

/* 按钮文字叠加 */
.divination-page__start-btn .btn-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-display);
  font-size: 1.08rem;
  font-weight: 600;
  color: var(--color-gold);
  letter-spacing: 0.1em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  white-space: nowrap;
}

/* hover 状态 */
.divination-page__start-btn:not(:disabled):hover {
  transform: translateY(-2px) scale(1.03);
  filter: brightness(1.15);
}

/* active 状态 */
.divination-page__start-btn:not(:disabled):active {
  transform: scale(0.96);
  transition: transform 0.08s ease;
}

/* focus 状态 */
.divination-page__start-btn:focus-visible {
  outline: 2px solid var(--color-gold-light, #e8d48b);
  outline-offset: 4px;
  border-radius: 4px;
}

/* disabled 状态 */
.divination-page__start-btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
  filter: grayscale(0.6);
}

.divination-page__start-btn:disabled .btn-text {
  color: var(--color-text-muted, #6b6780);
  text-shadow: none;
}

@media (max-width: 767px) {
  .divination-page {
    padding: 0;
  }

  .divination-page__select {
    padding: 60px 16px 40px;
  }

  .divination-page__title {
    font-size: 2rem;
  }

  .divination-page__subtitle {
    font-size: 0.95rem;
  }

  .divination-page__title-section {
    margin-bottom: 28px;
  }

  .divination-page__question-section {
    margin-bottom: 32px;
  }

  .divination-page__start-btn .btn-image {
    width: 220px;
    height: 48px;
  }

  .divination-page__start-btn .btn-text {
    font-size: 0.95rem;
  }

  .divination-page__actions {
    margin-top: 32px;
  }
}
</style>