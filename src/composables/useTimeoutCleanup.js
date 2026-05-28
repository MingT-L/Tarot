import { onUnmounted } from 'vue'

/**
 * 统一管理 setTimeout 生命周期，组件卸载时自动清理所有未完成的 timeout
 * @returns {{ schedule: (fn, delay) => number }}
 */
export function useTimeoutCleanup() {
  const timers = []

  function schedule(fn, delay) {
    const id = setTimeout(() => {
      const idx = timers.indexOf(id)
      if (idx !== -1) timers.splice(idx, 1)
      fn()
    }, delay)
    timers.push(id)
    return id
  }

  onUnmounted(() => {
    timers.forEach(id => clearTimeout(id))
    timers.length = 0
  })

  return { schedule }
}
