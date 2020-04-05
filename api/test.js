const { searchShows } = require('./functions/lib/shows')
const { getEpisodesForShow } = require('./functions/lib/episodes')


// searchShows('Silicon Valley') // => 277165
// searchShows('Archer') // => 110381
// searchShows('Great British Bake Off') // => 184871
// searchShows('South Park') // => 75897
// .then(console.log.bind(console))

getEpisodesForShow(75897)
.then((episodes) => {
  console.log(`${episodes.length} episodes`)
})
