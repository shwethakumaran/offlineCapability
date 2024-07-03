export async function postData(data) {
  if (navigator.onLine) {
    try {
      const response = await fetch("https://reqres.in/api/users", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if(response.ok){
        localStorage.setItem('sendDataClicked',false);
      }
      return response.json();
    } catch (error) {
      queueDataForSync(data);
      return { success: false, error };
    }
  } else {
    queueDataForSync(data);
    return { success: false, error: "Offline" };
  }
}
function queueDataForSync(data) {
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    navigator.serviceWorker.ready.then((sw) => {
      sw.sync.register("post-data sync").then(() => {
        // Save data to IndexedDB oranother storage for later synchronization
        localStorage.setItem("post data", JSON.stringify(data));
      });
    });
  } else {
    // Fallback: Save data to localStorage or another storage
    localStorage.setItem("post-data", JSON.stringify(data));
  }
}
