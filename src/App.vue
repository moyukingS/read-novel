<template>
  <n-config-provider :theme="store.isDark ? darkTheme : null">
    <n-layout :native-scrollbar="false" class="h-screen">
      <HeaderBar/>
      <n-drawer v-model:show="store.showManager" width="400" placement="right">
        <n-drawer-content>
          <template #header>
            <h3>
              小说管理
            </h3>
          </template>
          <NovelManager class="mb-6"/>
          <template #footer>
            <UploadCard/>
          </template>
        </n-drawer-content>
      </n-drawer>
      <n-layout has-sider :content-style="{'padding-top': '15px'}">
        <Sidebar/>
        <n-layout-content>
          <div  class="h-full flex flex-col ">
            <UploadCard v-if="!store.uploaded"/>
            <ReaderContent v-else/>
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>
<script setup>
import {darkTheme} from 'naive-ui'

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
    {immediate: true, deep: true}
)
</script>
<style></style>
