<template>
  <div class="card-filter">
    <button
      v-for="cat in categories"
      :key="cat.key"
      class="filter-tab"
      :class="{ active: modelValue === cat.key }"
      @click="$emit('update:modelValue', cat.key)"
    >
      <span class="filter-label">{{ cat.label }}</span>
      <span class="filter-count">{{ cat.count }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  categories: {
    type: Array,
    required: true
  },
  modelValue: {
    type: String,
    default: 'all'
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.card-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  padding: 8px 24px 24px;
  max-width: 800px;
  margin: 0 auto;
}

.filter-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: linear-gradient(135deg, rgba(18, 14, 26, 0.7), rgba(26, 20, 40, 0.5));
  border: 1px solid rgba(201, 168, 76, 0.08);
  border-radius: 24px;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-family: var(--font-body);
  position: relative;
}

.filter-tab::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    rgba(201, 168, 76, 0.04) 0%,
    transparent 50%
  );
  z-index: -1;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.35s ease;
}

.filter-tab:hover {
  border-color: rgba(201, 168, 76, 0.25);
  color: var(--color-text-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.filter-tab:hover::before {
  opacity: 1;
}

.filter-tab.active {
  background: linear-gradient(135deg, rgba(201, 168, 76, 0.12), rgba(201, 168, 76, 0.04));
  border-color: rgba(201, 168, 76, 0.35);
  color: var(--color-gold);
  box-shadow:
    0 0 16px rgba(201, 168, 76, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.3);
}

.filter-label {
  font-weight: 500;
  letter-spacing: 0.04em;
}

.filter-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 11px;
  background: rgba(201, 168, 76, 0.08);
  color: var(--color-gold-light);
  font-size: 0.78rem;
  font-weight: 600;
}

.filter-tab.active .filter-count {
  background: rgba(201, 168, 76, 0.25);
  color: var(--color-gold);
}
</style>