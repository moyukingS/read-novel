<script setup>
import { onMounted } from 'vue'
import { useNovelStore } from '@/stores/novel'
const store = useNovelStore()

function prevChapter() {
  if (store.currentChapterIndex > 0) {
    store.loadChapterContent(store.currentNovel, store.currentChapterIndex - 1)
  }
}
function nextChapter() {
  if (store.currentChapterIndex < store.chaptersMeta.length - 1) {
    store.loadChapterContent(store.currentNovel, store.currentChapterIndex + 1)
  }
}
onMounted(() => {
  if (store.currentNovel && store.chaptersMeta.length) {
    store.loadChapterContent(store.currentNovel, store.currentChapterIndex)
  }
})
</script>

<template>
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center mb-2">
      <n-button size="small" @click="prevChapter" :disabled="store.currentChapterIndex === 0">上一章</n-button>
      <span class="text-center">{{ store.chaptersMeta[store.currentChapterIndex]?.title }}</span>
      <n-button size="small" @click="nextChapter" :disabled="store.currentChapterIndex === store.chaptersMeta.length - 1">下一章</n-button>
    </div>
    <n-scrollbar style="height: calc(100vh - 100px);">
      <div v-if="store.currentChapterContent">
        <div class="chapter-block">
          <h2>{{ store.chaptersMeta[store.currentChapterIndex]?.title }}</h2>
          <div class="chapter-content">{{ store.currentChapterContent }}</div>
        </div>
      </div>
      <div v-else class="chapter-block">暂无内容</div>
    </n-scrollbar>
  </div>
</template>

<style scoped>

.chapter-content {
  white-space: pre-wrap;
  margin-top: 1em;
}
.chapter-block {
  margin-bottom: 2em;
}
</style> 