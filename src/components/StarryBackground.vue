<template>
  <div class="starry-background" aria-hidden="true">
    <div
      v-for="i in 60"
      :key="i"
      class="star"
      :class="`star--${i}`"
      :style="getStarStyle(i)"
    ></div>
  </div>
</template>

<script setup>
function getStarStyle(index) {
  const seed = index * 137.508
  const x = (seed % 100)
  const y = ((seed * 1.618) % 100)
  const size = 1 + (index % 3) * 0.5
  const duration = 3 + (index % 4) * 1.5
  const delay = index * 0.15
  const opacity = 0.3 + (index % 5) * 0.12

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    opacity: opacity
  }
}
</script>

<style scoped>
.starry-background {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.star {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(201, 168, 76, 0.9) 0%,
    rgba(201, 168, 76, 0.4) 40%,
    transparent 70%
  );
  animation: starTwinkle ease-in-out infinite alternate;
  box-shadow: 0 0 4px rgba(201, 168, 76, 0.5);
}

.star::after {
  content: '';
  position: absolute;
  inset: -50%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(201, 168, 76, 0.3) 0%,
    transparent 70%
  );
  animation: starPulse ease-in-out infinite;
}

@keyframes starTwinkle {
  0% {
    transform: scale(0.8);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.9);
    opacity: 0.4;
  }
}

@keyframes starPulse {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

.star--1 { animation-name: starTwinkleGold; }
.star--2 { animation-name: starTwinklePurple; }
.star--3 { animation-name: starTwinkleWhite; }

@keyframes starTwinkleGold {
  0% {
    transform: scale(0.6) rotate(0deg);
    opacity: 0.15;
    box-shadow: 0 0 3px rgba(201, 168, 76, 0.4);
  }
  100% {
    transform: scale(1.3) rotate(180deg);
    opacity: 0.9;
    box-shadow: 0 0 8px rgba(201, 168, 76, 0.7), 0 0 15px rgba(201, 168, 76, 0.3);
  }
}

@keyframes starTwinklePurple {
  0% {
    transform: scale(0.5) translateY(0);
    opacity: 0.2;
    box-shadow: 0 0 2px rgba(139, 95, 191, 0.4);
  }
  100% {
    transform: scale(1.1) translateY(-5px);
    opacity: 0.7;
    box-shadow: 0 0 6px rgba(139, 95, 191, 0.6), 0 0 12px rgba(139, 95, 191, 0.25);
  }
}

@keyframes starTwinkleWhite {
  0% {
    transform: scale(0.7);
    opacity: 0.25;
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.3);
  }
  100% {
    transform: scale(1.4);
    opacity: 0.85;
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.5), 0 0 10px rgba(201, 168, 76, 0.3);
  }
}

.star:nth-child(3n) {
  background: radial-gradient(
    circle,
    rgba(139, 95, 191, 0.9) 0%,
    rgba(139, 95, 191, 0.4) 40%,
    transparent 70%
  );
}

.star:nth-child(5n) {
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.5) 40%,
    transparent 70%
  );
}

.star:nth-child(7n) {
  width: 3px !important;
  height: 3px !important;
  background: radial-gradient(
    circle,
    rgba(201, 168, 76, 1) 0%,
    rgba(201, 168, 76, 0.6) 30%,
    transparent 60%
  );
  box-shadow: 0 0 8px rgba(201, 168, 76, 0.8), 0 0 15px rgba(201, 168, 76, 0.4);
}

.star:nth-child(11n) {
  animation-duration: 5s !important;
  animation-timing-function: ease-in-out;
}

.star:nth-child(13n) {
  animation-duration: 4s !important;
  animation-timing-function: ease;
}

.star:nth-child(17n) {
  animation-duration: 6s !important;
  animation-timing-function: ease-out;
}
</style>
