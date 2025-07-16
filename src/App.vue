<script setup>
import { onMounted } from 'vue'
import { useNovelStore } from './stores/novel'
import { darkTheme } from 'naive-ui'
import HeaderBar from './components/HeaderBar.vue'
import Sidebar from './components/Sidebar.vue'
import UploadCard from './components/UploadCard.vue'
import ReaderContent from './components/ReaderContent.vue'
import NovelManager from './components/NovelManager.vue'

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
</script>

<template>
  <n-config-provider :theme="store.isDark ? darkTheme : null">
    <n-layout class="min-h-screen" style="height: 100vh;" :native-scrollbar="false">
      <HeaderBar />
      <n-drawer v-model:show="store.showManager" width="200" placement="right">
        <NovelManager class="mb-6" />
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
