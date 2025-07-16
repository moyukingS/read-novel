<template>
  <div class="flex items-center mb-4 p-5">
    <span class="mr-2">每次加载章节数：</span>
    <n-input-number v-model:value="store.batchSize" :min="1" :max="10" size="small" style="width: 80px;" />
  </div>
  <n-list>
    <n-list-item v-for="novel in store.novels" :key="novel.name">
      <div class="flex justify-between items-center">
        <span @click="handleSelect(novel.name)" class="cursor-pointer">{{ novel.name }}</span>
        <n-button size="small" type="error" @click="handleDelete(novel.name)">删除</n-button>
      </div>
    </n-list-item>
  </n-list>
</template>

<script setup>
import { useNovelStore } from '@/stores/novel'
const store = useNovelStore()

async function handleSelect(name) {
  await store.selectNovel(name)
}

async function handleDelete(name) {
  await store.removeNovel(name)
}
</script>

<style scoped>
.novel-manager {
  padding: 1em;
}
.novel-manager ul {
  list-style: none;
  padding: 0;
}
.novel-manager li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5em;
}
</style> 