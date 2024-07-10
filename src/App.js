import React, { useEffect, useState } from "react";
import { addRequest } from "./db/db";

const App = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Function to know whether the application is online or offline
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleSubmit = async () => {
    // Dummy data as payload to the post api
    const data = {
      name: "morpheus",
      job: "leader",
    };
    // If online the post api will be triggered
    if (isOnline) {
      await fetch("https://reqres.in/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } else {
      // If the application is offline then the url and the data is stored in indexedDB
      await addRequest({ url: "https://reqres.in/api/users", data });
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        navigator.serviceWorker.ready.then((swRegistration) => {
          return swRegistration.sync.register("sync-requests");
        });
      }
    }
  };

  return (
    <div className="App">
      <header className="App header">
        <h1>{isOnline ? "Online" : "Offline"}</h1>
        <button onClick={handleSubmit}>Send Data</button>
      </header>
    </div>
  );
};

export default App;
