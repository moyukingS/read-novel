<template>
  <div class="container mx-auto px-4" ref="containerRef">
    <n-infinite-scroll
      :on-load="loadMore"
      :loading="loading"
      :finished="finished"
      :distance="50"
      style="height: calc(100vh - 100px); overflow-y: auto;"
    >
      <div v-for="(chapter, idx) in loadedChapters" :key="idx" class="chapter-block">
        <h2>{{ chapter.title }}</h2>
        <div class="chapter-content">{{ chapter.content }}</div>
      </div>
      <div v-if="loading" class="text-center">加载中...</div>
      <div v-if="finished" class="text-center">没有更多章节了</div>
    </n-infinite-scroll>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useReaderStore } from '@/stores/reader'
import { useLibraryStore } from '@/stores/library'

const readerStore = useReaderStore()
const libraryStore = useLibraryStore()
const loadedChapters = ref([])
const loading = ref(false)
const finished = ref(false)
const currentStartIndex = ref(0)
const containerRef = ref(null)

async function loadChapter(index) {
  await readerStore.loadChapterContent(readerStore.currentNovel, index)
  return {
    title: readerStore.chaptersMeta[index]?.title,
    content: readerStore.currentChapterContent
  }
}

async function loadMore(startIndex) {
  if (loading.value || finished.value) return
  loading.value = true
  if (typeof startIndex === 'number') {
    currentStartIndex.value = startIndex
  }
  const nextIndex = currentStartIndex.value + loadedChapters.value.length
  if (nextIndex >= readerStore.chaptersMeta.length) {
    finished.value = true
    loading.value = false
    return
  }
  const chapter = await loadChapter(nextIndex)
  loadedChapters.value.push(chapter)
  // 记录进度为已加载的最后一章
  const lastLoadedIndex = currentStartIndex.value + loadedChapters.value.length - 1
  readerStore.currentChapterIndex = lastLoadedIndex
  if (readerStore.currentNovel) {
    libraryStore.novelProgress[readerStore.currentNovel] = lastLoadedIndex
  }
  loading.value = false
  if (loadedChapters.value.length + currentStartIndex.value >= readerStore.chaptersMeta.length) {
    finished.value = true
  }
}

// 目录跳转时重置 loadedChapters 并滚动到对应章节
async function jumpToChapter(index) {
  loadedChapters.value = []
  finished.value = false
  loading.value = false
  currentStartIndex.value = index
  await loadMore(index)
  await loadMore()
  await nextTick()
  // 滚动到指定章节
  const blocks = containerRef.value?.querySelectorAll('.chapter-block') || []
  if (blocks[0]) {
    blocks[0].scrollIntoView({ behavior: 'smooth' })
  }
  // 同步 currentChapterIndex
  readerStore.currentChapterIndex = index
}

// 监听目录跳转
watch(
  () => readerStore.currentChapterIndex,
  async (val, oldVal) => {
    if (typeof val === 'number' && (val < currentStartIndex.value || val >= currentStartIndex.value + loadedChapters.value.length)) {
      await jumpToChapter(val)
    }
    // 同步进度到 libraryStore
    if (readerStore.currentNovel) {
      libraryStore.novelProgress[readerStore.currentNovel] = val
    }
  }
)

// 监听小说切换，重置并预载两章
watch(
  () => readerStore.currentNovel,
  async (val) => {
    if (val && readerStore.chaptersMeta.length) {
      // 恢复进度
      const idx = libraryStore.novelProgress[val] ?? 0
      readerStore.currentChapterIndex = idx
      loadedChapters.value = []
      finished.value = false
      loading.value = false
      currentStartIndex.value = idx
      await loadMore(idx)
      await loadMore()
    }
  }
)

onMounted(async () => {
  loadedChapters.value = []
  finished.value = false
  loading.value = false
  currentStartIndex.value = 0
  if (readerStore.currentNovel && readerStore.chaptersMeta.length) {
    // 恢复进度
    const idx = libraryStore.novelProgress[readerStore.currentNovel] ?? 0
    readerStore.currentChapterIndex = idx
    currentStartIndex.value = idx
    await loadMore(idx)
    await loadMore()
  }
})
</script>

<style scoped>
.chapter-content {
  white-space: pre-wrap;
  margin-top: 1em;
}
.chapter-block {
  margin-bottom: 2em;
}
</style>