const  searchLink = (link, searchName, episodeNumber) => {
  const name = episodeNumber ? `${searchName} ${episodeNumber}` : searchName

  return link
    .replace(/%s/g, name)
    .replace(/\[searchName]/g, name)
}

const pad = (num) => num < 10 ? `0${num}` : `${num}`

export default {
  searchLink,
  pad,
}
