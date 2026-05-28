<template>
  <!-- 移动端底部导航栏：仅在移动端（768px以下）显示 -->
  <nav class="mobile-nav" v-show="isMobile" aria-label="移动端导航">
    <div class="mobile-nav-inner">
      <router-link
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        class="mobile-nav-link"
        active-class="mobile-nav-link--active"
      >
        <svg class="mobile-nav-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <template v-if="link.icon === 'home'">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </template>
          <template v-if="link.icon === 'library'">
            <rect x="2" y="3" width="8" height="14" rx="2"/>
            <rect x="12" y="7" width="8" height="10" rx="2"/>
            <line x1="2" y1="7" x2="10" y2="7"/>
            <line x1="12" y1="11" x2="20" y2="11"/>
          </template>
          <template v-if="link.icon === 'sparkle'">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/>
          </template>
          <template v-if="link.icon === 'history'">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </template>
        </svg>
        <span class="mobile-nav-label">{{ link.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { navLinks as rawNavLinks } from '@/data/constants'

const navLinks = rawNavLinks.map(({ path, mobileLabel, icon }) => ({ path, label: mobileLabel, icon }))

/** 是否为移动端视口 */
const isMobile = ref(window.innerWidth < 768)

/** 窗口尺寸变化时更新移动端判断 */
function handleResize() {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* ==================== 底部导航栏主体 ==================== */
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background: rgba(13, 10, 20, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid var(--color-border);
  /* 安全区域适配 */
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.mobile-nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 56px;
}

/* ==================== 导航链接 ==================== */
.mobile-nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  text-decoration: none;
  transition: all var(--transition-fast);
  min-width: 56px;
  position: relative;
  overflow: hidden;
}

/* 点击波纹效果 */
.mobile-nav-link::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(201, 168, 76, 0.25);
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease, opacity 0.4s ease;
  pointer-events: none;
  opacity: 0;
}

.mobile-nav-link:active::after {
  width: 200%;
  height: 200%;
  opacity: 1;
}

.mobile-nav-link:hover {
  color: var(--color-text-secondary);
}

/* 当前路由激活样式 */
.mobile-nav-link--active {
  color: var(--color-gold);
}

.mobile-nav-link--active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: var(--color-gold);
  border-radius: 1px;
}

.mobile-nav-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.mobile-nav-label {
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.03em;
}
</style>