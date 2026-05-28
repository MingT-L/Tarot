<template>
  <div class="app-wrapper">
    <FloatingNav />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <MobileNav />
  </div>
</template>

<script setup>
import FloatingNav from '@/components/FloatingNav.vue'
import MobileNav from '@/components/MobileNav.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}

.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background-image: url('./assets/bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
}

.app-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(13, 10, 20, 0.3) 0%,
    rgba(13, 10, 20, 0.5) 50%,
    rgba(13, 10, 20, 0.7) 100%
  );
  pointer-events: none;
  z-index: 0;
}

.main-content {
  flex: 1;
  position: relative;
  z-index: 1;
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
