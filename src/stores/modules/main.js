import { defineStore } from 'pinia'

export const useCounterStore = defineStore('main', {
  state: () => ({
    isLoading: false
  }),
  actions: {
    changeLoadingAction(newLoading) {
      this.isLoading = newLoading
    }
  }
})
