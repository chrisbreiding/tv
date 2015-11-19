import SwiftyJSON

class EpisodeModel {
    let id: Int
    let title: String
    let airdate: Date
    let season: Int
    let episodeNumber: Int
    var fullEpisodeNumber: String {
        let epNum = episodeNumber < 10 ? "0\(episodeNumber)" : "\(episodeNumber)"
        return "\(season)\(epNum)"
    }

    init(id: Int, title: String, airdate: Date, season: Int, episodeNumber: Int) {
        self.id = id
        self.title = title
        self.airdate = airdate
        self.season = season
        self.episodeNumber = episodeNumber
    }

    class func deserialize(episodes: [JSON]) -> [EpisodeModel] {
        return episodes.map { episode in
            EpisodeModel(
                id: episode["id"].intValue,
                title: episode["title"].stringValue,
                airdate: Date(dateString: episode["airdate"].stringValue),
                season: episode["season"].intValue,
                episodeNumber: episode["episode_number"].intValue
            )
        }
    }

    class func emptyModel() -> EpisodeModel {
        return EpisodeModel(id: 0, title: "", airdate: Date(), season: 1, episodeNumber: 1)
    }
}
