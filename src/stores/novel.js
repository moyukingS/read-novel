import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import {
  saveNovel, getAllNovels, getNovel, deleteNovel,
  saveChaptersMetaToDB, getChaptersMetaFromDB,
  saveChapterToDB, getChapterFromDB
} from '@/utils/db'

export const useNovelStore = defineStore('novel', () => {
  // state
  const isDark = ref(false)
  const novels = ref([])
  const chaptersMeta = ref([])
  const currentChapterContent = ref('')
  const currentNovel = ref(null)
  const currentChapterIndex = ref(0)
  const uploaded = ref(false)
  const pageSize = ref(20)
  const currentPage = ref(1)
  const showManager = ref(false)
  const isSidebarCollapsed = ref(false)
  const novelProgress = reactive({})
  const lastReadNovelName = ref(null)
  const batchSize = ref(3)
  const currentLoadedChapters = ref([])
  const loadedRange = ref({ start: 0, end: 0 })

  // 分页相关 computed
  const currentPageChapters = computed(() => {
    if (!Array.isArray(chaptersMeta.value)) return []
    const start = (currentPage.value - 1) * pageSize.value
    const end = currentPage.value * pageSize.value
    return chaptersMeta.value.slice(start, end)
  })
  const totalPages = computed(() => {
    if (!Array.isArray(chaptersMeta.value) || pageSize.value === 0) return 1
    return Math.max(1, Math.ceil(chaptersMeta.value.length / pageSize.value))
  })

  // actions
  function toggleTheme() {
    isDark.value = !isDark.value
  }
  function setCurrentNovel(val) {
    currentNovel.value = val
    lastReadNovelName.value = val
  }
  function setCurrentChapterIndex(idx) {
    currentChapterIndex.value = idx
    if (currentNovel.value) {
      novelProgress[currentNovel.value] = idx
    }
  }
  function toggleSidebarCollapsed() {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
  }
  function setNovelProgress(novel, idx) {
    novelProgress[novel] = idx
  }
  function setLastReadNovelName(val) {
    lastReadNovelName.value = val
  }

  // 章节拆分，只返回元数据和内容数组
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

  // 加载所有小说
  async function loadNovels() {
    const novelsList = await getAllNovels()
    novels.value = novelsList
  }

  // 上传小说，章节内容分离存储
  async function uploadNovel(content, name) {
    setCurrentNovel(name)
    const chaptersArr = splitChapters(content)
    // 存储章节元数据
    const meta = chaptersArr.map((c, i) => ({ title: c.title, index: i }))
    await saveChaptersMetaToDB(name, meta)
    chaptersMeta.value = meta
    // 存储每章内容
    for (let i = 0; i < chaptersArr.length; i++) {
      await saveChapterToDB(name, i, chaptersArr[i].content)
    }
    setCurrentChapterIndex(0)
    uploaded.value = true
    await saveNovel({ name, lastRead: 0 })
    await loadNovels()
    currentPage.value = 1
    // 加载第一章内容
    currentChapterContent.value = chaptersArr[0]?.content || ''
  }

  // 加载章节元数据
  async function loadChaptersMeta(novel) {
    const meta = await getChaptersMetaFromDB(novel)
    chaptersMeta.value = meta
  }

  // 加载当前章节内容
  async function loadChapterContent(novel, index) {
    const content = await getChapterFromDB(novel, index)
    currentChapterContent.value = content
    setCurrentChapterIndex(index)
    if (currentNovel.value) {
      novelProgress[currentNovel.value] = index
    }
  }

  // 切换小说
  async function selectNovel(name) {
    setCurrentNovel(name)
    await loadChaptersMeta(name)
    // 恢复进度
    const idx = novelProgress[name] ?? 0
    await loadChapterContent(name, idx)
    uploaded.value = true
    await saveNovel({ name, lastRead: idx })
    currentPage.value = Math.floor(idx / pageSize.value) + 1
    showManager.value = false
  }

  // 删除小说
  async function removeNovel(name) {
    await deleteNovel(name)
    await loadNovels()
    if (currentNovel.value === name) {
      setCurrentNovel('')
      chaptersMeta.value = []
      currentChapterContent.value = ''
      setCurrentChapterIndex(0)
      uploaded.value = false
      currentPage.value = 1
    }
  }

  async function loadMoreChapters(direction = 'down') {
    if (!currentNovel.value) return
    if (direction === 'down') {
      const nextStart = loadedRange.value.end
      const nextEnd = Math.min(nextStart + batchSize.value, chaptersMeta.value.length)
      for (let i = nextStart; i < nextEnd; i++) {
        const content = await getChapterFromDB(currentNovel.value, i)
        currentLoadedChapters.value.push({ ...chaptersMeta.value[i], content })
      }
      loadedRange.value.end = nextEnd
    } else if (direction === 'up') {
      const prevStart = Math.max(0, loadedRange.value.start - batchSize.value)
      const inserts = []
      for (let i = prevStart; i < loadedRange.value.start; i++) {
        const content = await getChapterFromDB(currentNovel.value, i)
        inserts.push({ ...chaptersMeta.value[i], content })
      }
      currentLoadedChapters.value = inserts.concat(currentLoadedChapters.value)
      loadedRange.value.start = prevStart
    }
    trimLoadedChapters()
  }

  function resetLoadedChapters(centerIdx = 0) {
    const start = Math.max(0, centerIdx - batchSize.value)
    const end = Math.min(chaptersMeta.value.length, centerIdx + batchSize.value + 1)
    loadedRange.value = { start, end }
    currentLoadedChapters.value = []
    for (let i = start; i < end; i++) {
      getChapterFromDB(currentNovel.value, i).then(content => {
        currentLoadedChapters.value[i - start] = { ...chaptersMeta.value[i], content }
        trimLoadedChapters()
      })
    }
    setCurrentChapterIndex(centerIdx)
  }

  function trimLoadedChapters() {
    const N = 3
    const start = Math.max(0, currentChapterIndex.value - N)
    const end = Math.min(chaptersMeta.value.length, currentChapterIndex.value + batchSize.value + N)
    const keepIndexes = []
    for (let i = start; i < end; i++) keepIndexes.push(i)
    currentLoadedChapters.value = currentLoadedChapters.value.filter(ch => keepIndexes.includes(ch.index))
    loadedRange.value = { start, end }
  }

  const _originSetCurrentChapterIndex = setCurrentChapterIndex
  function setCurrentChapterIndexWithTrim(idx) {
    _originSetCurrentChapterIndex(idx)
    trimLoadedChapters()
  }

  return {
    // state
    isDark, novels, chaptersMeta, currentChapterContent, currentNovel, currentChapterIndex,
    uploaded, pageSize, currentPage, showManager, isSidebarCollapsed,
    novelProgress, lastReadNovelName,
    batchSize, currentLoadedChapters, loadedRange,
    // computed
    currentPageChapters, totalPages,
    // actions
    toggleTheme, setCurrentNovel, setCurrentChapterIndex: setCurrentChapterIndexWithTrim, toggleSidebarCollapsed, setNovelProgress, setLastReadNovelName,
    splitChapters,
    loadNovels,
    uploadNovel,
    loadChaptersMeta,
    loadChapterContent,
    selectNovel,
    removeNovel,
    loadMoreChapters, resetLoadedChapters, trimLoadedChapters
  }
}, {
  persist: true,
},) 