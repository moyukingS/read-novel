<template>
  <n-card title="上传小说">
    <input type="file" accept=".txt" @change="handleUpload" :disabled="uploading" />
    <n-spin v-if="uploading" size="small">上传中...</n-spin>
  </n-card>
</template>

<script setup>
import { ref } from 'vue'
import { useNovelStore } from '@/stores/novel'
const store = useNovelStore()

const uploading = ref(false)

async function handleUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  uploading.value = true
  const reader = new FileReader()
  reader.onload = async (evt) => {
    const content = evt.target.result
    await store.uploadNovel(content, file.name)
    uploading.value = false
  }
  reader.readAsText(file)
}
</script>

<style scoped>
.n-card {
  margin: 0 auto;
}
</style> 