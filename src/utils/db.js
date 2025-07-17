import { openDB } from 'idb';

const dbPromise = openDB('novel-reader', 2, {
  upgrade(db, oldVersion) {
    if (!db.objectStoreNames.contains('novels')) {
      db.createObjectStore('novels', { keyPath: 'name' });
    }
    if (!db.objectStoreNames.contains('chaptersMeta')) {
      db.createObjectStore('chaptersMeta', { keyPath: 'novel' });
    }
    if (!db.objectStoreNames.contains('chapterContent')) {
      const store = db.createObjectStore('chapterContent', { keyPath: ['novel', 'index'] });
      // novel: 小说名, index: 章节索引
    }
  }
});

// 小说元数据
export async function saveNovel(novel) {
  const db = await dbPromise;
  await db.put('novels', novel);
}
export async function getNovel(name) {
  const db = await dbPromise;
  return db.get('novels', name);
}
export async function getAllNovels() {
  const db = await dbPromise;
  return db.getAll('novels');
}
export async function deleteNovel(name) {
  const db = await dbPromise;
  await db.delete('novels', name);
  await db.delete('chaptersMeta', name);
  // 删除所有章节内容
  const tx = db.transaction('chapterContent', 'readwrite');
  const store = tx.objectStore('chapterContent');
  let cursor = await store.openCursor();
  while (cursor) {
    if (cursor.key[0] === name) {
      await cursor.delete();
    }
    cursor = await cursor.continue();
  }
  await tx.done;
}

// 小说重命名
export async function renameNovelInDB(oldName, newName) {
  const db = await dbPromise;
  const novel = await db.get('novels', oldName);
  if (novel) {
    novel.name = newName;
    await db.put('novels', novel);
    await db.delete('novels', oldName);
  }
  const meta = await db.get('chaptersMeta', oldName);
  if (meta) {
    meta.novel = newName;
    await db.put('chaptersMeta', meta);
    await db.delete('chaptersMeta', oldName);
  }
  const tx = db.transaction('chapterContent', 'readwrite');
  const store = tx.objectStore('chapterContent');
  let cursor = await store.openCursor();
  while (cursor) {
    if (cursor.key[0] === oldName) {
      // 复制到新 key
      await store.put({ novel: newName, index: cursor.key[1], content: cursor.value.content });
      await cursor.delete();
    }
    cursor = await cursor.continue();
  }
  await tx.done;
}

// 章节元数据
export async function saveChaptersMetaToDB(novel, meta) {
  const db = await dbPromise;
  await db.put('chaptersMeta', { novel, meta });
}
export async function getChaptersMetaFromDB(novel) {
  const db = await dbPromise;
  const res = await db.get('chaptersMeta', novel);
  return res ? res.meta : [];
}

// 单章内容
export async function saveChapterToDB(novel, index, content) {
  const db = await dbPromise;
  await db.put('chapterContent', { novel, index, content });
}
export async function getChapterFromDB(novel, index) {
  const db = await dbPromise;
  const res = await db.get('chapterContent', [novel, index]);
  return res ? res.content : '';
} 