<template>
  <n-layout-header bordered>
    <div class="w-full flex justify-between items-center px-4 h-[45px]">
      <div class="flex items-center">
        <a href="/"><img :src="Logo" alt="logo" class="w-10 rounded "/></a>
        <span class="ml-2 font-bold text-lg">read-novel</span>
      </div>
      <div v-if="store.uploaded" class="flex items-center gap-4">
        <div>
          <template v-if="!editingName">
            <span style="font-weight:bold; cursor:pointer;" @click="editingName = true">{{ store.currentNovel }}</span>
          </template>
          <template v-else>
            <n-input-group>
              <n-input v-model:value="editName" size="small" style="width:120px" @keyup.enter="saveName"/>
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
      <div class="flex gap-4 items-center">
        <n-button quaternary circle @click="store.toggleTheme">
          <n-icon>
            <MoonOutline v-if="!store.isDark"/>
            <SunnyOutline v-else/>
          </n-icon>
        </n-button>
        <n-button quaternary circle @click="store.showManager = true">
          <n-icon>
            <SettingsOutline/>
          </n-icon>
        </n-button>
      </div>
    </div>
  </n-layout-header>
</template>

<script setup>
import Logo from '@/assets/images/cat.svg'
import {BookOutline, MoonOutline, SunnyOutline, SettingsOutline} from '@vicons/ionicons5'

const store = useNovelStore()

const editingName = ref(false)
const editName = ref(store.currentNovel)

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
</style>
