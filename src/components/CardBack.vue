<template>
  <!--
    牌背组件：支持3D翻转动画
    - 未翻转时显示深紫色星空牌背（CSS绘制）
    - 翻转后显示牌面图像
    - 逆位时牌旋转180度
  -->
  <div
    class="card-back"
    :class="{
      'card-back--flipped': isFlipped,
      'card-back--reversed': isReversed,
      'card-back--clickable': !isFlipped && !disabled
    }"
    @click="handleClick"
  >
    <div class="card-back__inner">
      <!-- 正面：牌背图案 -->
      <div class="card-back__face card-back__face--back">
        <!-- 深紫色星空牌背：CSS绘制 -->
        <div class="card-back__design">
          <!-- 外层边框 -->
          <div class="card-back__border-outer"></div>
          <!-- 内层装饰框 -->
          <div class="card-back__border-inner">
            <!-- 中心神秘符号 -->
            <div class="card-back__symbol">
              <div class="card-back__star"></div>
              <div class="card-back__moon"></div>
            </div>
            <!-- 四角装饰 -->
            <div class="card-back__corner card-back__corner--tl">&#9733;</div>
            <div class="card-back__corner card-back__corner--tr">&#9733;</div>
            <div class="card-back__corner card-back__corner--bl">&#9733;</div>
            <div class="card-back__corner card-back__corner--br">&#9733;</div>
          </div>
        </div>
      </div>

      <!-- 背面：牌面图像 -->
      <div class="card-back__face card-back__face--front">
        <img
          v-if="cardImage"
          :src="cardImage"
          :alt="cardName || '塔罗牌'"
          class="card-back__image"
          loading="lazy"
        />
        <!-- 逆位标记 -->
        <div v-if="isReversed && isFlipped" class="card-back__reversed-badge">
          逆位
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * CardBack - 塔罗牌牌背/牌面组件
 *
 * Props:
 *   isFlipped  - 是否已翻转显示牌面
 *   isReversed - 是否逆位（旋转180度）
 *   cardImage  - 牌面图像路径
 *   cardName   - 牌名（用于alt属性）
 *   disabled   - 是否禁止点击
 *
 * Emits:
 *   click - 点击牌时触发
 */
const props = defineProps({
  /** 是否已翻转显示牌面 */
  isFlipped: {
    type: Boolean,
    default: false
  },
  /** 是否逆位（牌面上下颠倒） */
  isReversed: {
    type: Boolean,
    default: false
  },
  /** 牌面图像路径 */
  cardImage: {
    type: String,
    default: ''
  },
  /** 牌名（无障碍用） */
  cardName: {
    type: String,
    default: ''
  },
  /** 禁止点击交互 */
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

/** 点击事件处理 */
function handleClick() {
  if (!props.disabled && !props.isFlipped) {
    emit('click')
  }
}
</script>

<style scoped>
/* ==================== 卡片容器 ==================== */
.card-back {
  perspective: 1200px;
  width: 140px;
  height: 220px;
  cursor: default;
  user-select: none;
  -webkit-user-select: none;
}

.card-back--clickable {
  cursor: pointer;
}

.card-back--clickable:hover .card-back__inner {
  box-shadow:
    0 0 25px rgba(201, 168, 76, 0.4),
    0 0 50px rgba(123, 79, 211, 0.2);
  transform: translateY(-4px);
}

/* 逆位时正面内容旋转180度 */
.card-back--reversed .card-back__face--front {
  transform: rotateY(180deg) rotateZ(180deg);
}

/* ==================== 3D翻转容器 ==================== */
.card-back__inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  /* 0.7s 翻转动画，使用弹性缓动增强空间感 */
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow var(--transition-normal);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}

.card-back--flipped .card-back__inner {
  transform: rotateY(180deg);
}

/* 翻转时添加轻微缩放，增强3D空间感受 */
.card-back--flipped.card-back--clickable .card-back__inner {
  transform: rotateY(180deg) scale(1.02);
}

/* ==================== 正反面共用 ==================== */
.card-back__face {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: var(--radius-md);
  overflow: hidden;
}

/* ==================== 牌背设计 ==================== */
.card-back__face--back {
  background: linear-gradient(
    145deg,
    #1a0a3e 0%,
    #2d1b69 30%,
    #1e1048 50%,
    #2a1860 70%,
    #15083a 100%
  );
  border: 2px solid var(--color-gold-dark);
}

.card-back__design {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 外层金色边框 */
.card-back__border-outer {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  border: 1px solid rgba(201, 168, 76, 0.5);
  border-radius: 4px;
}

/* 内层装饰框 */
.card-back__border-inner {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  bottom: 16px;
  border: 1px solid rgba(201, 168, 76, 0.25);
  border-radius: 2px;
}

/* 中心符号 */
.card-back__symbol {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

/* 五角星 */
.card-back__star {
  width: 36px;
  height: 36px;
  background: var(--color-gold);
  clip-path: polygon(
    50% 0%, 61% 35%, 98% 35%, 68% 57%,
    79% 91%, 50% 70%, 21% 91%, 32% 57%,
    2% 35%, 39% 35%
  );
  filter: drop-shadow(0 0 6px rgba(201, 168, 76, 0.6));
}

/* 月亮装饰 */
.card-back__moon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 35%,
    var(--color-gold-light) 0%,
    var(--color-gold) 40%,
    transparent 60%
  );
  opacity: 0.6;
}

/* 四角星形装饰 */
.card-back__corner {
  position: absolute;
  color: rgba(201, 168, 76, 0.5);
  font-size: 0.7rem;
}

.card-back__corner--tl { top: 6px; left: 6px; }
.card-back__corner--tr { top: 6px; right: 6px; }
.card-back__corner--bl { bottom: 6px; left: 6px; }
.card-back__corner--br { bottom: 6px; right: 6px; }

/* ==================== 牌面图像 ==================== */
.card-back__face--front {
  transform: rotateY(180deg);
  background: var(--color-bg-card);
}

.card-back__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-md);
}

/* 逆位标记 */
.card-back__reversed-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  padding: 2px 8px;
  background: rgba(123, 79, 211, 0.85);
  color: var(--color-text-primary);
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 4px;
  border: 1px solid var(--color-purple-light);
}

/* ==================== 响应式 ==================== */
@media (max-width: 767px) {
  .card-back {
    width: 100px;
    height: 158px;
  }

  .card-back__star {
    width: 24px;
    height: 24px;
  }

  .card-back__moon {
    width: 14px;
    height: 14px;
  }

  .card-back__border-outer {
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 4px;
  }

  .card-back__border-inner {
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
  }
}
</style>