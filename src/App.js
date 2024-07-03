// import logo from './logo.svg';
// import './App.css';
// import { useEffect, useState } from 'react';
// import { getAllPokemonList } from './api/pokemon';

// function App() {
//   const [pokemonData,setPokemonData] = useState([]);

//   useEffect(() => {
//     async function fetchData(){
//       const data = await getAllPokemonList();
//       setPokemonData(data?.results);
//     }
//     fetchData();
//   },[])
//   return (
//     <div style={{marginTop:'40px',justifyContent:'space-around',display:'flex',flexWrap:'wrap', width:'90%', margin:'auto'}}>

//       {pokemonData?.map((poke,i) => {
//         return (
//           <div style={{width: '400px',height:'330px', border:'2px solid #000000', margin:'30px 10px'}}>
//               <div style={{padding:'5px 10px'}}>
//                 <p style={{fontWeight:'bold',textTransform:'capitalize'}}> {poke.name}</p>
//               </div>
//               <img style={{height: '300px', width:'300px'}} alt="pokemon" src={`https://img.pokemondb.net/artwork/large/${poke.name}.jpg`}/>
//           </div>
//         )
//       })}
//       <div>

//       </div>
//     </div>
//   );
// }

// export default App;
// import React, { useEffect } from "react";
// import { postData } from "./apiService";
// import { useNetworkStatus } from "./networkStatus";
// function App() {
//   const isOnline = useNetworkStatus();
//   const postPendingData = async () => {
//     const data = JSON.parse(localStorage.getItem("post-data"));
//     if (data) {
//       await postData(data);
//     } else {
//       await postData({
//         name: "morpheus",
//         job: "leader",
//       });
//     }
//   };
//   useEffect(() => {
//     if (isOnline
//       // && localStorage.getItem('sendDataClicked')
//       ) {
//       postPendingData();
//     }
//   }, [isOnline]);
//   const handleSubmit = async () => {
//     const data = {
//       name: "morpheus",
//       job: "leader",
//     };
//     localStorage.setItem('sendDataClicked',true);
//     await postData(data);
//   };
//   return (
// <div className="App">
//   <header className="App header">
//     <h1>{isOnline ? "Online" : "Offline"}</h1>
//     <button onClick={handleSubmit}>Send Data</button>
//   </header>
// </div>
//   );
// }
// export default App;
import React, { useEffect, useState } from "react";
// import Form from "./components/Form";
import { addRequest } from "./db/db";

const App = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
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
    const data = {
      name: "morpheus",
      job: "leader",
    };
    if (isOnline) {
      await fetch("https://reqres.in/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } else {
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
