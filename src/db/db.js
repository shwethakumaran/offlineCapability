import { openDB } from "idb";

const DB_NAME = "offline-data";

const STORE_NAME = "requests";

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
};

export const addRequest = async (request) => {
  const db = await initDB();
 console.log('add request',request);
  await db.add(STORE_NAME, request);
};

export const getAllRequests = async () => {
  const db = await initDB();
  
  return await db.getAll(STORE_NAME);
};

export const clearRequests = async () => {
  const db = await initDB();

  await db.clear(STORE_NAME);
};
