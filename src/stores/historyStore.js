import { defineStore } from 'pinia'
import { MAX_HISTORY_RECORDS } from '@/data/constants'

const STORAGE_KEY = 'tarot_history'

function loadRecords() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveRecords(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch (e) {
    console.error('[Mystic Tarot] localStorage 写入失败:', e.message)
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10)
}

export const useHistoryStore = defineStore('history', {
  state: () => ({
    records: loadRecords()
  }),
  getters: {
    /**
     * 根据ID获取单条历史记录
     * @param {string} id - 记录ID
     * @returns {Object|undefined} 对应ID的记录，未找到返回 undefined
     */
    getRecordById: (state) => (id) => {
      return state.records.find(r => r.id === id)
    }
  },
  actions: {
    saveRecord(record) {
      const newRecord = {
        id: generateId(),
        timestamp: Date.now(),
        ...record
      }
      this.records.unshift(newRecord)
      if (this.records.length > MAX_HISTORY_RECORDS) {
        this.records = this.records.slice(0, MAX_HISTORY_RECORDS)
      }
      saveRecords(this.records)
      return newRecord
    },
    deleteRecord(id) {
      this.records = this.records.filter(r => r.id !== id)
      saveRecords(this.records)
    },
    clearAll() {
      this.records = []
      saveRecords(this.records)
    }
  }
})