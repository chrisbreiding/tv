const searchLink = (link, showName, episodeNumber) => {
  return link
  .replace(/\[show name]/g, showName)
  .replace(/\[episode]/g, episodeNumber)
}

const pad = (num) => num < 10 ? `0${num}` : `${num}`

export default {
  searchLink,
  pad,
}
