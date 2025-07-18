<template>
  <n-upload
    :custom-request="customRequest"
    :show-file-list="false"
    accept=".txt"
    :disabled="uploading"
  >
    <n-button type="primary" :loading="uploading" :disabled="uploading">
      选择文件上传
    </n-button>
  </n-upload>
  <n-spin v-if="uploading" size="small" class="ml-2">上传中...</n-spin>
</template>

<script setup>
const libraryStore = useLibraryStore()
const readerStore = useReaderStore()

const uploading = ref(false)

async function customRequest({ file, onFinish, onError }) {
  const rawFile = file.file || file
  try {
    const content = await rawFile.text()
    await libraryStore.uploadNovel(content, rawFile.name)
    await readerStore.selectNovel(rawFile.name)
    onFinish()
  } catch (e) {
    onError()
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.n-card {
  margin: 0 auto;
}
</style> 