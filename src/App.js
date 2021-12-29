import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

import { accessToken, logout } from "./spotify";
import Results from "./components/Results";

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
          <h1 className="font-asap text-3xl text-center text-green-800 font-bold p-4 drop-shadow-lg">TOP 10 IN PAST MONTH:</h1>
          <h2 className="font-asap text-2xl text-green-300 ">{name}</h2>
          <div className="p-4">
            <button 
              className="bg-green-300 hover:bg-green-500 hover:scale-110 text-white font-asap p-3 rounded-full m-1 drop-shadow-lg"
              onClick={getArtists}>get artists</button>
            <button 
              className="bg-green-300 hover:bg-green-500 hover:scale-110 text-white font-asap p-3 rounded-full m-1 drop-shadow-lg"
              onClick={getTracks}>get tracks</button>
            <button 
              className="bg-green-300 hover:bg-green-500 hover:scale-110 text-white font-asap p-3 rounded-full m-1 drop-shadow-lg"
              onClick={logout}>log out</button>
          </div>
          <Results results={results} />
        </>
      )}
    </div>
  );
}

export default App;
