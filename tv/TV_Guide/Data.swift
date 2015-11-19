import Foundation
import Alamofire
import SwiftyJSON


class Data {
    func loadShows(onLoad: ([ShowModel] -> ()), onFail: ((String, String) -> ())) {
        guard let apiKey = loadApiKey(onFail) else { return }

        Alamofire
            .request(.GET, "http://tvapi.crbapps.com/shows", headers: [ "api_key": apiKey ])
            .response { request, response, data, error in
                let statusCode = Int((response?.statusCode)!)
                if statusCode != 200 && statusCode != 304 {
                    onFail("Error retrieving data", "Failed loading shows. Status code was \(statusCode).")
                }
            }
            .responseData { response in
                if let data = response.result.value {
                    let json = JSON(data: data)
                    onLoad(self.showModels(json["shows"].arrayValue, episodes: json["episodes"].arrayValue))
                }
        }
    }

    class func shows(shows: [ShowModel], forDate date: Date) -> [ShowModel] {
        return shows.reduce([ShowModel]()) { (var coll, show) in
            let airedOnDate = show.episodes.filter { episode in episode.airdate == date }
            if airedOnDate.count > 0 {
                coll.append(ShowModel(name: show.name, episodes: airedOnDate))
            }
            return coll
        }
    }

    func showModels(shows: [JSON], episodes: [JSON]) -> [ShowModel] {
        let episodeModels = EpisodeModel.deserialize(episodes).indexBy { $0.id }

        return shows.map { show in
            ShowModel(
                name: show["display_name"].stringValue,
                episodes: show["episode_ids"].arrayValue.map { episodeId in
                    episodeModels[episodeId.intValue] ?? EpisodeModel.emptyModel()
                }
            )
        }
    }

    func loadApiKey(onFail: ((String, String) -> ())) -> String? {
        var apiKey: String?
        if let path = NSBundle.mainBundle().pathForResource("secrets", ofType: "txt") {
            do {
                apiKey = try String(contentsOfFile: path, encoding: NSUTF8StringEncoding)
            } catch {
                onFail("Error retrieving API Key", "Could not load contents of secrets file")
            }
        } else {
            onFail("Error retrieving API Key", "Could not load secrets file")
        }

        return apiKey
    }
}