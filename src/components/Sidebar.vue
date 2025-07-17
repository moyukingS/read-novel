<template>
  <n-layout-sider :native-scrollbar="false" :collapsed-width="0" :width="240" :show-collapsed-content="false"
    show-trigger="arrow-circle" content-style="padding: 0 10px;" width="260">
    <div class="flex items-center justify-between px-2 py-1">
      <span>目录</span>
    </div>
    <n-list>
      <n-list-item v-for="(chapter, idx) in store.currentPageChapters" :key="chapter.title"
        :class="{ 'active': idx + (store.currentPage - 1) * store.pageSize === store.currentChapterIndex }"
        style="cursor: pointer;" class="text-xs" @click="handleChapterClick(idx + (store.currentPage - 1) * store.pageSize)">
        {{ chapter.title }}
      </n-list-item>
    </n-list>
    <n-pagination simple v-if="store.totalPages > 1" :page="store.currentPage" :page-count="store.totalPages"
      @update:page="handlePageChange" size="small" class="mt-2" />
  </n-layout-sider>
</template>

<script setup>
const store = useNovelStore()

function handleChapterClick(idx) {
  store.loadChapterContent(store.currentNovel, idx)
}

function handlePageChange(page) {
  store.currentPage = page
}
</script>

<style scoped>
.active {
  color: rebeccapurple;
}
</style>