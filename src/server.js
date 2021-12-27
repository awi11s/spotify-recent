const express = require('express')
const axios = require('axios')
const qs = require('qs')
const dotenv = require('dotenv')

const app = express();
dotenv.config()

const serverPort = process.env.SERVER_PORT;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT;
const devClientUrl = process.env.DEV_CLIENT_URL;

// for xss purposes
const generateRandomString = len => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}


app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    res.cookie('spotify_auth_state', state)

    const scope = 'user-read-private user-read-email user-top-read';

    const queryParams = qs.stringify({
        client_id: clientId,
        response_type: 'code',
        redirect_uri: redirect_uri,
        state: state,
        scope: scope,
    })

    res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`)
});

app.get('/callback', (req, res) => {
    const code = req.query.code || null;

    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: qs.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirect_uri
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        }
    })
    .then(response => {
        if (response.status === 200) {
            const { 
                access_token, 
                refresh_token,
                expires_in
             } = response.data;
            
            const queryParams = qs.stringify({
                access_token,
                refresh_token,
                expires_in
            });

            res.redirect(`${devClientUrl}/?${queryParams}`)
            // axios.get('https://api.spotify.com/v1/me', {
            //     headers: {
            //         Authorization: `${token_type} ${access_token}`
            //     }
            // }).then(response => {
            //     res.send(`<pre> ${JSON.stringify(response.data, null, 2)}</pre>`);
            // }).catch(error => {
            //     res.send(error)
            // })

        } else {
            // res.send(response)
            res.redirect(`/?${qs.stringify({ error: 'invalid_token' })}`);
        }
    }).catch(err => {
        res.send(err)
        console.log('error at callback')
    })

})

app.get('/refresh_token', (req, res) => {
    const { refresh_token } = req.query;

    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: qs.stringify({
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
        }
    }).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log('error at refresh')
        res.send(error)
    })
})
app.listen(serverPort, () => console.log(`listening on PORT: ${serverPort}`))

