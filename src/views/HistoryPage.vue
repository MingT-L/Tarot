<template>
  <div class="history-page">
    <div class="stars-container">
      <span v-for="i in 60" :key="i" class="star" :style="getStarStyle(i)"></span>
    </div>
    
    <div class="history-content">
      <section class="page-header">
        <div class="header-ornament">
          <svg class="ornament-circle" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#C9A84C;stop-opacity:0.3" />
                <stop offset="100%" style="stop-color:#7B4FD3;stop-opacity:0.3" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#circleGradient)" stroke-width="0.5" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="url(#circleGradient)" stroke-width="0.3" stroke-dasharray="2,4" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="url(#circleGradient)" stroke-width="0.2" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="url(#circleGradient)" stroke-width="0.2" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="url(#circleGradient)" stroke-width="0.2" />
            <line x1="18" y1="18" x2="82" y2="82" stroke="url(#circleGradient)" stroke-width="0.2" />
            <line x1="82" y1="18" x2="18" y2="82" stroke="url(#circleGradient)" stroke-width="0.2" />
          </svg>
          <svg class="ornament-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/>
          </svg>
        </div>
        <h1 class="page-title">历史记录</h1>
        <p class="page-subtitle">回顾每一次命运的启示</p>
        <div class="header-crystal">
          <svg viewBox="0 0 40 60" fill="none" stroke="currentColor" stroke-width="0.8">
            <polygon points="20 2 38 20 38 40 20 58 2 40 2 20"/>
            <line x1="20" y1="2" x2="20" y2="58" />
            <line x1="38" y1="20" x2="2" y2="40" />
            <line x1="38" y1="40" x2="2" y2="20" />
          </svg>
        </div>
      </section>

      <template v-if="sortedRecords.length > 0">
        <div class="history-toolbar">
          <div class="filter-tabs">
            <div v-if="filterLoading" class="filter-loading">
              <div class="loading-spinner-small"></div>
              <span>筛选中...</span>
            </div>
            <template v-else>
              <button
                v-for="filter in filterOptions"
                :key="filter.value"
                class="filter-tab"
                :class="{ active: activeFilter === filter.value }"
                @click="handleFilterChange(filter.value)"
              >
                <svg v-if="filter.icon" class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <polygon v-if="filter.icon === 'all'" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/>
                  <rect v-if="filter.icon === 'single'" x="3" y="6" width="18" height="12" rx="2"/>
                  <path v-if="filter.icon === 'three'" d="M4 6h16M4 12h16M4 18h16"/>
                  <path v-if="filter.icon === 'love-cross'" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  <polygon v-if="filter.icon === 'hexagram'" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/>
                  <circle v-if="filter.icon === 'celtic-cross'" cx="12" cy="12" r="10"/>
                </svg>
                <span>{{ filter.label }}</span>
              </button>
            </template>
          </div>
          
          <!-- <div class="toolbar-actions">
            <span class="record-count">
              <svg class="count-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              共 {{ filteredRecords.length }} 条
            </span>
            
            <button class="sort-btn" @click="toggleSort">
              <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
              <span>{{ sortOrder === 'desc' ? '最新' : '最早' }}</span>
            </button>
            
            <button
              class="clear-all-btn"
              @click="handleClearAll"
              :class="{ 'confirm': confirmClearAll }"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              </svg>
              <span>{{ confirmClearAll ? '确认清空？' : '清空全部' }}</span>
            </button>
          </div> -->
        </div>

        <section class="history-list">
          <div class="timeline">
            <div class="timeline-line"></div>
            <div 
              v-for="(group, groupIndex) in groupedRecords" 
              :key="group.date"
              class="timeline-group"
            >
              <div class="timeline-date-marker">
                <div class="date-dot"></div>
                <div class="date-label">{{ group.date }}</div>
              </div>
              
              <TransitionGroup name="record-list">
                <div 
                  v-for="(record, index) in group.records" 
                  :key="record.id"
                  class="timeline-item"
                  :style="{ animationDelay: `${(groupIndex * 3 + index) * 0.1}s` }"
                >
                  <div class="timeline-dot">
                    <div class="dot-glow"></div>
                  </div>
                  <HistoryCard
                    :record="record"
                    :index="index"
                    @delete="handleDelete"
                  />
                </div>
              </TransitionGroup>
            </div>
          </div>
          
          <div v-if="loadingMore" class="loading-more">
            <div class="loading-spinner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/>
              </svg>
            </div>
            <span class="loading-text">召唤更多命运记忆...</span>
          </div>
          
          <button 
            v-if="!loadingMore && hasMore" 
            class="load-more-btn"
            @click="loadMoreRecords"
          >
            <svg class="load-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polyline points="12 5 12 19"/>
              <polyline points="5 12 19 12"/>
            </svg>
            <span>加载更多</span>
          </button>
        </section>
      </template>

      <section v-else class="history-empty">
        <div class="empty-container">
          <div class="empty-crystal">
            <div class="crystal-glow"></div>
            <svg viewBox="0 0 80 120" fill="none" stroke="currentColor" stroke-width="0.8">
              <polygon points="40 4 76 40 76 80 40 116 4 80 4 40"/>
              <line x1="40" y1="4" x2="40" y2="116" />
              <line x1="76" y1="40" x2="4" y2="80" />
              <line x1="76" y1="80" x2="4" y2="40" />
              <line x1="40" y1="30" x2="40" y2="90" />
              <line x1="58" y1="50" x2="22" y2="70" />
              <line x1="58" y1="70" x2="22" y2="50" />
            </svg>
          </div>
          
          <div class="empty-content">
            <div class="empty-orb">
              <div class="orb-glow"></div>
              <svg class="orb-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2">
                <circle cx="24" cy="24" r="20"/>
                <circle cx="24" cy="24" r="14"/>
                <circle cx="24" cy="24" r="6"/>
                <line x1="24" y1="4" x2="24" y2="10"/>
                <line x1="24" y1="38" x2="24" y2="44"/>
                <line x1="4" y1="24" x2="10" y2="24"/>
                <line x1="38" y1="24" x2="44" y2="24"/>
              </svg>
            </div>
            <h2 class="empty-title">命运之书尚未书写</h2>
            <p class="empty-desc">
              翻开新的一页<br />
              让塔罗为您揭示命运的秘密
            </p>
            <router-link to="/divination" class="btn btn-outline empty-cta">
              <span>开始占卜</span>
              <svg class="cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </router-link>
          </div>
          
          <div class="empty-stars">
            <span v-for="i in 20" :key="i" class="star" :style="getEmptyStarStyle(i)"></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoryStore } from '@/stores/historyStore'
import { spreadsData } from '@/data/spreadsData'
import HistoryCard from '@/components/HistoryCard.vue'

const router = useRouter()
const historyStore = useHistoryStore()

const confirmClearAll = ref(false)
const activeFilter = ref('all')
const sortOrder = ref('desc')
const loadingMore = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const filterLoading = ref(false)

let clearTimer = null

const filterOptions = computed(() => {
  const baseOptions = [
    { value: 'all', label: '全部', icon: 'all' }
  ]
  
  const spreadOptions = spreadsData.map(spread => ({
    value: spread.id,
    label: spread.name,
    icon: spread.id
  }))
  
  return [...baseOptions, ...spreadOptions]
})

const sortedRecords = computed(() => {
  const records = [...historyStore.records]
  return records.sort((a, b) => {
    const timestampA = new Date(a.timestamp).getTime()
    const timestampB = new Date(b.timestamp).getTime()
    return sortOrder.value === 'desc' ? timestampB - timestampA : timestampA - timestampB
  })
})

const filteredRecords = computed(() => {
  if (filterLoading.value) return []
  if (activeFilter.value === 'all') return sortedRecords.value
  return sortedRecords.value.filter(r => r.spreadId === activeFilter.value)
})

const groupedRecords = computed(() => {
  const groups = {}
  filteredRecords.value.forEach(record => {
    const date = new Date(record.timestamp)
    const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    if (!groups[dateStr]) {
      groups[dateStr] = []
    }
    groups[dateStr].push(record)
  })
  return Object.entries(groups).map(([date, records]) => ({ date, records }))
})

function handleFilterChange(value) {
  filterLoading.value = true
  activeFilter.value = value
  setTimeout(() => {
    filterLoading.value = false
  }, 300)
}

function toggleSort() {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
}

function handleClearAll() {
  if (confirmClearAll.value) {
    clearTimeout(clearTimer)
    confirmClearAll.value = false
    historyStore.clearAll()
    return
  }
  confirmClearAll.value = true
  clearTimer = setTimeout(() => {
    confirmClearAll.value = false
  }, 3000)
}

function handleDelete(id) {
  historyStore.deleteRecord(id)
}

function getStarStyle(index) {
  const seed = index * 137.5
  return {
    left: `${(seed * 97) % 100}%`,
    top: `${(seed * 53) % 100}%`,
    animationDelay: `${(seed % 5)}s`,
    animationDuration: `${3 + (seed % 4)}s`,
    width: `${1 + (seed % 3)}px`,
    height: `${1 + (seed % 3)}px`
  }
}

function getEmptyStarStyle(index) {
  const seed = index * 73
  return {
    left: `${(seed * 67) % 100}%`,
    top: `${(seed * 43) % 100}%`,
    animationDelay: `${(seed % 4)}s`,
    animationDuration: `${2 + (seed % 3)}s`
  }
}

function loadMoreRecords() {
  loadingMore.value = true
  setTimeout(() => {
    loadingMore.value = false
    currentPage.value++
    if (currentPage.value > 3) {
      hasMore.value = false
    }
  }, 1500)
}
</script>

<style scoped>
.history-page {
  min-height: 100vh;
  padding-top: 70px;
  padding-bottom: 40px;
  position: relative;
  overflow: hidden;
  background: transparent;
}

.stars-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.star {
  position: absolute;
  background: var(--color-gold-light);
  border-radius: 50%;
  animation: starTwinkle ease-in-out infinite;
  opacity: 0.3;
}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  25% { opacity: 0.8; transform: scale(1.2); }
  50% { opacity: 0.4; transform: scale(0.9); }
  75% { opacity: 0.7; transform: scale(1.1); }
}

.history-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(ellipse at 20% 10%, rgba(123, 79, 211, 0.12) 0%, transparent 40%),
    radial-gradient(ellipse at 80% 90%, rgba(201, 168, 76, 0.08) 0%, transparent 35%),
    radial-gradient(ellipse at 50% 50%, rgba(74, 30, 110, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 30% 70%, rgba(186, 104, 200, 0.05) 0%, transparent 40%);
  pointer-events: none;
  z-index: 0;
}

.history-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

.page-header {
  text-align: center;
  padding: 40px 0 28px;
  position: relative;
}

.header-ornament {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 250px;
  height: 250px;
  pointer-events: none;
}

.ornament-circle {
  width: 100%;
  height: 100%;
  animation: circleRotate 80s linear infinite;
}

@keyframes circleRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.ornament-star {
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 18px;
  color: var(--color-gold);
  opacity: 0.5;
  animation: starPulse 3s ease-in-out infinite;
}

@keyframes starPulse {
  0%, 100% { opacity: 0.3; transform: translateX(-50%) scale(1); }
  50% { opacity: 0.7; transform: translateX(-50%) scale(1.15); }
}

.page-title {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--color-gold);
  margin-bottom: 10px;
  letter-spacing: 0.1em;
  position: relative;
  text-shadow: 
    0 0 25px rgba(201, 168, 76, 0.5),
    0 0 50px rgba(201, 168, 76, 0.25),
    0 0 80px rgba(123, 79, 211, 0.15);
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-gold), transparent);
  box-shadow: 0 0 8px rgba(201, 168, 76, 0.4);
}

.page-subtitle {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  font-style: italic;
  letter-spacing: 0.06em;
  position: relative;
  opacity: 0.8;
}

.header-crystal {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 26px;
  height: 40px;
  color: var(--color-gold);
  opacity: 0.35;
  animation: crystalFloat 4s ease-in-out infinite;
}

@keyframes crystalFloat {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-6px); }
}

.history-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  margin-bottom: 24px;
  background: linear-gradient(135deg, rgba(19, 19, 31, 0.85), rgba(26, 21, 32, 0.85));
  border: 1px solid rgba(201, 168, 76, 0.15);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(12px);
  position: relative;
}

.history-toolbar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: 1.5px;
  background: linear-gradient(90deg, transparent, var(--color-gold), transparent);
  box-shadow: 0 0 8px rgba(201, 168, 76, 0.3);
}

.filter-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  min-height: 38px;
}

.filter-tabs::-webkit-scrollbar {
  display: none;
}

.filter-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: var(--color-gold);
  font-size: 0.86rem;
  font-family: var(--font-display);
  letter-spacing: 0.04em;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(201, 168, 76, 0.3);
  border-top-color: var(--color-gold);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  min-height: 38px;
  border-radius: 20px;
  background: transparent;
  border: 1px solid rgba(201, 168, 76, 0.3);
  color: var(--color-text-secondary);
  font-size: 0.86rem;
  font-family: var(--font-display);
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-tab:hover {
  border-color: rgba(201, 168, 76, 0.6);
  color: var(--color-gold-light);
}

.filter-tab.active {
  background: linear-gradient(135deg, rgba(201, 168, 76, 0.3), rgba(201, 168, 76, 0.15));
  border-color: var(--color-gold);
  color: var(--color-gold);
  box-shadow: 0 0 15px rgba(201, 168, 76, 0.25);
}

.filter-icon {
  width: 14px;
  height: 14px;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 38px;
}

.record-count {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.86rem;
  color: var(--color-text-muted);
  font-family: var(--font-display);
  letter-spacing: 0.04em;
  min-height: 38px;
  line-height: 38px;
}

.count-icon {
  width: 14px;
  height: 14px;
  color: var(--color-gold);
  opacity: 0.5;
}

.sort-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  min-height: 38px;
  border-radius: var(--radius-sm);
  background: rgba(201, 168, 76, 0.08);
  border: 1px solid rgba(201, 168, 76, 0.2);
  color: var(--color-text-secondary);
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.25s ease;
}

.sort-btn:hover {
  border-color: rgba(201, 168, 76, 0.5);
  color: var(--color-gold);
}

.sort-icon {
  width: 14px;
  height: 14px;
  transition: transform 0.3s ease;
}

.sort-btn:hover .sort-icon {
  transform: rotate(180deg);
}

.clear-all-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  min-height: 38px;
  border-radius: var(--radius-sm);
  background: transparent;
  border: 1px solid var(--color-text-muted);
  color: var(--color-text-muted);
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.25s ease;
}

.clear-all-btn:hover {
  background: rgba(248, 113, 113, 0.08);
  border-color: var(--color-error);
  color: var(--color-error);
}

.clear-all-btn.confirm {
  background: rgba(248, 113, 113, 0.12);
  border-color: var(--color-error);
  color: var(--color-error);
}

.history-list {
  position: relative;
  padding-bottom: 32px;
}

.timeline {
  position: relative;
  padding-left: 48px;
}

.timeline-line {
  position: absolute;
  left: 14px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(
    180deg,
    var(--color-gold) 0%,
    rgba(201, 168, 76, 0.4) 30%,
    rgba(123, 79, 211, 0.3) 60%,
    rgba(201, 168, 76, 0.4) 80%,
    var(--color-gold) 100%
  );
  border-radius: 2px;
}

.timeline-group {
  margin-bottom: 32px;
}

.timeline-date-marker {
  position: relative;
  margin-bottom: 20px;
  padding-left: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.date-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-gold);
  box-shadow: 
    0 0 12px var(--color-gold),
    0 0 24px rgba(201, 168, 76, 0.4),
    0 0 36px rgba(201, 168, 76, 0.2);
  flex-shrink: 0;
}

.date-label {
  font-family: var(--font-display);
  font-size: 0.9rem;
  color: var(--color-gold);
  letter-spacing: 0.06em;
  padding: 6px 14px;
  background: rgba(201, 168, 76, 0.08);
  border: 1px solid rgba(201, 168, 76, 0.2);
  border-radius: 10px;
}

.timeline-item {
  position: relative;
  margin-bottom: 20px;
  animation: fadeUpIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}

@keyframes fadeUpIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.timeline-dot {
  position: absolute;
  left: -36px;
  top: 26px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-gold);
  z-index: 2;
}

.dot-glow {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: var(--color-gold);
  opacity: 0.3;
  animation: dotGlow 2s ease-in-out infinite;
}

@keyframes dotGlow {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(2); opacity: 0.1; }
}

.loading-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px;
}

.loading-spinner {
  width: 36px;
  height: 36px;
  color: var(--color-gold);
  animation: spin 2s linear infinite;
}

.loading-text {
  font-size: 0.86rem;
  color: var(--color-text-muted);
  font-style: italic;
}

.load-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px;
  margin-top: 16px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, rgba(201, 168, 76, 0.1), rgba(123, 79, 211, 0.05));
  border: 1px dashed rgba(201, 168, 76, 0.3);
  color: var(--color-gold);
  font-size: 0.9rem;
  font-family: var(--font-display);
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  background: linear-gradient(135deg, rgba(201, 168, 76, 0.15), rgba(123, 79, 211, 0.1));
  border-color: var(--color-gold);
  box-shadow: 0 0 20px rgba(201, 168, 76, 0.15);
}

.load-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.load-more-btn:hover .load-icon {
  transform: rotate(180deg);
}

.history-empty {
  padding: 40px 0;
}

.empty-container {
  position: relative;
  padding: 50px 24px;
  background: linear-gradient(145deg, rgba(19, 19, 31, 0.7), rgba(26, 21, 32, 0.7));
  border: 1px solid rgba(201, 168, 76, 0.15);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(15px);
  overflow: hidden;
}

.empty-container::before {
  content: '';
  position: absolute;
  inset: -50%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(123, 79, 211, 0.1) 0%, transparent 30%),
    radial-gradient(circle at 80% 70%, rgba(201, 168, 76, 0.06) 0%, transparent 25%);
  animation: emptyBgRotate 50s linear infinite;
}

@keyframes emptyBgRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.empty-crystal {
  position: absolute;
  top: -40px;
  right: -20px;
  width: 80px;
  height: 120px;
  color: var(--color-gold);
  opacity: 0.15;
}

.crystal-glow {
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201, 168, 76, 0.1) 0%, transparent 60%);
  animation: crystalGlow 4s ease-in-out infinite;
}

@keyframes crystalGlow {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

.empty-content {
  position: relative;
  text-align: center;
}

.empty-orb {
  position: relative;
  width: 90px;
  height: 90px;
  margin: 0 auto 24px;
}

.orb-glow {
  position: absolute;
  inset: -18px;
  border-radius: 50%;
  background: radial-gradient(circle, 
    rgba(201, 168, 76, 0.25) 0%, 
    rgba(123, 79, 211, 0.15) 40%, 
    transparent 70%);
  animation: orbPulse 3s ease-in-out infinite;
}

@keyframes orbPulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.12); opacity: 0.8; }
}

.orb-icon {
  position: absolute;
  inset: 8px;
  width: 74px;
  height: 74px;
  color: var(--color-gold);
  opacity: 0.4;
  filter: drop-shadow(0 0 15px rgba(201, 168, 76, 0.3));
}

.empty-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  color: var(--color-gold);
  margin-bottom: 12px;
  text-shadow: 0 0 20px rgba(201, 168, 76, 0.35);
  letter-spacing: 0.06em;
}

.empty-desc {
  font-size: 0.94rem;
  color: var(--color-text-muted);
  line-height: 2;
  margin-bottom: 32px;
  font-style: italic;
  opacity: 0.85;
}

.empty-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  position: relative;
  padding: 14px 30px;
}

.cta-arrow {
  width: 16px;
  height: 16px;
  transition: transform var(--transition-fast);
}

.empty-cta:hover .cta-arrow {
  transform: translateX(4px);
}

.empty-stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.empty-stars .star {
  background: var(--color-gold);
}

.record-list-enter-active,
.record-list-leave-active {
  transition: all 0.4s ease;
}

.record-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.record-list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.record-list-move {
  transition: transform 0.4s ease;
}

@media (max-width: 767px) {
  .history-page {
    padding-top: 0;
    padding-bottom: 16px;
  }

  .history-content {
    padding: 0 12px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-header {
    padding: 20px 0 16px;
  }

  .header-ornament {
    width: 180px;
    height: 180px;
  }

  .history-toolbar {
    padding: 12px 14px;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .filter-tabs {
    justify-content: center;
  }

  .toolbar-actions {
    justify-content: space-between;
  }

  .timeline {
    padding-left: 32px;
  }

  .timeline-line {
    left: 8px;
    width: 2px;
  }

  .timeline-dot {
    left: -26px;
    width: 10px;
    height: 10px;
    top: 24px;
  }

  .date-dot {
    width: 12px;
    height: 12px;
  }

  .date-label {
    font-size: 0.8rem;
    padding: 4px 10px;
  }

  .empty-container {
    padding: 35px 16px;
  }

  .empty-title {
    font-size: 1.2rem;
  }

  .empty-desc {
    font-size: 0.88rem;
  }

  .empty-crystal {
    display: none;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.3rem;
  }

  .filter-tab {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .clear-all-btn,
  .sort-btn {
    padding: 6px 10px;
    font-size: 0.76rem;
  }

  .record-count {
    font-size: 0.78rem;
  }

  .empty-container {
    padding: 28px 12px;
  }

  .timeline {
    padding-left: 24px;
  }

  .timeline-line {
    left: 4px;
  }

  .timeline-dot {
    left: -20px;
  }
}
</style>