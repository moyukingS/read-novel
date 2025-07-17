<template>
  <n-layout-header>
    <n-space align="center" justify="space-between" class="w-full px-4 ">
      <div class="flex items-center" style="height: 45px;">
        <n-icon size="24">
          <BookOutline />
        </n-icon>
        <span class="ml-2 font-bold text-lg">read-novel</span>
      </div>
      <div v-if="store.uploaded" style="display:flex; align-items:center; gap: 16px;">
        <div>
          <template v-if="!editingName">
            <span style="font-weight:bold; cursor:pointer;" @click="editingName = true">{{ store.currentNovel }}</span>
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
          :percentage="store.chaptersMeta.length ? ((store.currentChapterIndex + 1) / store.chaptersMeta.length) * 100 : 0"
          :show-indicator="false"
          
          :stroke-width="8"
          style="width: 26px; height: 26px;"
        >
        </n-progress>
      </div>
      <div>
        <n-button quaternary circle @click="store.toggleTheme">
          <n-icon>
            <MoonOutline v-if="!store.isDark" />
            <SunnyOutline v-else />
          </n-icon>
        </n-button>
        <n-button quaternary circle @click="store.showManager = true">
          <n-icon>
            <SettingsOutline />
          </n-icon>
        </n-button>
      </div>
    </n-space>
  </n-layout-header>
</template>

<script setup>
import { useNovelStore } from '@/stores/novel'
import { NButton, NSpace, NIcon, NProgress, NInput, NInputGroup } from 'naive-ui'
import { MoonOutline, SunnyOutline, BookOutline, SettingsOutline } from '@vicons/ionicons5'
import { ref, watch } from 'vue'

const store = useNovelStore()

const editingName = ref(false)
const editName = ref(store.currentNovel)

// 保持 editName 与 store.currentNovel 同步
watch(() => store.currentNovel, (val) => {
  if (!editingName.value) editName.value = val
})

async function saveName() {
  if (editName.value && editName.value !== store.currentNovel) {
    await store.renameNovel(store.currentNovel, editName.value)
  }
  editingName.value = false
}
function cancelEdit() {
  editName.value = store.currentNovel
  editingName.value = false
}
</script>

<style scoped>
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em 2em;
  background: #f5f5f5;
  border-bottom: 1px solid #eee;
}
</style>
