import { defineStore } from 'pinia'
import { allCards, getCardsByCategory, getCardById } from '@/data/cardsData'

export const useCardStore = defineStore('cards', {
  state: () => ({
    cards: allCards
  }),
  getters: {
    majorArcana: (state) => allCards.filter(c => c.category === 'major'),
    wandsCards: (state) => allCards.filter(c => c.category === 'wands'),
    cupsCards: (state) => allCards.filter(c => c.category === 'cups'),
    swordsCards: (state) => allCards.filter(c => c.category === 'swords'),
    pentaclesCards: (state) => allCards.filter(c => c.category === 'pentacles'),
    dailyCard: (state) => {
      const today = new Date()
      const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
      const index = seed % allCards.length
      return allCards[index]
    }
  },
  actions: {
    getCardsByCategory(category) { return getCardsByCategory(category) },
    getCardById(id) { return getCardById(id) }
  }
})