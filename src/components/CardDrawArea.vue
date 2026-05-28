<template>
  <!--
    抽牌区域组件
    - 使用 CSS Grid 按 layout 坐标排布牌位
    - 牌位为占位框或已抽出的牌
    - 已抽出的牌显示为牌背，点击翻转
    - 显示抽牌进度
  -->
  <div class="draw-area">
    <!-- 抽牌进度 -->
    <div class="draw-area__progress">
      <span class="draw-area__progress-text">
        已抽 {{ drawnCount }} / {{ spread.cardCount }} 张
      </span>
      <div class="draw-area__progress-bar">
        <div
          class="draw-area__progress-fill"
          :style="{ width: progressPercent + '%' }"
        ></div>
      </div>
    </div>

    <!-- 牌位网格 -->
    <div
      class="draw-area__grid"
      :style="gridStyle"
    >
      <!--
        遍历所有牌位，按 layout 坐标放置
        对于已抽出的牌渲染 CardBack，否则渲染占位符
      -->
      <div
        v-for="pos in spread.layout"
        :key="'cell-' + pos.id"
        class="draw-area__cell"
        :style="getCellStyle(pos)"
      >
        <!-- 已抽出的牌 -->
        <div
          v-if="getDrawnCard(pos.id)"
          class="draw-area__card-wrapper"
        >
          <CardBack
            :is-flipped="getDrawnCard(pos.id).flipped"
            :is-reversed="getDrawnCard(pos.id).reversed"
            :card-image="getDrawnCard(pos.id).image"
            :card-name="getDrawnCard(pos.id).name"
            :disabled="getDrawnCard(pos.id).flipped"
            @click="handleCardClick(pos.id)"
          />
          <!-- 牌位名称标签 -->
          <span class="draw-area__pos-label">
            {{ getPositionName(pos.id) }}
          </span>
        </div>

        <!-- 空牌位占位符 -->
        <div
          v-else
          class="draw-area__placeholder"
          :class="{
            'draw-area__placeholder--active': currentMode === 'single' && !allDrawn
          }"
          @click="handlePlaceholderClick(pos.id)"
        >
          <div class="draw-area__placeholder-inner">
            <span class="draw-area__placeholder-icon">?</span>
            <span class="draw-area__placeholder-text">
              {{ getPositionName(pos.id) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CardBack from '@/components/CardBack.vue'

/**
 * CardDrawArea - 抽牌区域组件
 *
 * Props:
 *   spread     - 选中的阵法数据
 *   drawnCards - 已抽出的牌数组，每项 { positionId, card, flipped, reversed }
 *   currentMode - 当前抽牌模式: 'single' | 'batch'
 *
 * Emits:
 *   draw(index)  - 请求抽取指定牌位
 *   flipAll       - 一键翻牌
 */
const props = defineProps({
  /** 选中的阵法数据 */
  spread: {
    type: Object,
    required: true
  },
  /** 已抽出的牌数组 */
  drawnCards: {
    type: Array,
    default: () => []
  },
  /** 当前抽牌模式 */
  currentMode: {
    type: String,
    default: 'single'
  }
})

const emit = defineEmits(['draw', 'flipAll'])

/** 已抽牌数量 */
const drawnCount = computed(() => props.drawnCards.length)

/** 是否全部抽完 */
const allDrawn = computed(() => drawnCount.value >= props.spread.cardCount)

/** 进度百分比 */
const progressPercent = computed(() => {
  if (props.spread.cardCount === 0) return 0
  return Math.round((drawnCount.value / props.spread.cardCount) * 100)
})

/**
 * 获取指定牌位的已抽牌数据
 * @param {number} positionId
 * @returns {Object|undefined}
 */
function getDrawnCard(positionId) {
  return props.drawnCards.find(d => d.positionId === positionId)
}

/**
 * 获取牌位名称
 * @param {number} positionId
 * @returns {string}
 */
function getPositionName(positionId) {
  const pos = props.spread.positions.find(p => p.id === positionId)
  return pos ? pos.name : ''
}

/**计算网格的行列数*/
const gridCols = computed(() => {
  const cols = props.spread.layout.map(l => l.col)
  return Math.max(...cols, 1)
})

const gridRows = computed(() => {
  const rows = props.spread.layout.map(l => l.row)
  return Math.max(...rows, 1)
})

/**CSS Grid 样式*/
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${gridCols.value}, 1fr)`,
  gridTemplateRows: `repeat(${gridRows.value}, auto)`
}))

/**
 * 获取单元格CSS定位样式
 * @param {{ id: number, col: number, row: number }} pos
 * @returns {Object}
 */
function getCellStyle(pos) {
  return {
    gridColumn: `${pos.col} / span 1`,
    gridRow: `${pos.row} / span 1`
  }
}

/** 点击已抽牌（翻转） */
function handleCardClick(positionId) {
  const drawn = getDrawnCard(positionId)
  if (drawn && !drawn.flipped) {
    emit('draw', positionId)
  }
}

/** 点击占位符（抽牌） */
function handlePlaceholderClick(positionId) {
  if (props.currentMode === 'single' && !allDrawn) {
    emit('draw', positionId)
  }
}
</script>

<style scoped>
/* ==================== 容器 ==================== */
.draw-area {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 16px;
}

/* ==================== 进度条 ==================== */
.draw-area__progress {
  text-align: center;
  margin-bottom: 30px;
}

.draw-area__progress-text {
  display: block;
  font-size: 0.95rem;
  color: var(--color-gold);
  font-family: var(--font-display);
  margin-bottom: 8px;
}

.draw-area__progress-bar {
  width: 100%;
  max-width: 300px;
  height: 4px;
  margin: 0 auto;
  background: var(--color-border);
  border-radius: 2px;
  overflow: hidden;
}

.draw-area__progress-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--color-purple),
    var(--color-gold)
  );
  border-radius: 2px;
  transition: width 0.5s ease;
}

/* ==================== 牌位网格 ==================== */
.draw-area__grid {
  display: grid;
  gap: 20px;
  justify-items: center;
  align-items: center;
}

/* ==================== 单元格 ==================== */
.draw-area__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* ==================== 牌容器 ==================== */
.draw-area__card-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

/* 牌位名称标签 */
.draw-area__pos-label {
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  text-align: center;
  font-family: var(--font-display);
}

/* ==================== 占位符 ==================== */
.draw-area__placeholder {
  width: 140px;
  height: 220px;
  border: 2px dashed var(--color-border-light);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
  background: rgba(26, 16, 37, 0.5);
}

.draw-area__placeholder--active {
  cursor: pointer;
}

.draw-area__placeholder--active:hover {
  border-color: var(--color-gold);
  border-style: solid;
  background: rgba(201, 168, 76, 0.05);
  box-shadow: 0 0 20px rgba(201, 168, 76, 0.15);
  transform: translateY(-3px);
}

.draw-area__placeholder-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.draw-area__placeholder-icon {
  font-size: 2rem;
  color: var(--color-text-muted);
  font-family: var(--font-display);
  transition: color var(--transition-fast);
}

.draw-area__placeholder--active:hover .draw-area__placeholder-icon {
  color: var(--color-gold);
}

.draw-area__placeholder-text {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-align: center;
  max-width: 100px;
  line-height: 1.3;
}

/* ==================== 响应式 ==================== */
@media (max-width: 767px) {
  .draw-area__grid {
    gap: 12px;
  }

  .draw-area__placeholder {
    width: 100px;
    height: 158px;
  }

  .draw-area__placeholder-icon {
    font-size: 1.5rem;
  }

  .draw-area__placeholder-text {
    font-size: 0.7rem;
    max-width: 80px;
  }

  .draw-area__pos-label {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .draw-area__grid {
    gap: 8px;
  }

  .draw-area__placeholder {
    width: 72px;
    height: 114px;
  }
}
</style>