<template>
  <n-space vertical size="large">
    <n-form label-width="auto" label-align="left" style="margin-bottom: 8px">
      <n-form-item label="章节分割正则">
        <n-input
          v-model:value="chapterRegInput"
          placeholder="请输入章节分割正则"
          clearable
        />
        <n-button
          size="small"
          type="primary"
          @click="handleSaveChapterReg"
          style="margin-left: 8px"
          >保存</n-button
        >
      </n-form-item>
    </n-form>
    <n-list bordered size="small">
      <n-list-item
        v-for="novel in store.novels"
        :key="novel.name"
        class="flex justify-between cursor-pointer"
        @click="handleSelect(novel.name)"
      >
        <div style="flex: 1" @dblclick.stop="handleEditStart(novel.name)">
          <template v-if="editingKey === novel.name">
            <n-input
              v-model:value="editValue"
              size="small"
              @keydown="handleInputKeydown"
            />
          </template>
          <template v-else>
            {{ novel.name }}
          </template>
        </div>
        <template #suffix>
          <n-space class="w-28" align="center">
            <template v-if="editingKey === novel.name">
              <n-button
                quaternary
                circle
                size="small"
                type="success"
                @click.stop="handleEditSave(novel.name)"
              >
                <IconIonCheckmarkCircleOutline />
              </n-button>
              <n-button
                quaternary
                circle
                size="small"
                type="error"
                @click.stop="handleEditCancel"
              >
                <IconIonCloseOutline />
              </n-button>
            </template>
            <template v-else>
              <n-button
                quaternary
                circle
                size="small"
                @click.stop="handleEditStart(novel.name)"
              >
                <IconIonCreateOutline />
              </n-button>
              <n-button
                quaternary
                circle
                size="small"
                type="error"
                @click.stop="handleDelete(novel.name, $event)"
              >
                <IconIonTrashOutline />
              </n-button>
              <n-button
                quaternary
                disabled
                type="success"
                circle
                size="small"
                v-if="novel.name === store.currentNovel"
              >
                <IconIonCheckmarkCircleOutline />
              </n-button>
            </template>
          </n-space>
        </template>
      </n-list-item>
    </n-list>
  </n-space>
</template>

<script setup>
const store = useNovelStore();
const editingKey = ref(null);
const editValue = ref("");
const saving = ref(false);
const chapterRegInput = ref(store.chapterReg || "");

function handleSaveChapterReg() {
  store.setChapterReg(chapterRegInput.value);
}

function handleSelect(name) {
  store.selectNovel(name);
}

function handleDelete(name, e) {
  e.stopPropagation();
  store.removeNovel(name);
}

function handleEditStart(name) {
  editingKey.value = name;
  editValue.value = name;
  nextTick(() => {
    const input = document.querySelector(".novel-edit-input");
    if (input) input.focus();
  });
}

function handleInputKeydown(e) {
  if (e.key === "Enter") {
    handleEditSave(editingKey.value);
  } else if (e.key === "Escape") {
    handleEditCancel();
  }
}

async function handleEditSave(name) {
  if (saving.value) return;
  saving.value = true;
  const newName = editValue.value.trim();
  if (newName && newName !== name) {
    await store.renameNovel(name, newName);
  }
  editingKey.value = null;
  editValue.value = "";
  saving.value = false;
}

function handleEditCancel() {
  if (saving.value) return; // 如果正在保存，不执行取消
  editingKey.value = null;
  editValue.value = "";
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
