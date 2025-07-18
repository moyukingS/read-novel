<template>
  <n-list bordered size="small">
    <n-list-item v-for="novel in libraryStore.novels" :key="novel.name" class="flex justify-between cursor-pointer"
      @click="handleSelect(novel.name)">
      <div style="flex:1;" @dblclick.stop="handleEditStart(novel.name)">
        <template v-if="editingKey === novel.name">
          <n-input v-model:value="editValue" size="small" @keydown="handleInputKeydown" />
        </template>
        <template v-else>
          {{ novel.name }}
        </template>
      </div>
      <template #suffix>
        <n-space class="w-28" align="center">
          <template v-if="editingKey === novel.name">
            <n-button quaternary circle size="small" type="success" @click.stop="handleEditSave(novel.name)">
              <IconIonCheckmarkCircleOutline />
            </n-button>
            <n-button quaternary circle size="small" type="error" @click.stop="handleEditCancel">
              <IconIonCloseOutline />
            </n-button>
          </template>
          <template v-else>
            <n-button quaternary circle size="small" @click.stop="handleEditStart(novel.name)">
              <IconIonCreateOutline />
            </n-button>
            <n-button quaternary circle size="small" type="error" @click.stop="handleDelete(novel.name, $event)">
              <IconIonTrashOutline />
            </n-button>
            <n-button quaternary disabled type="success" circle size="small" v-if="novel.name === readerStore.currentNovel">
              <IconIonCheckmarkCircleOutline />
            </n-button>
          </template>
        </n-space>
      </template>
    </n-list-item>
  </n-list>
</template>

<script setup>
import { useLibraryStore } from '@/stores/library'
import { useReaderStore } from '@/stores/reader'

const libraryStore = useLibraryStore()
const readerStore = useReaderStore()

const editingKey = ref(null)
const editValue = ref('')

function handleSelect(name) {
  readerStore.selectNovel(name)
}

function handleDelete(name, e) {
  e.stopPropagation()
  libraryStore.removeNovel(name)
}

function handleEditStart(name) {
  editingKey.value = name
  editValue.value = name
}

function handleInputKeydown(e) {
  if (e.key === 'Enter') {
    handleEditSave(editingKey.value)
  } else if (e.key === 'Escape') {
    handleEditCancel()
  }
}

async function handleEditSave(name) {
  const newName = editValue.value.trim()
  if (newName && newName !== name) {
    await libraryStore.renameNovel(name, newName)
    if (readerStore.currentNovelKey === name) {
      readerStore.currentNovelKey = newName
    }
  }
  editingKey.value = null
}

function handleEditCancel() {
  editingKey.value = null
}
</script>

<style scoped>
.novel-manager {
  padding: 1em;
}

.novel-edit-input {
  min-width: 80px;
}
</style>