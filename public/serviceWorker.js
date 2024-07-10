// Import the IndexedDB Promised library
importScripts("https://cdn.jsdelivr.net/npm/idb@7/build/umd.js");

// Event listener for the 'install' event
self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
});

// Event listener for the 'activate' event
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
});

// Event listener for the 'sync' event
self.addEventListener("sync", async (event) => {
  if (event.tag === "sync-requests") {
    event.waitUntil(syncRequests());
  }
});

// Function to handle syncing requests
const syncRequests = async () => {
  // Open the IndexedDB database named 'offline-data' with version 1
  const db = await idb.openDB("offline-data", 1);

  // Get all requests from the 'requests' object store
  const requests = await db.getAll("requests");
  
  // Loop through each request and perform desired operations
  for (const request of requests) {
    try {
      await fetch(request.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request.data),
      });
    } catch (error) {
      console.error("Sync failed:", error);
    }
  }
  await db.clear("requests");
};
