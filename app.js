require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

    // Our routes go here:
    app.get('/', (req, res) =>  {
        console.log("go to the index page")
        res.render('index')
    })



    app.get('/artist-search', (req, res) =>  {
        // console.log(req)
        const artistName = req.query.q
        // const filteredArtist = spotifyApi.filter(music => {
        //     return music.title.toLowerCase().includes(queryString.toLowerCase())
        // })
        spotifyApi.searchArtists(artistName)
        .then(data => {
        //   console.log('The received data from the API: ', data.body.artists.items[0].name, data.body.artists.items[0].images[0]);
        //   ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        let artists = data.body.artists.items;
        console.log(artists)
          res.render('artist-search-result', {listOfArtist : artists})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
    })


 app.get('/albums/:artistId', (req, res) => {
    const id = req.params.artistId

    spotifyApi.getArtistAlbums(id)
       .then((data) =>  {
        const albums = data.body.items;
       console.log('Artist albums', albums);
       res.render('albums', {listOfAlbums : albums})
    },
    function(err) {
      console.error(err);
    }
  );

 })


// Get Elvis' albums
// spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE')
// .then(
//     function(data) {
//       console.log('Artist albums', data.body);
//     },
//     function(err) {
//       console.error(err);
//     }
//   );






app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
