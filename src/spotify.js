import axios from "axios";

const LOCALSTORAGE_KEYS = {
    accessToken: "spotify_access_token",
    refreshToken: "spotify_refresh_token",
    expireTime: "spotify_token_expire_time",
    timestamp: "spotify_token_timestamp",
};

const LOCALSTORAGE_VALUES = {
    accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
    refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
    expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
    timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
};

function getAccessToken() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get("access_token"),
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get("refresh_token"),
    [LOCALSTORAGE_KEYS.expireTime]: urlParams.get("expires_in"),
  };

  const hasError = urlParams.get('error');

  // refresh if token has expired
  if (hasError || hasTokenExpired() || LOCALSTORAGE_VALUES.accessToken === 'undefined' ) {
      refreshToken();
  }

  // use access token if found in local storage
  if (LOCALSTORAGE_VALUES.accessToken && LOCALSTORAGE_VALUES.accessToken !== 'undefined') {
      return LOCALSTORAGE_VALUES.accessToken;
  }

  // token found in URL query if user is logging in for first time
  if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
      // storing token to localStorage from url
      for (let property in queryParams) {
        window.localStorage.setItem(property, queryParams[property])
    }

    // set timestamp in localStorage
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now())

    // return access token from query params
    return queryParams[LOCALSTORAGE_KEYS.accessToken]
  }

  // function should not get here
  return false;

};
function hasTokenExpired() {
    const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;
    if (!accessToken || !timestamp) {
        return false;
    }

    const msElapsed = Date.now() - Number(timestamp);
    return (msElapsed / 1000) > Number(expireTime)
}

async function refreshToken() {
    try {
        if (!LOCALSTORAGE_VALUES.refreshToken ||
            LOCALSTORAGE_VALUES.refreshToken === 'undefined' ||
            (Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000) < 1000
            ) {
                console.error('no refresh token available');
                logout();
            }

        const { data } = await axios.get(`/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`)

        // update localStorage values
        window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.access_token)
        window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now())

        // reload page for localstorage updates
        window.location.reload();
    } catch(err) {
        console.log(err)
    }
}

export function logout() {
    // clear all localstorage items
    for (let property in LOCALSTORAGE_KEYS) {
        window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
    }

    // navigate to homepage
    window.location = window.location.origin
}

export const accessToken = getAccessToken();


//   const queryString = window.location.search;
//   const urlParams = new URLSearchParams(queryString);
//   const accessToken = urlParams.get('access_token');
//   const refreshToken = urlParams.get('refresh_token');

//   if (refreshToken) {
//     fetch(`/refresh_token?refresh_token=${refreshToken}`)
//       .then(res => res.json())
//       .then(data => console.log(data))
//       .catch(err => console.log(err));
//   }
