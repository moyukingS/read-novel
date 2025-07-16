<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useNovelStore } from '@/stores/novel'
const store = useNovelStore()

const currentChapterMeta = computed(() => {
  return store.chaptersMeta.find(c => c.index === store.currentChapterIndex) || { title: '', index: 0 }
})

async function prevChapter() {
  if (store.currentChapterIndex > 0) {
    store.resetLoadedChapters(store.currentChapterIndex - 1)
    await nextTick()
    scrollToChapter(store.currentChapterIndex)
  }
}

async function nextChapter() {
  if (store.currentChapterIndex < store.chaptersMeta.length - 1) {
    store.resetLoadedChapters(store.currentChapterIndex + 1)
    await nextTick()
    scrollToChapter(store.currentChapterIndex)
  }
}

async function onLoadMoreDown() {
  await store.loadMoreChapters('down')
}
async function onLoadMoreUp() {
  await store.loadMoreChapters('up')
}

function scrollToChapter(idx) {
  nextTick(() => {
    const el = document.getElementById('chapter-' + idx)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

// 监听滚动，自动更新 currentChapterIndex
function onScroll(e) {
  const chapters = document.querySelectorAll('.chapter-block')
  let minDiff = Infinity
  let currentIdx = store.currentChapterIndex
  chapters.forEach((el, i) => {
    const rect = el.getBoundingClientRect()
    const diff = Math.abs(rect.top - 80) // 80为大致顶部偏移
    if (diff < minDiff) {
      minDiff = diff
      currentIdx = Number(el.dataset.idx)
    }
  })
  if (currentIdx !== store.currentChapterIndex) {
    store.setCurrentChapterIndex(currentIdx)
  }
}

onMounted(() => {
  store.resetLoadedChapters(store.currentChapterIndex)
})
</script>

<template>
    <div class="flex justify-between items-center mb-2">
      <n-button size="small" @click="prevChapter" :disabled="store.currentChapterIndex === 0">上一章</n-button>
      <span class="text-center">{{ currentChapterMeta.title }}</span>
      <n-button size="small" @click="nextChapter" :disabled="store.currentChapterIndex === store.chaptersMeta.length - 1">下一章</n-button>
    </div>
    <n-scrollbar style="max-height: calc(100vh - 115px)">
      <n-infinite-scroll :on-load="onLoadMoreDown" :on-load-top="onLoadMoreUp">
        <div v-for="chapter in store.currentLoadedChapters" :key="chapter.index" class="chapter-block" :id="'chapter-' + chapter.index" :data-idx="chapter.index">
          <h2>{{ chapter.title }}</h2>
          <div class="chapter-content">{{ chapter.content }}</div>
        </div>
      </n-infinite-scroll>
    </n-scrollbar>
</template>

<style scoped>
.reader-content {
  min-height: 60vh;
  font-size: 1.1em;
  line-height: 1.8;
  background: #fff;
  border-radius: 8px;
  padding: 2em;
  box-shadow: 0 2px 8px #0001;
}
.chapter-content {
  white-space: pre-wrap;
  margin-top: 1em;
}
.chapter-block {
  margin-bottom: 2em;
}
</style> 