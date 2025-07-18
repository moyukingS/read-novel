import { defineStore } from 'pinia'
import { ref } from 'vue'
import { saveNovel, getAllNovels, deleteNovel, renameNovelInDB, saveChaptersMetaToDB, saveChapterToDB } from '@/utils/db'

export const useLibraryStore = defineStore('library', () => {
  const novels = ref([])
  const novelProgress = ref({}) 

  async function loadNovels() {
    const novelsList = await getAllNovels()
    novels.value = novelsList
  }

  async function uploadNovel(content, name) {
    // 分章节
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
    const chaptersArr = splitChapters(content)
    const meta = chaptersArr.map((c, i) => ({ title: c.title, index: i }))
    await saveChaptersMetaToDB(name, meta)
    for (let i = 0; i < chaptersArr.length; i++) {
      console.log('[uploadNovel] saveChapterToDB', name, i, chaptersArr[i].content.slice(0, 30))
      await saveChapterToDB(name, i, chaptersArr[i].content)
    }
    await saveNovel({ name, lastRead: 0 })
    await loadNovels()
  }

  async function uploadNovelRecord(name, lastRead = 0) {
    await saveNovel({ name, lastRead })
    await loadNovels()
  }

  async function removeNovel(name) {
    await deleteNovel(name)
    await loadNovels()
    // 删除进度
    if (novelProgress.value[name] !== undefined) {
      delete novelProgress.value[name]
    }
  }

  async function renameNovel(oldName, newName) {
    if (!oldName || !newName || oldName === newName) return
    await renameNovelInDB(oldName, newName)
    await loadNovels()
    // 进度同步
    if (novelProgress.value[oldName] !== undefined) {
      novelProgress.value[newName] = novelProgress.value[oldName]
      delete novelProgress.value[oldName]
    }
  }

  return {
    novels,
    novelProgress,
    loadNovels,
    uploadNovel,
    uploadNovelRecord,
    removeNovel,
    renameNovel
  }
}, {
  persist: true
}) 