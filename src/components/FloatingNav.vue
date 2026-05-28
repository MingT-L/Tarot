<template>
    <!--
    FloatingNav - 左侧悬浮导航栏
    半隐藏设计 + hover 展开 + 呼吸光带 + 按压缩放动画 + 光圈爆发
  -->
    <nav
        class="floating-nav"
        :class="{
            'is-expanded': isExpanded,
            'is-loaded': isLoaded,
            'is-hovering': isHovering
        }"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
    >
        <!-- 金色呼吸光带 -->
        <div class="floating-nav__breathing-strip"></div>

        <!-- 导航图标列表 -->
        <ul class="floating-nav__items">
            <li
                v-for="(item, idx) in navItems"
                :key="item.path"
                class="floating-nav__item"
                :class="{
                    'is-active': isActive(item.path),
                    'is-rippling': rippleIdx === idx
                }"
                @click="handleItemClick(item, idx)"
            >
                <!-- 图标容器 -->
                <div class="floating-nav__icon-wrap">
                    <!-- 金色辉光背景圆 -->
                    <div class="floating-nav__glow-bg"></div>
                    <img :src="item.icon" :alt="item.label" class="floating-nav__icon" />
                    <!-- 当前页面指示器圆点 -->
                    <span v-if="isActive(item.path)" class="floating-nav__indicator"></span>
                </div>

                <!-- 文字标签（始终可见） -->
                <span class="floating-nav__label">{{ item.label }}</span>

                <!-- 点击爆发光圈 -->
                <span v-if="rippleIdx === idx" class="floating-nav__ripple"></span>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import { navLinks } from "@/data/constants"
import menuIcon from "@/assets/menu.png"
import menu2Icon from "@/assets/menu2.png"
import menu4Icon from "@/assets/menu4.png"
import meu3Icon from "@/assets/meu3.png"

const router = useRouter()
const route = useRoute()

// 图标素材对应：menu=殿堂 menu2=秘典 menu4=启命 meu3=觅迹
const iconMap = [menuIcon, menu2Icon, meu3Icon, menu4Icon]
const navItems = navLinks.map((link, i) => ({ ...link, icon: iconMap[i] }))

// ==================== 状态管理 ====================
const isExpanded = ref(false)
const isHovering = ref(false)
const isLoaded = ref(false)
const rippleIdx = ref(-1)
let hideTimer = null

// ==================== 鼠标交互 ====================
function handleMouseEnter() {
    // 清除隐藏定时器
    if (hideTimer) {
        clearTimeout(hideTimer)
        hideTimer = null
    }
    isHovering.value = true
    isExpanded.value = true
}

function handleMouseLeave() {
    isHovering.value = false
    // 延迟 0.8s 后自动收回
    hideTimer = setTimeout(() => {
        isExpanded.value = false
        hideTimer = null
    }, 800)
}

// ==================== 判断当前活跃页面 ====================
// 使用 computed 确保响应式绑定 route.path 变化
const activePath = computed(() => {
  const path = route.path
  // 占卜结果页面高亮「启命」菜单
  if (path.startsWith('/result')) return '/divination'
  return path
})

function isActive(path) {
  if (path === '/') return activePath.value === path
  return activePath.value.startsWith(path)
}

// 监听路由变化，确保菜单状态同步
watch(() => route.path, () => {
  // 路由变化时自动触发 computed 重新计算
})

// ==================== 导航项点击 ====================
function handleItemClick(item, idx) {
    // 如果已在当前页面，不重复导航
    if (isActive(item.path)) return

    // 触发按压缩放 + 光圈爆发
    rippleIdx.value = idx
    setTimeout(() => {
        rippleIdx.value = -1
    }, 400)

    // 页面切换
    router.push(item.path)
}

// ==================== 入场动画 ====================
onMounted(() => {
    // 延迟触发入场动画，让 DOM 完成初始渲染
    setTimeout(() => {
        isLoaded.value = true
    }, 100)
})
</script>

<style scoped>
/* ==========================================================================
   FloatingNav - 左侧悬浮导航栏
   色彩：背景 rgba(10,10,18,0.75) / 金色 #c9a84c / 非活跃 #6b6780
   ========================================================================== */

.floating-nav {
    position: fixed;
    top: 50%;
    left: 0;
    transform: translateY(-50%) translateX(-100%);
    z-index: 199;
    width: 56px;
    padding: 16px 0;
    background: rgba(10, 10, 18, 0.75);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border-left: 1px solid rgba(201, 168, 76, 0.5);
    border-radius: 28px 0 0 28px;
    box-shadow: 4px 0 40px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
    transition:
        transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        width 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        box-shadow 0.4s ease;
}

/* 加载完成后的入场动画 */
.floating-nav.is-loaded {
    transform: translateY(-50%) translateX(0);
}

/* 展开状态 */
.floating-nav.is-expanded {
    box-shadow:
        4px 0 60px rgba(0, 0, 0, 0.55),
        0 0 40px rgba(201, 168, 76, 0.08);
}

/* ==================== 金色呼吸光带 ==================== */
.floating-nav__breathing-strip {
    position: absolute;
    top: 50%;
    left: 2px;
    transform: translateY(-50%);
    width: 3px;
    height: 60%;
    max-height: 200px;
    border-radius: 2px;
    background: linear-gradient(
        180deg,
        transparent 0%,
        rgba(201, 168, 76, 0.8) 20%,
        rgba(232, 212, 139, 0.9) 50%,
        rgba(201, 168, 76, 0.8) 80%,
        transparent 100%
    );
    box-shadow:
        0 0 12px rgba(201, 168, 76, 0.5),
        0 0 24px rgba(201, 168, 76, 0.25),
        0 0 48px rgba(201, 168, 76, 0.1);
    animation: breathGlow 3s ease-in-out infinite;
    animation-play-state: paused;
    transition: opacity 0.4s ease;
    z-index: 1;
}

/* 展开后呼吸光带渐隐 */
.floating-nav.is-expanded .floating-nav__breathing-strip {
    opacity: 0;
}

/* 加载完成 + 非展开状态下启动呼吸动画 */
.floating-nav.is-loaded:not(.is-expanded) .floating-nav__breathing-strip {
    animation-play-state: running;
}

@keyframes breathGlow {
    0%,
    100% {
        opacity: 0.3;
        box-shadow:
            0 0 6px rgba(201, 168, 76, 0.3),
            0 0 12px rgba(201, 168, 76, 0.15),
            0 0 24px rgba(201, 168, 76, 0.05);
    }
    50% {
        opacity: 1;
        box-shadow:
            0 0 16px rgba(201, 168, 76, 0.6),
            0 0 32px rgba(201, 168, 76, 0.3),
            0 0 56px rgba(201, 168, 76, 0.12);
    }
}

/* ==================== 导航图标列表 ==================== */
.floating-nav__items {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
    position: relative;
    z-index: 2;
}

/* ==================== 导航项容器 ==================== */
.floating-nav__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    padding: 8px 4px;
    cursor: pointer;
    opacity: 0;
    transform: translateY(6px);
    transition:
        opacity 0.3s ease,
        transform 0.3s ease,
        background-color 0.3s ease;
    -webkit-tap-highlight-color: transparent;
    border-radius: 8px;
    margin: 0 4px;
}

/* 大横屏设备四个图标分别交错出场 */
.floating-nav.is-loaded .floating-nav__item:nth-child(1) {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.6s;
}
.floating-nav.is-loaded .floating-nav__item:nth-child(2) {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.7s;
}
.floating-nav.is-loaded .floating-nav__item:nth-child(3) {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.8s;
}
.floating-nav.is-loaded .floating-nav__item:nth-child(4) {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.9s;
}

/* ==================== 文字标签（始终可见） ==================== */
.floating-nav__label {
    font-family: "Noto Serif SC", var(--font-body, serif);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: var(--color-text-muted, #6b6780);
    white-space: nowrap;
    transition:
        color 0.3s ease,
        text-shadow 0.3s ease;
    user-select: none;
    pointer-events: none;
}

/* 非选中 hover */
.floating-nav__item:hover .floating-nav__label {
    color: var(--color-gold, #c9a84c);
}

/* 选中态文字 */
.floating-nav__item.is-active .floating-nav__label {
    color: var(--color-gold, #c9a84c);
    text-shadow: 0 0 12px rgba(201, 168, 76, 0.4);
}

/* ==================== 图标容器 ==================== */
.floating-nav__icon-wrap {
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    overflow: visible;
    z-index: 2;
}

/* 图标图片（默认非选中态：始终清晰可见） */
.floating-nav__icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
    transition:
        filter 0.3s ease,
        opacity 0.3s ease,
        transform 0.2s ease;
    /* 非选中态：浅灰半透明，但仍清晰可见 */
    opacity: 0.7;
    filter: brightness(0.7) saturate(0.4);
}

/* hover 时图标渐变为金色 */
.floating-nav__item:hover .floating-nav__icon {
    opacity: 0.95;
    filter: none;
    transform: scale(1.08);
}

/* 当前活跃页面图标始终金色 + 高亮 */
.floating-nav__item.is-active .floating-nav__icon {
    opacity: 1;
    filter: none;
}

/* ==================== 选中状态视觉区分 ==================== */
/* 选中项：金色圆环背景 */
.floating-nav__item.is-active .floating-nav__icon-wrap {
    background: rgba(201, 168, 76, 0.1);
    border: 1.5px solid rgba(201, 168, 76, 0.55);
    box-shadow: 0 0 12px rgba(201, 168, 76, 0.25);
}

/* 非选中项：微弱边框（可选，增强轮廓感） */
.floating-nav__item:not(.is-active) .floating-nav__icon-wrap {
    border: 1px solid rgba(107, 103, 128, 0.15);
    background: rgba(107, 103, 128, 0.04);
}

.floating-nav__item:not(.is-active):hover .floating-nav__icon-wrap {
    border-color: rgba(201, 168, 76, 0.25);
    background: rgba(201, 168, 76, 0.06);
}

/* ==================== 金色辉光背景圆 ==================== */
.floating-nav__glow-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: radial-gradient(
        circle,
        rgba(201, 168, 76, 0.25) 0%,
        rgba(201, 168, 76, 0.1) 40%,
        transparent 70%
    );
    transition:
        width 0.35s ease,
        height 0.35s ease,
        opacity 0.35s ease;
    opacity: 0;
    pointer-events: none;
    z-index: 0;
}

.floating-nav__item:hover .floating-nav__glow-bg {
    width: 50px;
    height: 50px;
    opacity: 1;
}

/* ==================== 活跃指示器圆点 ==================== */
.floating-nav__indicator {
    position: absolute;
    bottom: -3px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--color-gold, #c9a84c);
    box-shadow: 0 0 6px rgba(201, 168, 76, 0.6);
    z-index: 3;
    animation: indicatorPulse 2s ease-in-out infinite;
}

@keyframes indicatorPulse {
    0%,
    100% {
        transform: translateX(-50%) scale(1);
        opacity: 0.7;
    }
    50% {
        transform: translateX(-50%) scale(1.5);
        opacity: 1;
    }
}

/* ==================== 按压缩放 + 光圈爆发 ==================== */
.floating-nav__item.is-rippling .floating-nav__icon {
    animation: pressBounce 0.2s ease;
}

@keyframes pressBounce {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(0.85);
    }
    100% {
        transform: scale(1);
    }
}

.floating-nav__ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    margin-left: -4px;
    margin-top: -4px;
    border-radius: 50%;
    background: radial-gradient(
        circle,
        rgba(232, 212, 139, 0.7) 0%,
        rgba(201, 168, 76, 0.3) 30%,
        transparent 70%
    );
    pointer-events: none;
    z-index: 1;
    animation: rippleBurst 0.4s ease-out forwards;
}

@keyframes rippleBurst {
    0% {
        width: 8px;
        height: 8px;
        margin-left: -4px;
        margin-top: -4px;
        opacity: 1;
    }
    100% {
        width: 80px;
        height: 80px;
        margin-left: -40px;
        margin-top: -40px;
        opacity: 0;
    }
}

/* ==================== 页面淡入过渡（在 App.vue 中配合使用） ==================== */

/* ==================== 响应式：移动端隐藏 ==================== */
@media (max-width: 767px) {
    .floating-nav {
        display: none;
    }
}

/* 平板端缩小尺寸 */
@media (min-width: 768px) and (max-width: 1023px) {
    .floating-nav {
        width: 52px;
        padding: 12px 0;
        border-radius: 22px 0 0 22px;
    }

    .floating-nav__icon {
        width: 20px;
        height: 20px;
    }

    .floating-nav__icon-wrap {
        width: 36px;
        height: 36px;
    }

    .floating-nav__label {
        font-size: 0.62rem;
        letter-spacing: 0.06em;
    }

    .floating-nav__item {
        gap: 4px;
    }
}
</style>
