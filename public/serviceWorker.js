importScripts("https://cdn.jsdelivr.net/npm/idb@7/build/umd.js");

self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
});

self.addEventListener("sync", async (event) => {
  if (event.tag === "sync-requests") {
    event.waitUntil(syncRequests());
  }
});

const syncRequests = async () => {
  const db = await idb.openDB("offline-data", 1);

  const requests = await db.getAll("requests");
  console.log('get request', requests);

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
