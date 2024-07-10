// Import the openDB function from the idb library
import { openDB } from "idb";

// Define constants for the database name and store name
const DB_NAME = "offline-data";
const STORE_NAME = "requests";

// Initialize the database
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

// Add a request to the database
export const addRequest = async (request) => {
  const db = await initDB();
  await db.add(STORE_NAME, request);
};

