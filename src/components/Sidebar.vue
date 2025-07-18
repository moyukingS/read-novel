<template>
  <n-layout-sider :native-scrollbar="false" :collapsed-width="0" :width="240" :show-collapsed-content="false"
    show-trigger="arrow-circle" content-style="padding: 0 10px;" width="260">
    <div class="flex items-center justify-between px-2 py-1">
      <span>目录</span>
    </div>
    <n-list>
      <n-list-item v-for="(chapter, idx) in readerStore.currentPageChapters" :key="chapter.title"
        :class="{ 'active': idx + (readerStore.currentPage - 1) * readerStore.pageSize === readerStore.currentChapterIndex }"
        style="cursor: pointer;" class="text-xs" @click="handleChapterClick(idx + (readerStore.currentPage - 1) * readerStore.pageSize)">
        {{ chapter.title }}
      </n-list-item>
    </n-list>
    <n-pagination simple v-if="readerStore.totalPages > 1" :page="readerStore.currentPage" :page-count="readerStore.totalPages"
      @update:page="handlePageChange" size="small" class="mt-2" />
  </n-layout-sider>
</template>

<script setup>
import { useReaderStore } from '@/stores/reader'
import { useThemeStore } from '@/stores/theme'

const readerStore = useReaderStore()
const themeStore = useThemeStore()

function handleChapterClick(idx) {
  readerStore.currentChapterIndex = idx
}

function handlePageChange(page) {
  readerStore.currentPage = page
}
</script>

<style scoped>
.active {
  color: rebeccapurple;
}
</style>