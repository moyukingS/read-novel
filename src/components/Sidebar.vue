<template>
  <n-layout-sider :native-scrollbar="false" :collapsed-width="0" :width="240" :show-collapsed-content="false"
    show-trigger="arrow-circle" content-style="padding: 24px;" width="260">
    <div class="flex items-center justify-between px-2 py-1">
      <span>目录</span>
      <!-- <n-button size="tiny" @click="toggleCollapse">
        {{ store.isSidebarCollapsed ? '展开' : '折叠' }}
      </n-button> -->
    </div>
    <n-list>
      <n-list-item v-for="(chapter, idx) in store.currentPageChapters" :key="chapter.title"
        :class="{ 'active': idx + (store.currentPage - 1) * store.pageSize === store.currentChapterIndex }"
        @click="handleChapterClick(idx + (store.currentPage - 1) * store.pageSize)">
        {{ chapter.title }}
      </n-list-item>
    </n-list>
    <n-pagination v-if="store.totalPages > 1" :page="store.currentPage" :page-count="store.totalPages"
      @update:page="handlePageChange" size="small" class="mt-2" />
  </n-layout-sider>
</template>

<script setup>
import { nextTick } from 'vue'
import { useNovelStore } from '@/stores/novel'
const store = useNovelStore()

async function handleChapterClick(idx) {
  store.resetLoadedChapters(idx)
  await nextTick()
  const el = document.getElementById('chapter-' + idx)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function handlePageChange(page) {
  store.currentPage = page
}

function toggleCollapse() {
  store.toggleSidebarCollapsed()
}
</script>

<style scoped>
.active {
  background: #e5e7eb;
  font-weight: bold;
}
</style>