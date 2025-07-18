<template>
  <n-layout-header>
    <div class="w-full flex justify-between items-center px-4 h-[45px]">
      <div class="flex items-center">
        <n-icon size="24">
          <BookOutline />
        </n-icon>
        <span class="ml-2 font-bold text-lg">read-novel</span>
      </div>
      <div v-if="readerStore.uploaded" class="flex items-center gap-4">
        <div>
          <template v-if="!editingName">
            <span style="font-weight:bold; cursor:pointer;" @click="editingName = true">{{ readerStore.currentNovel }}</span>
          </template>
          <template v-else>
            <n-input-group>
              <n-input v-model:value="editName" size="small" style="width:120px" @keyup.enter="saveName" />
              <n-button size="small" type="primary" @click="saveName">保存</n-button>
              <n-button size="small" @click="cancelEdit">取消</n-button>
            </n-input-group>
          </template>
        </div>
        <n-progress
          type="circle"
          :percentage="readerStore.chaptersMeta.length ? ((readerStore.currentChapterIndex + 1) / readerStore.chaptersMeta.length) * 100 : 0"
          :show-indicator="false"
          
          :stroke-width="8"
          style="width: 26px; height: 26px;"
        >
        </n-progress>
      </div>
      <div class="flex gap-4 items-center">
        <n-button quaternary circle @click="themeStore.toggleTheme">
          <n-icon>
            <MoonOutline v-if="!themeStore.isDark" />
            <SunnyOutline v-else />
          </n-icon>
        </n-button>
        <n-button quaternary circle @click="themeStore.showManager = true">
          <n-icon>
            <SettingsOutline />
          </n-icon>
        </n-button>
      </div>
    </div>
  </n-layout-header>
</template>

<script setup>
import { BookOutline, MoonOutline, SunnyOutline, SettingsOutline } from '@vicons/ionicons5'
import { useThemeStore } from '@/stores/theme'
import { useLibraryStore } from '@/stores/library'
import { useReaderStore } from '@/stores/reader'

const themeStore = useThemeStore()
const libraryStore = useLibraryStore()
const readerStore = useReaderStore()

const editingName = ref(false)
const editName = ref(readerStore.currentNovel)

watch(() => readerStore.currentNovel, (val) => {
  if (!editingName.value) editName.value = val
})

async function saveName() {
  if (editName.value && editName.value !== readerStore.currentNovel) {
    await libraryStore.renameNovel(readerStore.currentNovel, editName.value)
  }
  editingName.value = false
}
function cancelEdit() {
  editName.value = readerStore.currentNovel
  editingName.value = false
}
</script>

<style scoped>
</style>
