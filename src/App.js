import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

import { accessToken, logout } from "./spotify";

async function getSelf(tok) {
  const self = await axios.get("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${tok}`,
    },
  });

  return self.data;
}

function App() {
  const [token, setToken] = useState(null);
  const [name, setName] = useState(null);
  const [results, setResults] = useState([])


  useEffect(() => {
    // on component mount get user display name, and set access token to state
    async function getName() {
      if (accessToken) {
        const display = await getSelf(accessToken);
        setName(display.display_name);
      }
    }

    getName();
    setToken(accessToken);

  }, [token]);


  async function getArtists() {
    try {
      const res = await axios.get(`https://api.spotify.com/v1/me/top/artists?limit=10&time_range=short_term`, {
        headers: {
            Authorization: `Bearer ${token}`
          }
      })

      console.log(res.data)
      setResults(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function getTracks() {
    try {
      const res = await axios.get(`https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term`, {
        headers: {
            Authorization: `Bearer ${token}`
          }
      })

      setResults(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="App">
      {!name ? (
        <a href="http://localhost:8080/login">login to spotify</a>
      ) : (
        <>
          <h1 className="font-asap text-3xl font-bold">hello {name} u are logged in</h1>
          <div className="buttons-div">
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-asap py-2 px-4 rounded-full"
              onClick={getArtists}>get artists</button>
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-asap py-2 px-4 rounded-full"
              onClick={getTracks}>get tracks</button>
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-asap py-2 px-4 rounded-full"
              onClick={logout}>log out</button>
          </div>
          <div className="w-3/4 space-y-6">
            {results.items ?
              results.items.map((item, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${item.images[0].url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    height: "300px",
                    backgroundPosition: "center"
                  }}
                  className="p-6 rounded-xl shadow-xl flex items-center justify-center">
                  <p 
                    key={item.name}
                    className="font-asap text-3xl text-cyan-400"
                    >{item.name}</p>
                </div>
              )) :
              <h1>click to get results</h1>
            }
          </div>
        </>
      )}
    </div>
  );
}

export default App;
