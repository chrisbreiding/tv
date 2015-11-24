import SwiftyJSON

class ShowModel {
    let name: String
    let poster: String
    let episodes: [EpisodeModel]

    init(name: String, poster: String, episodes: [EpisodeModel]) {
        self.name = name
        self.poster = poster
        self.episodes = episodes
    }

    class func deserializeAndJoin(shows: [JSON], episodes: [JSON]) -> [ShowModel] {
        let episodeModels = EpisodeModel.deserialize(episodes).indexBy { $0.id }

        return shows.map { show in
            ShowModel(
                name: show["display_name"].stringValue,
                poster: show["poster"].stringValue,
                episodes: show["episode_ids"].arrayValue.map { episodeId in
                    episodeModels[episodeId.intValue] ?? EpisodeModel.emptyModel()
                }
            )
        }
    }

    class func shows(shows: [ShowModel], forDate date: Date) -> [ShowModel] {
        return shows.reduce([ShowModel]()) { (var coll, show) in
            let airedOnDate = show.episodes.filter { episode in episode.airdate == date }
            if airedOnDate.count > 0 {
                coll.append(ShowModel(name: show.name, poster: show.poster, episodes: airedOnDate))
            }
            return coll
        }
    }

    class func deserialize(shows: [JSON]) -> [ShowModel] {
        return shows.map { show in
            ShowModel(
                name: show["name"].stringValue,
                poster: show["poster"].stringValue,
                episodes: EpisodeModel.deserialize(show["episodes"].arrayValue)
            )
        }
    }

    class func serialize(shows: [ShowModel]) -> [AnyObject] {
        return shows.map { show in
            [
                "name": show.name,
                "poster": show.poster,
                "episodes": EpisodeModel.serialize(show.episodes)
            ]
        }
    }
}
