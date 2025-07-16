<template>
  <n-menu
    :options="menuOptions"
    @update:value="handleSelect"
    :render-label="renderLabel"
  />
</template>

<script setup>
import { h ,computed} from 'vue'
import { NButton } from 'naive-ui'
import { useNovelStore } from '@/stores/novel'
const store = useNovelStore()

function handleSelect(name) {
  store.selectNovel(name)
}

function handleDelete(name, e) {
  e.stopPropagation()
  store.removeNovel(name)
}

const menuOptions = computed(() =>
  store.novels.map(novel => ({
    label: novel.name,
    key: novel.name
  }))
)

function renderLabel(option) {
  return h(
    'div',
    { style: 'display: flex; justify-content: space-between; align-items: center;' },
    [
      h('span', { style: 'flex: 1; cursor: pointer;' }, option.label),
      h(NButton, {
        size: 'small',
        type: 'error',
        onClick: (e) => handleDelete(option.key, e)
      }, { default: () => '删除' })
    ]
  )
}
</script>

<style scoped>
.novel-manager {
  padding: 1em;
}
</style> 