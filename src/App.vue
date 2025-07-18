<template>
  <n-config-provider :theme="themeStore.isDark ? darkTheme : null">
    <n-layout :native-scrollbar="false" class="h-screen">
      <HeaderBar />
      <n-drawer v-model:show="themeStore.showManager" width="400" placement="right">
        <n-drawer-content>
          <template #header>
            <h3>
              小说管理
            </h3>
          </template>
          <NovelManager class="mb-6" />
          <template #footer>
            <UploadCard />
          </template>
        </n-drawer-content>
      </n-drawer>
      <n-layout has-sider style="height: calc(100vh - 45px);">
        <Sidebar />
        <n-layout-content>
          <div style="height: 100%; display: flex; flex-direction: column;">
            <UploadCard v-if="!readerStore.uploaded" />
            <ReaderContent v-else />
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>
<script setup>
import { darkTheme } from 'naive-ui'

const themeStore = useThemeStore()
const libraryStore = useLibraryStore()
const readerStore = useReaderStore()

onMounted(async () => {
  await libraryStore.loadNovels()
  if (
    readerStore.lastReadNovelName &&
    typeof readerStore.lastReadNovelName === 'object' &&
    'value' in readerStore.lastReadNovelName &&
    readerStore.lastReadNovelName.value
  ) {
    await readerStore.selectNovel(readerStore.lastReadNovelName.value)
  }
})

// 自动设置网页 title
watch(
  () => [readerStore.currentNovel, readerStore.chaptersMeta, readerStore.currentChapterIndex],
  () => {
    const novel = readerStore.currentNovel || ''
    const chapter = readerStore.chaptersMeta?.[readerStore.currentChapterIndex]?.title || ''
    document.title = chapter ? `${novel} - ${chapter}` : novel
  },
  { immediate: true, deep: true }
)
</script>
<style></style>
