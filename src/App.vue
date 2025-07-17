<script setup>


const store = useNovelStore()

onMounted(async () => {
  await store.loadNovels()
  if (
    store.lastReadNovelName &&
    typeof store.lastReadNovelName === 'object' &&
    'value' in store.lastReadNovelName &&
    store.lastReadNovelName.value
  ) {
    await store.selectNovel(store.lastReadNovelName.value)
  }
})

// 自动设置网页 title
watch(
  () => [store.currentNovel, store.chaptersMeta, store.currentChapterIndex],
  () => {
    const novel = store.currentNovel || ''
    const chapter = store.chaptersMeta?.[store.currentChapterIndex]?.title || ''
    document.title = chapter ? `${novel} - ${chapter}` : novel
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <n-config-provider :theme="store.isDark ? darkTheme : null">
    <n-layout class="min-h-screen" style="height: 100vh;" :native-scrollbar="false">
      <HeaderBar />
      <n-drawer v-model:show="store.showManager" width="400" placement="right">

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
      <n-layout has-sider :native-scrollbar="false" style="height: 100%;">
        <Sidebar />
        <n-layout-content :native-scrollbar="false" style="height: 100%;">
          <div style="height: 100%; display: flex; flex-direction: column;">
            <UploadCard v-if="!store.uploaded" />
            <ReaderContent v-else />
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>

<style>
html,
body,
#app {
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
