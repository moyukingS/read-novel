import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import {
  saveNovel,
  getAllNovels,
  getNovel,
  deleteNovel,
  saveChaptersMetaToDB,
  getChaptersMetaFromDB,
  saveChapterToDB,
  getChapterFromDB,
  renameNovelInDB,
} from "@/utils/db";

export const useNovelStore = defineStore(
  "novel",
  () => {
    // state
    const isDark = ref(false);
    // 章节分割正则
    const chapterReg = ref(
      "(第[\\d一二三四五六七八九十百千零〇两]+[章回节].*|Chapter\\s*\\d+.*|^\\d{1,4}\\s+.+)"
    );
    const novels = ref([]);
    const chaptersMeta = ref([]);
    const currentChapterContent = ref("");
    const currentNovel = ref(null);
    const currentChapterIndex = ref(0);
    const uploaded = ref(false);
    const pageSize = ref(20);
    const currentPage = ref(1);
    const showManager = ref(false);
    const isSidebarCollapsed = ref(false);
    const novelProgress = reactive({});
    const lastReadNovelName = ref(null);

    // 分页相关 computed
    const currentPageChapters = computed(() => {
      if (!Array.isArray(chaptersMeta.value)) return [];
      const start = (currentPage.value - 1) * pageSize.value;
      const end = currentPage.value * pageSize.value;
      return chaptersMeta.value.slice(start, end);
    });
    const totalPages = computed(() => {
      if (!Array.isArray(chaptersMeta.value) || pageSize.value === 0) return 1;
      return Math.max(1, Math.ceil(chaptersMeta.value.length / pageSize.value));
    });

    // actions
    function toggleTheme() {
      isDark.value = !isDark.value;
    }
    function setCurrentNovel(val) {
      currentNovel.value = val;
      lastReadNovelName.value = val;
    }
    function setCurrentChapterIndex(idx) {
      currentChapterIndex.value = idx;
      if (currentNovel.value) {
        novelProgress[currentNovel.value] = idx;
      }
    }
    function toggleSidebarCollapsed() {
      isSidebarCollapsed.value = !isSidebarCollapsed.value;
    }
    function setNovelProgress(novel, idx) {
      novelProgress[novel] = idx;
    }
    function setLastReadNovelName(val) {
      lastReadNovelName.value = val;
    }

    // 章节拆分，只返回元数据和内容数组
    function splitChapters(content) {
      // 去除 BOM 和每行首尾空白
      content = content
        .replace(/^\uFEFF/, "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .join("\n");
      let regStr = chapterReg.value;
      let reg;
      try {
        reg = new RegExp(regStr, "gm");
      } catch (e) {
        reg =
          /(第[\d一二三四五六七八九十百千零〇两]+[章回节].*|Chapter\s*\d+.*)/gm;
      }
      const titles = [...content.matchAll(reg)].map((m) => m[0]);
      if (process.env.NODE_ENV === "development") {
        // 调试输出
        console.log("章节标题识别：", titles);
      }
      if (titles.length === 0) {
        return [{ title: "全文", content }];
      }
      const parts = content.split(reg);
      const arr = [];
      for (let i = 1; i < parts.length; i += 2) {
        arr.push({
          title: parts[i],
          content: (parts[i + 1] || "").trim(),
        });
      }
      return arr;
    }

    function setChapterReg(val) {
      chapterReg.value = val;
    }

    // 加载所有小说
    async function loadNovels() {
      const novelsList = await getAllNovels();
      novels.value = novelsList;
    }

    // 上传小说，章节内容分离存储
    async function uploadNovel(content, name) {
      setCurrentNovel(name);
      const chaptersArr = splitChapters(content);
      // 存储章节元数据
      const meta = chaptersArr.map((c, i) => ({ title: c.title, index: i }));
      await saveChaptersMetaToDB(name, meta);
      chaptersMeta.value = meta;
      // 存储每章内容
      for (let i = 0; i < chaptersArr.length; i++) {
        await saveChapterToDB(name, i, chaptersArr[i].content);
      }
      setCurrentChapterIndex(0);
      uploaded.value = true;
      await saveNovel({ name, lastRead: 0 });
      await loadNovels();
      currentPage.value = 1;
      // 加载第一章内容
      currentChapterContent.value = chaptersArr[0]?.content || "";
    }

    // 加载章节元数据
    async function loadChaptersMeta(novel) {
      const meta = await getChaptersMetaFromDB(novel);
      chaptersMeta.value = meta;
    }

    // 加载当前章节内容
    async function loadChapterContent(novel, index) {
      const content = await getChapterFromDB(novel, index);
      currentChapterContent.value = content;
      setCurrentChapterIndex(index);
      if (currentNovel.value) {
        novelProgress[currentNovel.value] = index;
      }
    }

    // 切换小说
    async function selectNovel(name) {
      setCurrentNovel(name);
      await loadChaptersMeta(name);
      // 恢复进度
      const idx = novelProgress[name] ?? 0;
      await loadChapterContent(name, idx);
      uploaded.value = true;
      await saveNovel({ name, lastRead: idx });
      currentPage.value = Math.floor(idx / pageSize.value) + 1;
    }

    // 删除小说
    async function removeNovel(name) {
      await deleteNovel(name);
      await loadNovels();
      if (currentNovel.value === name) {
        setCurrentNovel("");
        chaptersMeta.value = [];
        currentChapterContent.value = "";
        setCurrentChapterIndex(0);
        uploaded.value = false;
        currentPage.value = 1;
      }
    }

    // 小说重命名
    async function renameNovel(oldName, newName) {
      if (!oldName || !newName || oldName === newName) return;
      await renameNovelInDB(oldName, newName);
      // 更新 novels 列表
      await loadNovels();
      // novelProgress key
      if (novelProgress[oldName] !== undefined) {
        novelProgress[newName] = novelProgress[oldName];
        delete novelProgress[oldName];
      }
      // currentNovel
      if (currentNovel.value === oldName) {
        currentNovel.value = newName;
      }
      // lastReadNovelName
      if (lastReadNovelName.value === oldName) {
        lastReadNovelName.value = newName;
      }
      // 如果当前已上传，刷新章节元数据和内容
      if (uploaded.value && currentNovel.value === newName) {
        await loadChaptersMeta(newName);
        await loadChapterContent(newName, currentChapterIndex.value);
      }
    }

    return {
      // state
      isDark,
      novels,
      chaptersMeta,
      currentChapterContent,
      currentNovel,
      currentChapterIndex,
      uploaded,
      pageSize,
      currentPage,
      showManager,
      isSidebarCollapsed,
      novelProgress,
      lastReadNovelName,
      chapterReg,
      // computed
      currentPageChapters,
      totalPages,
      // actions
      toggleTheme,
      setCurrentNovel,
      setCurrentChapterIndex,
      toggleSidebarCollapsed,
      setNovelProgress,
      setLastReadNovelName,
      splitChapters,
      setChapterReg,
      loadNovels,
      uploadNovel,
      loadChaptersMeta,
      loadChapterContent,
      selectNovel,
      removeNovel,
      renameNovel,
    };
  },
  {
    persist: true,
  }
);
