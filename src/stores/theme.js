import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)
  const isSidebarCollapsed = ref(false)
  const showManager = ref(false)

  function toggleTheme() {
    isDark.value = !isDark.value
  }
  function toggleSidebarCollapsed() {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
  }
  function toggleShowManager(val) {
    if (typeof val === 'boolean') {
      showManager.value = val
    } else {
      showManager.value = !showManager.value
    }
  }

  return {
    isDark,
    toggleTheme,
    isSidebarCollapsed,
    toggleSidebarCollapsed,
    showManager,
    toggleShowManager
  }
}, {
  persist: true
}) 