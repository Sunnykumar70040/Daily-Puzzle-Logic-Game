import { openDB } from 'idb';

const DB_NAME = 'MyAppDB';
const DB_VERSION = 1;
const STORE_NAME = 'users';

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

export async function saveUser(user) {
  const db = await dbPromise;
  return db.put(STORE_NAME, user);
}

export async function getUser(id) {
  const db = await dbPromise;
  return db.get(STORE_NAME, id);
}
