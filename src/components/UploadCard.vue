<template>
  <n-card title="上传小说">
    <input
      ref="fileInput"
      type="file"
      accept=".txt"
      @change="handleUpload"
      :disabled="uploading"
      style="display: none"
    />
    <n-button
      type="primary"
      @click="triggerUpload"
      :loading="uploading"
      :disabled="uploading"
    >
      选择文件上传
    </n-button>
    <n-spin v-if="uploading" size="small" class="ml-2">上传中...</n-spin>
  </n-card>
</template>

<script setup>

const store = useNovelStore()

const uploading = ref(false)
const fileInput = ref(null)

function triggerUpload() {
  fileInput.value && fileInput.value.click()
}

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