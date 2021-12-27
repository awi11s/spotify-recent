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
          <h1>hello {name} u are logged in</h1>
          <div className="buttons-div">
            <button onClick={getArtists}>get artists</button>
            <button onClick={getTracks}>get tracks</button>
            <button onClick={logout}>log out</button>
          </div>
          <div>
            {results.items ?
              results.items.map((item, idx) => (
                <div key={idx} className="card">
                  <p key={item.name}>{item.name}</p>
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
