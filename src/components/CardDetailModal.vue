<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-particles">
        <span v-for="i in 20" :key="i" class="modal-particle" :style="getParticleStyle(i)"></span>
      </div>

      <Transition name="modal-content" appear>
        <div class="modal-container" v-if="visible">
          <!-- 装饰性角落 -->
          <div class="modal-corner modal-corner--tl"></div>
          <div class="modal-corner modal-corner--tr"></div>
          <div class="modal-corner modal-corner--bl"></div>
          <div class="modal-corner modal-corner--br"></div>

          <!-- 关闭按钮 -->
          <button class="modal-close" @click="$emit('close')" aria-label="关闭">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M14 4L4 14M4 4l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>

          <!-- 左栏：牌面图像 -->
          <div class="modal-left">
            <div class="modal-image-frame">
              <div class="modal-frame-outer"></div>
              <div class="modal-image-wrapper">
                <img
                  :src="`/${card.file}`"
                  :alt="card.nameCn"
                  class="modal-image"
                />
                <div class="modal-image-shine"></div>
              </div>
              <div class="modal-frame-inner"></div>
            </div>
            <div class="modal-card-name">
              <span class="modal-name-cn">{{ card.nameCn }}</span>
              <span class="modal-name-en">{{ card.nameEn }}</span>
            </div>
          </div>

          <!-- 右栏：牌面详情 -->
          <div class="modal-right">
            <div class="modal-header">
              <span class="modal-category-badge">
                <span class="badge-icon">✦</span>
                {{ categoryLabel }}
              </span>
            </div>

            <!-- 牌面描述 -->
            <div class="modal-section">
              <div class="section-header">
                <span class="section-icon">◈</span>
                <h3 class="section-title">牌面解读</h3>
              </div>
              <p class="section-text">{{ card.description }}</p>
            </div>

            <div class="modal-divider">
              <span class="divider-line"></span>
              <span class="divider-symbol">◆</span>
              <span class="divider-line"></span>
            </div>

            <!-- 正位解读 -->
            <div class="modal-section">
              <div class="section-header section-header--upright">
                <span class="section-icon">▲</span>
                <h3 class="section-title">正位解读</h3>
              </div>
              <p class="section-text">{{ card.meaning?.upright }}</p>
              <div class="keyword-tags" v-if="uprightKeywords.length">
                <span
                  v-for="kw in uprightKeywords"
                  :key="kw"
                  class="keyword-tag keyword-tag--upright"
                >
                  <span class="tag-dot"></span>
                  {{ kw }}
                </span>
              </div>
            </div>

            <div class="modal-divider">
              <span class="divider-line"></span>
              <span class="divider-symbol">◆</span>
              <span class="divider-line"></span>
            </div>

            <!-- 逆位解读 -->
            <div class="modal-section" v-if="card.meaning?.reversed">
              <div class="section-header section-header--reversed">
                <span class="section-icon">▼</span>
                <h3 class="section-title">逆位解读</h3>
              </div>
              <p class="section-text">{{ card.meaning.reversed }}</p>
              <div class="keyword-tags" v-if="reversedKeywords.length">
                <span
                  v-for="kw in reversedKeywords"
                  :key="kw"
                  class="keyword-tag keyword-tag--reversed"
                >
                  <span class="tag-dot"></span>
                  {{ kw }}
                </span>
              </div>
            </div>
          </div>

          <!-- 底部装饰 -->
          <div class="modal-footer">
            <span class="footer-line"></span>
            <span class="footer-symbol">✧</span>
            <span class="footer-line"></span>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { categoryMap } from '@/data/constants'

const props = defineProps({
  card: {
    type: Object,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])

const categoryLabel = computed(() => {
  return categoryMap[props.card.category] || props.card.category
})

const uprightKeywords = computed(() => {
  if (!props.card.keywords?.upright) return []
  return props.card.keywords.upright.split('、').map(k => k.trim()).filter(Boolean)
})

const reversedKeywords = computed(() => {
  if (!props.card.keywords?.reversed) return []
  return props.card.keywords.reversed.split('、').map(k => k.trim()).filter(Boolean)
})

function getParticleStyle(index) {
  const seed = index * 123.456
  const x = (seed % 90) + 5
  const y = (seed * 1.618) % 90
  const size = 2 + (index % 3)
  const duration = 3 + (index % 3) * 2
  const delay = index * 0.3

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  }
}
</script>

<style scoped>
/* ===== 遮罩层 ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 10, 18, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  overflow: hidden;
}

/* ===== 粒子效果 ===== */
.modal-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.modal-particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(201, 168, 76, 0.8) 0%,
    rgba(201, 168, 76, 0.3) 50%,
    transparent 70%
  );
  animation: particleFloat ease-in-out infinite alternate;
  box-shadow: 0 0 6px rgba(201, 168, 76, 0.4);
}

@keyframes particleFloat {
  0% {
    transform: translateY(0) scale(0.5);
    opacity: 0.3;
  }
  100% {
    transform: translateY(-30px) scale(1);
    opacity: 0.8;
  }
}

/* ===== 模态框容器 ===== */
.modal-container {
  position: relative;
  display: flex;
  width: 100%;
  max-width: 900px;
  max-height: 92vh;
  background: linear-gradient(165deg, rgba(19, 19, 31, 0.98) 0%, rgba(15, 15, 26, 0.98) 100%);
  border: 1px solid rgba(201, 168, 76, 0.2);
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 0 80px rgba(201, 168, 76, 0.12),
    0 0 120px rgba(74, 30, 110, 0.15),
    0 32px 80px rgba(0, 0, 0, 0.8),
    inset 0 1px 0 rgba(201, 168, 76, 0.1);
}

.modal-container::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    radial-gradient(ellipse at 0% 0%, rgba(74, 30, 110, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 100% 100%, rgba(201, 168, 76, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

/* ===== 装饰性角落 ===== */
.modal-corner {
  position: absolute;
  width: 40px;
  height: 40px;
  z-index: 5;
}

.modal-corner::before,
.modal-corner::after {
  content: '';
  position: absolute;
  background: linear-gradient(135deg, #c9a84c 0%, rgba(201, 168, 76, 0.3) 100%);
}

.modal-corner::before {
  width: 20px;
  height: 2px;
}

.modal-corner::after {
  width: 2px;
  height: 20px;
}

.modal-corner--tl {
  top: 12px;
  left: 12px;
}

.modal-corner--tl::before { top: 0; left: 0; }
.modal-corner--tl::after { top: 0; left: 0; }

.modal-corner--tr {
  top: 12px;
  right: 12px;
}

.modal-corner--tr::before { top: 0; right: 0; }
.modal-corner--tr::after { top: 0; right: 0; }

.modal-corner--bl {
  bottom: 12px;
  left: 12px;
}

.modal-corner--bl::before { bottom: 0; left: 0; }
.modal-corner--bl::after { bottom: 0; left: 0; }

.modal-corner--br {
  bottom: 12px;
  right: 12px;
}

.modal-corner--br::before { bottom: 0; right: 0; }
.modal-corner--br::after { bottom: 0; right: 0; }

/* ===== 关闭按钮 ===== */
.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 20;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(30, 20, 48, 0.9);
  border: 1px solid rgba(201, 168, 76, 0.15);
  border-radius: 50%;
  color: rgba(232, 228, 218, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-close:hover {
  border-color: #c9a84c;
  color: #c9a84c;
  background: rgba(201, 168, 76, 0.12);
  transform: rotate(90deg);
  box-shadow: 0 0 20px rgba(201, 168, 76, 0.3);
}

/* ===== 左栏：牌面图像 ===== */
.modal-left {
  flex: 0 0 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
  background: radial-gradient(ellipse at center, rgba(30, 20, 48, 0.8), rgba(13, 10, 20, 0.95));
  border-right: 1px solid rgba(201, 168, 76, 0.1);
}

.modal-image-frame {
  position: relative;
  width: 100%;
  max-width: 260px;
}

.modal-frame-outer {
  position: absolute;
  inset: -12px;
  border: 1px solid rgba(201, 168, 76, 0.15);
  border-radius: 14px;
  background: linear-gradient(145deg, rgba(201, 168, 76, 0.05), transparent);
}

.modal-frame-inner {
  position: absolute;
  inset: -6px;
  border: 1px solid rgba(201, 168, 76, 0.08);
  border-radius: 12px;
}

.modal-image-wrapper {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.6),
    0 0 30px rgba(201, 168, 76, 0.1);
}

.modal-image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-image-wrapper:hover .modal-image {
  transform: scale(1.03);
}

.modal-image-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(201, 168, 76, 0.08) 50%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.modal-image-wrapper:hover .modal-image-shine {
  opacity: 1;
}

.modal-card-name {
  text-align: center;
  margin-top: 24px;
}

.modal-name-cn {
  display: block;
  font-family: var(--font-display), 'Cinzel Decorative', serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #c9a84c;
  letter-spacing: 0.1em;
  text-shadow: 0 0 30px rgba(201, 168, 76, 0.5);
  margin-bottom: 4px;
}

.modal-name-en {
  display: block;
  font-size: 0.85rem;
  color: rgba(232, 228, 218, 0.5);
  font-style: italic;
  letter-spacing: 0.05em;
}

/* ===== 右栏：详情内容 ===== */
.modal-right {
  flex: 1;
  padding: 32px 32px 24px;
  overflow-y: auto;
  max-height: 92vh;
  scrollbar-width: thin;
  scrollbar-color: rgba(201, 168, 76, 0.2) transparent;
}

.modal-right::-webkit-scrollbar {
  width: 4px;
}

.modal-right::-webkit-scrollbar-thumb {
  background: rgba(201, 168, 76, 0.3);
  border-radius: 2px;
}

.modal-header {
  margin-bottom: 20px;
}

.modal-category-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border: 1px solid rgba(201, 168, 76, 0.2);
  border-radius: 20px;
  font-size: 0.75rem;
  color: #e8d48b;
  background: rgba(201, 168, 76, 0.06);
  letter-spacing: 0.08em;
}

.badge-icon {
  font-size: 0.6rem;
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* ===== 内容区块 ===== */
.modal-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.section-icon {
  font-size: 0.8rem;
  color: #c9a84c;
  opacity: 0.6;
}

.section-title {
  font-family: var(--font-display), serif;
  font-size: 1rem;
  font-weight: 600;
  color: #c9a84c;
  letter-spacing: 0.08em;
}

.section-header--upright .section-icon,
.section-header--upright .section-title {
  color: #c9a84c;
}

.section-header--reversed .section-icon,
.section-header--reversed .section-title {
  color: #9b7ed9;
}

.section-text {
  font-size: 0.9rem;
  color: rgba(232, 228, 218, 0.85);
  line-height: 1.8;
  margin-bottom: 12px;
}

/* ===== 神秘分隔线 ===== */
.modal-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.2), transparent);
}

.divider-symbol {
  font-size: 0.5rem;
  color: #c9a84c;
  opacity: 0.4;
}

/* ===== 关键词标签 ===== */
.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 0.78rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.keyword-tag:hover {
  transform: translateY(-2px);
}

.keyword-tag--upright {
  background: rgba(201, 168, 76, 0.08);
  color: #e8d48b;
  border: 1px solid rgba(201, 168, 76, 0.2);
  box-shadow: 0 0 15px rgba(201, 168, 76, 0.1);
}

.keyword-tag--upright:hover {
  background: rgba(201, 168, 76, 0.15);
  box-shadow: 0 0 25px rgba(201, 168, 76, 0.2);
}

.keyword-tag--reversed {
  background: rgba(155, 126, 217, 0.08);
  color: #c9a3f0;
  border: 1px solid rgba(155, 126, 217, 0.2);
  box-shadow: 0 0 15px rgba(155, 126, 217, 0.1);
}

.keyword-tag--reversed:hover {
  background: rgba(155, 126, 217, 0.15);
  box-shadow: 0 0 25px rgba(155, 126, 217, 0.2);
}

.tag-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.6;
}

/* ===== 底部装饰 ===== */
.modal-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(0deg, rgba(15, 15, 26, 0.9), transparent);
}

.footer-line {
  flex: 1;
  height: 1px;
  max-width: 100px;
  background: linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.15), transparent);
}

.footer-symbol {
  font-size: 0.6rem;
  color: #c9a84c;
  opacity: 0.3;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .modal-container {
    flex-direction: column;
    max-height: 95vh;
  }

  .modal-left {
    flex: 0 0 auto;
    padding: 32px 24px 20px;
    border-right: none;
    border-bottom: 1px solid rgba(201, 168, 76, 0.1);
  }

  .modal-image-frame {
    max-width: 180px;
  }

  .modal-right {
    padding: 20px 24px;
    max-height: none;
  }

  .modal-corner {
    width: 30px;
    height: 30px;
  }

  .modal-corner::before {
    width: 15px;
    height: 2px;
  }

  .modal-corner::after {
    width: 2px;
    height: 15px;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 8px;
    align-items: flex-end;
  }

  .modal-container {
    max-width: 100%;
    max-height: 92vh;
    border-radius: 16px 16px 0 0;
  }

  .modal-left {
    padding: 24px 16px 16px;
  }

  .modal-image-frame {
    max-width: 140px;
  }

  .modal-right {
    padding: 16px;
  }

  .modal-name-cn {
    font-size: 1.2rem;
  }

  .modal-close {
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
  }
}

/* ===== 进入/离开动画 ===== */
.modal-content-enter-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-content-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.6, 1);
}

.modal-content-enter-from {
  opacity: 0;
  transform: scale(0.85) translateY(30px);
}

.modal-content-enter-from .modal-container {
  transform: scale(0.9) translateY(40px);
  opacity: 0;
}

.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.92);
}

.modal-content-leave-to .modal-container {
  opacity: 0;
  transform: scale(0.95);
}

.modal-content-enter-active .modal-container {
  transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-content-leave-active .modal-container {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
}
</style>
