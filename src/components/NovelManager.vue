<template>
  <n-list bordered size="small">
    <n-list-item v-for="novel in store.novels" :key="novel.name" class="flex justify-between cursor-pointer"
      @click="handleSelect(novel.name)">
      <div style="flex:1;" @dblclick.stop="handleEditStart(novel.name)">
        <template v-if="editingKey === novel.name">
          <n-input v-model:value="editValue" size="small" @keydown.enter="handleEditSave(novel.name)"
            @keydown.esc="handleEditCancel" />
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
            <n-button quaternary disabled type="success" circle size="small" v-if="novel.name === store.currentNovel">
              <IconIonCheckmarkCircleOutline />
            </n-button>
          </template>
        </n-space>
      </template>
    </n-list-item>
  </n-list>
</template>

<script setup>
const store = useNovelStore()

const editingKey = ref(null)
const editValue = ref('')
const saving = ref(false)

function handleSelect(name) {
  store.selectNovel(name)
}

function handleDelete(name, e) {
  e.stopPropagation()
  store.removeNovel(name)
}

function handleEditStart(name) {
  editingKey.value = name
  editValue.value = name
  nextTick(() => {
    const input = document.querySelector('.novel-edit-input')
    if (input) input.focus()
  })
}

async function handleEditSave(name) {
  if (saving.value) return
  saving.value = true
  const newName = editValue.value.trim()
  if (newName && newName !== name) {
    await store.renameNovel(name, newName)
  }
  editingKey.value = null
  editValue.value = ''
  saving.value = false
}

function handleEditCancel() {
  if (saving.value) return // 如果正在保存，不执行取消
  editingKey.value = null
  editValue.value = ''
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