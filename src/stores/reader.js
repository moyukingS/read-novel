import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { useLibraryStore } from './library'
import { saveChaptersMetaToDB, getChaptersMetaFromDB, saveChapterToDB, getChapterFromDB } from '@/utils/db'

export const useReaderStore = defineStore('reader', () => {
  const libraryStore = useLibraryStore()
  const currentNovelKey = ref('') // 只保存小说名
  const chaptersMeta = ref([])
  const currentChapterContent = ref('')
  const currentChapterIndex = ref(0)
  const uploaded = ref(false)
  const pageSize = ref(20)
  const currentPage = ref(1)

  // 通过 novels 查找当前小说对象
  const currentNovelObj = computed(() =>
    libraryStore.novels.find(novel => novel.name === currentNovelKey.value)
  )
  const currentNovelName = computed(() => currentNovelObj.value?.name || '')

  async function setCurrentNovelKey(val) {
    currentNovelKey.value = val
  }

  function setCurrentChapterIndex(idx) {
    currentChapterIndex.value = idx
  }
  function setNovelProgress(novel, idx) {
    // This function is no longer needed as currentNovelKey is the primary source
  }
  function setLastReadNovelName(val) {
    // This function is no longer needed as currentNovelKey is the primary source
  }

  function splitChapters(content) {
    const chapterReg = /(第[\d一二三四五六七八九十百千零〇两]+[章回节].*|Chapter\s*\d+.*)/g
    const titles = [...content.matchAll(chapterReg)].map(m => m[0])
    if (titles.length === 0) {
      return [{ title: '全文', content }]
    }
    const parts = content.split(chapterReg)
    const arr = []
    for (let i = 1; i < parts.length; i += 2) {
      arr.push({
        title: parts[i],
        content: (parts[i + 1] || '').trim()
      })
    }
    return arr
  }

  async function loadChaptersMeta(novel) {
    const meta = await getChaptersMetaFromDB(novel)
    chaptersMeta.value = meta
  }

  async function loadChapterContent(novel, index) {
    const content = await getChapterFromDB(novel, index)
    currentChapterContent.value = content
  }

  async function selectNovel(name) {
    await setCurrentNovelKey(name)
    await loadChaptersMeta(name)
    uploaded.value = true
    currentPage.value = 1
  }

  return {
    currentNovelKey,
    currentNovelObj,
    currentNovelName,
    chaptersMeta,
    currentChapterContent,
    currentChapterIndex,
    uploaded,
    pageSize,
    currentPage,
    setCurrentNovelKey,
    loadChaptersMeta,
    loadChapterContent,
    selectNovel
  }
}, {
  persist: true
}) 