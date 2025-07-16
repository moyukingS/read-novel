<template>
  <n-layout-header>
    <n-space align="center" justify="space-between" class="w-full px-4 ">
      <div class="flex items-center" style="height: 45px;">
        <n-icon size="24">
          <BookOutline />
        </n-icon>
        <span class="ml-2 font-bold text-lg">小说阅读器</span>
      </div>
      <div>
        <n-button quaternary circle @click="store.toggleTheme">
          <n-icon>
            <MoonOutline v-if="!store.isDark" />
            <SunnyOutline v-else />
          </n-icon>
        </n-button>
        <n-button quaternary circle @click="store.showManager = true">
          <n-icon>
            <SettingsOutline />
          </n-icon>
        </n-button>
      </div>
    </n-space>
  </n-layout-header>
</template>

<script setup>
import { useNovelStore } from '@/stores/novel'
import { NButton, NSpace, NIcon } from 'naive-ui'
import { MoonOutline, SunnyOutline, BookOutline, SettingsOutline } from '@vicons/ionicons5'

const store = useNovelStore()
</script>

<style scoped>
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em 2em;
  background: #f5f5f5;
  border-bottom: 1px solid #eee;
}
</style>
