<template>
  <div class="spread-selector">
    <div class="spread-selector__grid">
      <div
        v-for="spread in spreads"
        :key="spread.id"
        class="spread-entry"
        :class="{ 'spread-entry--selected': selectedId === spread.id }"
        @click="selectSpread(spread)"
      >
        <div class="spread-entry__left">
          <span class="spread-entry__count">{{ spread.cardCount }}</span>
        </div>
        <div class="spread-entry__body">
          <div class="spread-entry__info">
            <h3 class="spread-entry__name">{{ spread.name }}</h3>
            <span class="spread-entry__name-en">{{ spread.nameEn }}</span>
          </div>
          <p class="spread-entry__desc">{{ spread.description }}</p>
        </div>
        <!-- <div class="spread-entry__right">
          <div
            v-if="selectedId === spread.id"
            class="spread-entry__indicator"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  spreads: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['select'])
const selectedId = ref(null)

function selectSpread(spread) {
  selectedId.value = spread.id
  emit('select', spread)
}
</script>

<style scoped>
.spread-selector {
  width: 100%;
  max-width: fit-content;
  margin: 0 auto;
}

.spread-selector__grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.spread-entry {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  cursor: pointer;
  position: relative;
  border-radius: 12px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  border: none;
  width: 100%;
}

.spread-entry:hover {
  background: rgba(201, 168, 76, 0.04);
  padding-left: 24px;
}

.spread-entry--selected {
  background: rgba(201, 168, 76, 0.06);
  padding-left: 24px;
}

.spread-entry--selected::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: var(--color-gold);
  border-radius: 2px;
  box-shadow: 0 0 12px rgba(201, 168, 76, 0.5);
}

.spread-entry__left {
  flex-shrink: 0;
}

.spread-entry__count {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-gold);
  background: rgba(201, 168, 76, 0.08);
  border: 1px solid rgba(201, 168, 76, 0.15);
  transition: all 0.3s ease;
}

.spread-entry:hover .spread-entry__count {
  background: rgba(201, 168, 76, 0.12);
  border-color: rgba(201, 168, 76, 0.25);
  box-shadow: 0 0 20px rgba(201, 168, 76, 0.1);
}

.spread-entry--selected .spread-entry__count {
  background: rgba(201, 168, 76, 0.15);
  border-color: var(--color-gold);
  box-shadow: 0 0 25px rgba(201, 168, 76, 0.2);
}

.spread-entry__body {
  flex: 1;
  min-width: 0;
}

.spread-entry__info {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 4px;
}

.spread-entry__name {
  font-family: var(--font-display);
  font-size: 1.05rem;
  color: var(--color-text-primary);
  font-weight: 600;
  letter-spacing: 0.04em;
  transition: color 0.3s ease;
}

.spread-entry:hover .spread-entry__name {
  color: var(--color-gold);
}

.spread-entry--selected .spread-entry__name {
  color: var(--color-gold);
  text-shadow: 0 0 20px rgba(201, 168, 76, 0.3);
}

.spread-entry__name-en {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  font-style: italic;
}

.spread-entry__desc {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  opacity: 0.8;
}

.spread-entry__right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.spread-entry__indicator {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gold);
  animation: indicatorPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes indicatorPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 540px) {
  .spread-entry {
    padding: 14px 16px;
  }
  .spread-entry__count {
    width: 40px;
    height: 40px;
    font-size: 0.9rem;
  }
  .spread-entry__info {
    flex-direction: column;
    gap: 2px;
  }
  .spread-entry__desc {
    font-size: 0.8rem;
  }
}
</style>