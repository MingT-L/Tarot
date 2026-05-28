<template>
  <nav class="top-navbar" v-show="isDesktop">
    <div class="navbar-inner">
      <router-link to="/" class="app-brand">
        <svg class="brand-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/>
        </svg>
        <span class="brand-text">神秘塔罗</span>
      </router-link>

      <div ref="navLinksRef" class="nav-links">
        <router-link
          v-for="(link, index) in navLinks"
          :key="link.path"
          :to="link.path"
          class="nav-link"
          active-class="nav-link--active"
          @click="handleNavClick(index)"
        >
          <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
          <span class="nav-text">{{ link.label }}</span>
        </router-link>
        <div class="nav-indicator" :style="indicatorStyle"></div>
      </div>

      <div class="navbar-right">
        <svg class="navbar-decoration" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/>
        </svg>
      </div>
    </div>
    <div class="navbar-glow-line"></div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { navLinks } from '@/data/constants'

const route = useRoute()

const isDesktop = ref(window.innerWidth >= 768)
const activeIndex = ref(0)
const indicatorStyle = ref({})
const navLinksRef = ref(null)

function handleResize() {
  isDesktop.value = window.innerWidth >= 768
}

function handleNavClick(index) {
  activeIndex.value = index
}

function updateIndicator() {
  if (!navLinksRef.value) return
  const activeLink = navLinksRef.value.querySelector('.nav-link--active')
  if (activeLink) {
    const rect = activeLink.getBoundingClientRect()
    const navRect = navLinksRef.value.getBoundingClientRect()
    indicatorStyle.value = {
      left: `${rect.left - navRect.left}px`,
      width: `${rect.width}px`
    }
    activeIndex.value = navLinks.findIndex(l => l.path === route.path)
  }
}

watch(() => route.path, () => {
  setTimeout(updateIndicator, 10)
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
  updateIndicator()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.top-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background: linear-gradient(
    180deg,
    rgba(10, 10, 18, 0.92) 0%,
    rgba(10, 10, 18, 0.85) 100%
  );
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid rgba(201, 168, 76, 0.08);
  transition: all 0.4s ease;
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
}

.navbar-glow-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(201, 168, 76, 0.4) 20%,
    rgba(201, 168, 76, 0.6) 50%,
    rgba(201, 168, 76, 0.4) 80%,
    transparent 100%
  );
  box-shadow: 0 0 12px rgba(201, 168, 76, 0.2);
}

.app-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--color-gold);
  font-family: var(--font-display);
  position: relative;
}

.app-brand::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150%;
  height: 150%;
  background: radial-gradient(
    ellipse at center,
    rgba(201, 168, 76, 0.15) 0%,
    transparent 70%
  );
  border-radius: 50%;
  pointer-events: none;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.app-brand:hover::before {
  opacity: 1;
}

.brand-icon {
  width: 28px;
  height: 28px;
  color: var(--color-gold-light);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
  filter: drop-shadow(0 0 10px rgba(201, 168, 76, 0.4));
}

.app-brand:hover .brand-icon {
  transform: rotate(25deg) scale(1.2);
}

.brand-text {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-shadow: 
    0 0 20px rgba(201, 168, 76, 0.4),
    0 0 40px rgba(201, 168, 76, 0.2),
    0 0 60px rgba(201, 168, 76, 0.1);
  transition: text-shadow 0.4s ease;
}

.app-brand:hover .brand-text {
  text-shadow: 
    0 0 30px rgba(201, 168, 76, 0.6),
    0 0 60px rgba(201, 168, 76, 0.3),
    0 0 90px rgba(201, 168, 76, 0.15);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  font-family: var(--font-display);
  letter-spacing: 0.04em;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.nav-link:hover {
  color: var(--color-gold-light);
  background: rgba(201, 168, 76, 0.08);
}

.nav-link--active {
  color: var(--color-gold);
  background: rgba(201, 168, 76, 0.1);
}

.nav-indicator {
  position: absolute;
  bottom: 2px;
  height: 2.5px;
  background: linear-gradient(
    90deg,
    var(--color-gold-dark),
    var(--color-gold),
    var(--color-gold-light),
    var(--color-gold)
  );
  border-radius: 2px;
  transition: left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
              width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 
    0 0 10px rgba(201, 168, 76, 0.5),
    0 0 20px rgba(201, 168, 76, 0.3);
  z-index: 0;
}

.nav-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.nav-text {
  letter-spacing: 0.04em;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.navbar-decoration {
  width: 22px;
  height: 22px;
  color: var(--color-gold);
  opacity: 0.4;
  flex-shrink: 0;
  animation: navStarPulse 3s ease-in-out infinite;
}

@keyframes navStarPulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

@media (max-width: 767px) {
  .top-navbar {
    display: none;
  }
}
</style>