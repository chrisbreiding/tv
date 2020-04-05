import * as firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/firestore'

firebase.initializeApp({
  apiKey: 'AIzaSyDuMwHcTs8LSz6CIQSRVBeYvpodYPCx0xI',
  authDomain: 'tv-data-b2214.firebaseapp.com',
  projectId: 'tv-data-b2214',
})

const db = firebase.firestore()

const getShows = () => {
  return db.collection('shows').get()
  .then((showsQuerySnapshot) => {
    const getShows = []

    showsQuerySnapshot.forEach((showDoc) => {
      if (!showDoc.exists) return

      const show = Object.assign(showDoc.data(), {
        id: showDoc.id,
        episodes: [],
      })

      const getEpisodes = db.collection('shows').doc(showDoc.id).collection('episodes').get()
      .then((episodesQuerySnapshot) => {
        episodesQuerySnapshot.forEach((episodeDoc) => {
          if (!episodeDoc.exists) return

          const episode = Object.assign(episodeDoc.data(), {
            id: episodeDoc.id,
          })

          show.episodes.push(episode)
        })

        return show
      })

      getShows.push(getEpisodes)
    })

    return Promise.all(getShows)
  })
}

getShows()

export default {
  getShows,
}
