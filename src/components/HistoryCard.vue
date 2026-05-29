<template>
  <article 
    class="history-card" 
    @click="toggleExpand"
    role="button"
    :aria-label="`查看 ${record.spreadName || '未知阵法'} 的占卜结果`"
    tabindex="0"
    @keydown.enter="toggleExpand"
    @keydown.space.prevent="toggleExpand"
  >
    <div class="card-paper-texture" aria-hidden="true"></div>
    <div class="card-border-glow" aria-hidden="true"></div>
    <div class="card-gold-border-left"></div>
    <div class="card-corner-decoration top-left"></div>
    <div class="card-corner-decoration top-right"></div>
    <div class="card-corner-decoration bottom-left"></div>
    <div class="card-corner-decoration bottom-right"></div>
    
    <header class="card-header">
      <div class="spread-identity">
        <div class="spread-emblem" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="24" cy="24" r="20"/>
            <circle cx="24" cy="24" r="12"/>
            <circle cx="24" cy="24" r="4"/>
            <line x1="24" y1="4" x2="24" y2="12"/>
            <line x1="24" y1="36" x2="24" y2="44"/>
            <line x1="4" y1="24" x2="12" y2="24"/>
            <line x1="36" y1="24" x2="44" y2="24"/>
          </svg>
        </div>
        <div class="spread-text">
          <span class="spread-tag">{{ record.spreadName || '神秘阵法' }}</span>
          <h3 class="spread-name">{{ getSpreadTitle(record.spreadName) }}</h3>
        </div>
      </div>
      
      <div class="record-meta">
        <time class="record-time" :datetime="record.timestamp">{{ formattedDate }}</time>
        <div class="card-count-badge" aria-label="`${record.cards?.length || 0} 张牌`">
          <span class="count-value">{{ record.cards?.length || 0 }}</span>
          <span class="count-unit">张</span>
        </div>
      </div>
    </header>
    
    <div class="card-divider" aria-hidden="true">
      <hr class="divider-line"/>
      <div class="divider-ornament">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8"/>
        </svg>
      </div>
      <hr class="divider-line"/>
    </div>
    
    <section class="card-preview" aria-label="塔罗牌预览">
      <ul class="preview-list" role="list">
        <li
          v-for="(card, index) in previewCards"
          :key="card.id"
          class="preview-item"
          :class="{ 'is-reversed': card.reversed }"
          :style="{ '--stagger-index': index }"
        >
          <figure class="card-figure">
            <div class="card-frame">
              <img
                :src="`${baseUrl}${card.file}`"
                :alt="card.nameCn"
                class="card-image"
                loading="lazy"
                decoding="async"
              />
              <div class="card-suit-mark" aria-hidden="true">{{ getSuitMark(card.type) }}</div>
              <div class="card-shine" aria-hidden="true"></div>
            </div>
            <figcaption class="card-caption">{{ card.nameCn }}</figcaption>
          </figure>
        </li>
        
        <li v-if="overflowCount > 0" class="overflow-indicator" aria-label="还有 {{ overflowCount }} 张牌">
          <div class="overflow-badge">
            <span class="overflow-count">+{{ overflowCount }}</span>
          </div>
        </li>
      </ul>
    </section>

    <div v-if="record.tags && record.tags.length > 0" class="card-tags">
      <span 
        v-for="tag in record.tags" 
        :key="tag" 
        class="tag"
      >
        <svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
        {{ tag }}
      </span>
    </div>
    
    <footer class="card-footer">
      <div class="footer-decoration" aria-hidden="true">
        <span class="deco-element"></span>
        <span class="deco-center">◈</span>
        <span class="deco-element"></span>
      </div>
      
      <div class="footer-actions">
        <button class="expand-btn" @click.stop>
          <svg 
            class="expand-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="1.5" 
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
          <span>{{ isExpanded ? '收起' : '展开' }}</span>
        </button>
        
        <button 
          class="delete-action"
          @click.stop="handleDelete"
          :aria-label="confirmDelete ? '确认删除此记录' : '删除此记录'"
          :aria-pressed="confirmDelete"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
          <span class="action-text">{{ confirmDelete ? '确认删除' : '删除' }}</span>
        </button>
      </div>
    </footer>

    <Transition name="accordion">
      <div v-if="isExpanded" class="card-detail">
        <div class="detail-content">
          <div class="detail-section">
            <h4 class="detail-title">
              <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              占卜解读
            </h4>
            <div class="detail-text">
              <p>{{ record.reading || '命运的线索隐藏在牌面之中...' }}</p>
            </div>
          </div>
          
          <div class="detail-section">
            <h4 class="detail-title">
              <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              核心启示
            </h4>
            <div class="detail-text">
              <p>{{ record.insight || '仔细倾听内心的声音，答案将自然显现。' }}</p>
            </div>
          </div>
          
          <div class="detail-section">
            <h4 class="detail-title">
              <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              行动建议
            </h4>
            <div class="detail-text">
              <p>{{ record.advice || '保持开放的心态，勇敢地迈出下一步。' }}</p>
            </div>
          </div>
          
          <div v-if="record.cards && record.cards.length > 0" class="detail-section">
            <h4 class="detail-title">
              <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="3" width="8" height="14" rx="2"/>
                <rect x="12" y="7" width="8" height="10" rx="2"/>
              </svg>
              牌面详解
            </h4>
            <div class="cards-detail">
              <div 
                v-for="(card, index) in record.cards" 
                :key="card.cardId || card.id"
                class="card-detail-item"
              >
                <div class="card-position">
                  <span class="position-number">{{ index + 1 }}</span>
                  <span class="position-label">{{ getPositionLabel(index) }}</span>
                </div>
                <div class="card-info">
                  <span class="card-name">{{ getCardInfo(card.cardId || card.id)?.nameCn || '未知卡牌' }}</span>
                  <span v-if="card.reversed" class="card-reversed">逆位</span>
                </div>
                <p class="card-meaning">{{ getCardInfo(card.cardId || card.id)?.meaning || '等待揭示...' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getCardById } from '@/data/cardsData'

const baseUrl = import.meta.env.BASE_URL || ''

const props = defineProps({
  record: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['delete', 'expand'])

const confirmDelete = ref(false)
const isExpanded = ref(false)
let confirmTimer = null

function handleDelete() {
  if (confirmDelete.value) {
    clearTimeout(confirmTimer)
    confirmDelete.value = false
    emit('delete', props.record.id)
    return
  }
  confirmDelete.value = true
  confirmTimer = setTimeout(() => {
    confirmDelete.value = false
  }, 3000)
}

function toggleExpand() {
  isExpanded.value = !isExpanded.value
  emit('expand', props.record.id, isExpanded.value)
}

const formattedDate = computed(() => {
  const d = new Date(props.record.timestamp)
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
})

const previewCards = computed(() => {
  if (!props.record.cards || props.record.cards.length === 0) return []
  return props.record.cards.slice(0, 3).map(c => {
    const cardId = c.cardId || c.id
    const found = getCardById(cardId)
    if (found) {
      return { ...c, ...found, id: cardId }
    }
    return c
  })
})

const overflowCount = computed(() => {
  if (!props.record.cards || props.record.cards.length <= 3) return 0
  return props.record.cards.length - 3
})

function getSpreadTitle(name) {
  const titles = {
    '三牌阵': '时间之流',
    '凯尔特十字': '古老智慧',
    '爱情十字': '心灵之约',
    '单牌阵': '命运一瞥',
    '六芒星': '星辰指引',
    '事业展望': '事业前程',
    '决策十字': '命运抉择',
    '生命之树': '卡巴拉奥秘',
    '灵魂伴侣': '命中注定'
  }
  return titles[name] || '神秘占卜'
}

function getSuitMark(type) {
  const marks = {
    '大阿卡纳': '✦',
    '宝剑': '⚔',
    '权杖': '⚡',
    '圣杯': '❀',
    '钱币': '◈'
  }
  return marks[type] || '●'
}

function getPositionLabel(index) {
  const labels = ['过去', '现在', '未来', '阻碍', '建议', '结果', '隐藏', '外部']
  return labels[index] || `位置${index + 1}`
}

function getCardInfo(cardId) {
  return getCardById(cardId)
}
</script>

<style scoped>
.history-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    160deg,
    #1a1520 0%,
    #13131f 30%,
    #1a1520 60%,
    #13131f 100%
  );
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: 
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.4s ease,
    border-color 0.4s ease;
  outline: none;
  overflow: hidden;
  border: 1px solid rgba(201, 168, 76, 0.08);
}

.card-paper-texture {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(ellipse at 20% 20%, rgba(139, 90, 43, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(139, 90, 43, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(201, 168, 76, 0.03) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.card-gold-border-left {
  position: absolute;
  left: 0;
  top: 15%;
  bottom: 15%;
  width: 3px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(201, 168, 76, 0.3) 20%,
    var(--color-gold) 50%,
    rgba(201, 168, 76, 0.3) 80%,
    transparent 100%
  );
  border-radius: 0 2px 2px 0;
  box-shadow: 0 0 10px rgba(201, 168, 76, 0.3);
}

.card-corner-decoration {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 1.5px solid rgba(201, 168, 76, 0.35);
  z-index: 1;
}

.card-corner-decoration.top-left {
  top: 6px;
  left: 6px;
  border-right: none;
  border-bottom: none;
  border-radius: 4px 0 0 0;
}

.card-corner-decoration.top-right {
  top: 6px;
  right: 6px;
  border-left: none;
  border-bottom: none;
  border-radius: 0 4px 0 0;
}

.card-corner-decoration.bottom-left {
  bottom: 6px;
  left: 6px;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 4px;
}

.card-corner-decoration.bottom-right {
  bottom: 6px;
  right: 6px;
  border-left: none;
  border-top: none;
  border-radius: 0 0 4px 0;
}

.history-card:hover,
.history-card:focus-visible {
  transform: translateY(-6px);
  border-color: rgba(201, 168, 76, 0.3);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.5),
    0 0 80px rgba(201, 168, 76, 0.08),
    0 0 120px rgba(123, 79, 211, 0.04);
}

.history-card:focus-visible {
  outline: 2px solid rgba(201, 168, 76, 0.5);
  outline-offset: 4px;
}

.card-border-glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(201, 168, 76, 0.5) 0%,
    rgba(123, 79, 211, 0.3) 50%,
    rgba(201, 168, 76, 0.5) 100%
  );
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 2;
}

.history-card:hover .card-border-glow,
.history-card:focus-visible .card-border-glow {
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;
  position: relative;
  z-index: 3;
}

.spread-identity {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.spread-emblem {
  display: none;
}

.spread-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: transparent;
  border: 1px solid var(--color-gold);
  border-radius: 20px;
  font-size: 0.78rem;
  font-family: var(--font-display);
  letter-spacing: 0.04em;
  color: var(--color-gold);
  width: fit-content;
}

.spread-name {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--color-gold);
  margin: 0;
  letter-spacing: 0.06em;
  text-shadow: 0 0 20px rgba(201, 168, 76, 0.4);
}

.record-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}

.record-time {
  font-size: 0.74rem;
  color: var(--color-text-muted);
  font-family: var(--font-display);
  letter-spacing: 0.03em;
}

.card-count-badge {
  display: flex;
  align-items: baseline;
  gap: 3px;
  padding: 5px 10px;
  background: rgba(201, 168, 76, 0.08);
  border: 1px solid rgba(201, 168, 76, 0.2);
  border-radius: 16px;
}

.count-value {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-gold);
}

.count-unit {
  font-size: 0.68rem;
  color: var(--color-text-muted);
}

.card-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  position: relative;
  z-index: 3;
}

.divider-line {
  flex: 1;
  height: 1px;
  margin: 0;
  border: none;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(201, 168, 76, 0.3),
    rgba(139, 90, 43, 0.2)
  );
}

.divider-line:last-child {
  background: linear-gradient(
    270deg,
    transparent,
    rgba(201, 168, 76, 0.3),
    rgba(139, 90, 43, 0.2)
  );
}

.divider-ornament {
  width: 16px;
  height: 16px;
  color: var(--color-gold);
  opacity: 0.5;
  animation: ornamentPulse 3.5s ease-in-out infinite;
}

@keyframes ornamentPulse {
  0%, 100% { 
    transform: scale(1) rotate(0deg); 
    opacity: 0.4; 
  }
  50% { 
    transform: scale(1.1) rotate(12deg); 
    opacity: 0.65; 
  }
}

.card-preview {
  margin-bottom: 14px;
  position: relative;
  z-index: 3;
}

.preview-list {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.preview-item {
  animation: cardReveal 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  animation-delay: calc(var(--stagger-index) * 0.12s);
}

@keyframes cardReveal {
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.88);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.card-figure {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.card-frame {
  position: relative;
  width: 52px;
  height: 78px;
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(201, 168, 76, 0.15);
}

.history-card:hover .card-frame {
  transform: scale(1.08);
}

.preview-item:hover .card-frame {
  transform: scale(1.15) translateY(-8px);
  z-index: 20;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

.card-suit-mark {
  position: absolute;
  top: 3px;
  left: 3px;
  font-size: 8px;
  font-weight: 700;
  color: rgba(201, 168, 76, 0.6);
  pointer-events: none;
}

.card-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.08),
    transparent
  );
  transition: left 0.6s ease;
  pointer-events: none;
}

.preview-item:hover .card-shine {
  left: 100%;
}

.preview-item.is-reversed .card-frame {
  transform: rotate(180deg);
}

.preview-item.is-reversed:hover .card-frame {
  transform: rotate(180deg) scale(1.15) translateY(-8px);
}

.card-caption {
  font-size: 0.64rem;
  color: var(--color-text-secondary);
  text-align: center;
  max-width: 52px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.overflow-indicator {
  list-style: none;
}

.overflow-badge {
  width: 52px;
  height: 78px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: linear-gradient(
    145deg,
    rgba(30, 20, 45, 0.9),
    rgba(20, 12, 30, 0.95)
  );
  border: 1px dashed rgba(201, 168, 76, 0.3);
  position: relative;
  overflow: hidden;
}

.overflow-badge::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(201, 168, 76, 0.12) 0%,
    transparent 60%
  );
  animation: overflowGlow 2s ease-in-out infinite;
}

@keyframes overflowGlow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.65; }
}

.overflow-count {
  position: relative;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-gold);
  text-shadow: 0 0 10px rgba(201, 168, 76, 0.4);
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
  position: relative;
  z-index: 3;
}

.tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: rgba(201, 168, 76, 0.06);
  border: 1px solid rgba(201, 168, 76, 0.15);
  border-radius: 10px;
  font-size: 0.72rem;
  color: var(--color-text-secondary);
  font-family: var(--font-display);
  letter-spacing: 0.02em;
}

.tag-icon {
  width: 12px;
  height: 12px;
  color: var(--color-gold);
  opacity: 0.6;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 3;
}

.footer-decoration {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.deco-element {
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(201, 168, 76, 0.2),
    transparent
  );
}

.deco-element:last-child {
  background: linear-gradient(
    270deg,
    rgba(201, 168, 76, 0.2),
    transparent
  );
}

.deco-center {
  color: var(--color-gold);
  font-size: 0.7rem;
  opacity: 0.4;
}

.footer-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.expand-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  background: transparent;
  border: 1px solid var(--color-gold);
  border-radius: 8px;
  color: var(--color-gold);
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.expand-btn:hover {
  background: var(--color-gold);
  color: var(--color-bg-primary);
}

.expand-icon {
  width: 14px;
  height: 14px;
  transition: transform 0.3s ease;
}

.history-card.is-expanded .expand-icon {
  transform: rotate(180deg);
}

.delete-action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  background: transparent;
  border: 1px solid var(--color-text-muted);
  border-radius: 8px;
  color: var(--color-text-muted);
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-action:hover {
  background: rgba(248, 113, 113, 0.1);
  border-color: var(--color-error);
  color: var(--color-error);
}

.delete-action:focus-visible {
  outline: 2px solid rgba(248, 113, 113, 0.5);
  outline-offset: 2px;
}

.delete-action:active {
  transform: scale(0.97);
}

.delete-action svg {
  width: 14px;
  height: 14px;
}

.card-detail {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid rgba(201, 168, 76, 0.1);
  position: relative;
  z-index: 3;
}

.detail-content {
  animation: detailSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes detailSlideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.detail-section {
  margin-bottom: 16px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-size: 0.88rem;
  color: var(--color-gold);
  margin: 0 0 10px;
  letter-spacing: 0.04em;
}

.section-icon {
  width: 16px;
  height: 16px;
  opacity: 0.7;
}

.detail-text {
  padding: 10px 14px;
  background: rgba(201, 168, 76, 0.04);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(201, 168, 76, 0.06);
}

.detail-text p {
  margin: 0;
  font-size: 0.88rem;
  color: var(--color-text-primary);
  line-height: 1.8;
  font-style: italic;
}

.cards-detail {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-detail-item {
  padding: 10px 14px;
  background: rgba(201, 168, 76, 0.03);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--color-gold);
}

.card-position {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}

.position-number {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(201, 168, 76, 0.1);
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-gold);
}

.position-label {
  font-size: 0.74rem;
  color: var(--color-text-muted);
  font-family: var(--font-display);
}

.card-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}

.card-name {
  font-size: 0.88rem;
  color: var(--color-text-primary);
  font-weight: 500;
}

.card-reversed {
  padding: 2px 6px;
  background: rgba(248, 113, 113, 0.1);
  border-radius: 4px;
  font-size: 0.64rem;
  color: var(--color-error);
}

.card-meaning {
  margin: 0;
  font-size: 0.82rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  margin-top: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 800px;
}

@media (max-width: 768px) {
  .history-card {
    padding: 20px;
  }

  .spread-name {
    font-size: 1.2rem;
  }

  .card-frame {
    width: 46px;
    height: 70px;
  }

  .overflow-badge {
    width: 46px;
    height: 70px;
  }

  .card-caption {
    max-width: 46px;
  }
}

@media (max-width: 480px) {
  .history-card {
    padding: 16px;
    border-radius: 12px;
  }

  .spread-tag {
    padding: 3px 10px;
    font-size: 0.74rem;
  }

  .spread-name {
    font-size: 1.1rem;
  }

  .card-frame {
    width: 40px;
    height: 62px;
  }

  .overflow-badge {
    width: 40px;
    height: 62px;
  }

  .card-caption {
    display: none;
  }

  .expand-btn,
  .delete-action {
    padding: 6px 10px;
    font-size: 0.74rem;
  }

  .detail-text p {
    font-size: 0.82rem;
  }
}
</style>