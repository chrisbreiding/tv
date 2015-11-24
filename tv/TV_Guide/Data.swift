import Foundation
import Alamofire
import SwiftyJSON

let localStorage = NSUserDefaults.standardUserDefaults()
let DATA_KEY = "dataKey"

class Data {
    func load(onLoad: ([TimePeriodModel] -> ()), onFail: ((String, String) -> ())) {
        if let timePeriods = loadFromLocalStorage() {
            onLoad(timePeriods)
            return
        }

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
                    let timePeriods = self.deserializeFromNetwork(data)
                    self.saveToLocalStorage(timePeriods)
                    onLoad(timePeriods)
                }
        }
    }

    func load(onLoad: ([TimePeriodModel] -> ())) {
        return load(onLoad, onFail: { _,_ in })
    }

    func loadFromLocalStorage() -> [TimePeriodModel]? {
        if let data = localStorage.stringForKey(DATA_KEY)?.dataUsingEncoding(NSUTF8StringEncoding) {
            let json = JSON(data: data)
            if notTodaysData(json) { return nil }
            
            return deserialize(json)
        }
        return nil
    }

    func deserializeFromNetwork(jsonData: NSData) -> [TimePeriodModel] {
        let json = JSON(data: jsonData)
        let shows = ShowModel.deserializeAndJoin(json["shows"].arrayValue, episodes: json["episodes"].arrayValue)
        return TimePeriodModel.periods(shows)
    }

    func deserialize(json: JSON) -> [TimePeriodModel] {
        return TimePeriodModel.deserialize(json["timePeriods"].arrayValue)
    }

    func notTodaysData(json: JSON) -> Bool {
        let date = Date(dateString: json["date"].stringValue)
        return date != Date.today()
    }

    func saveToLocalStorage(timePeriods: [TimePeriodModel]) {
        localStorage.setObject(serialize(timePeriods), forKey: DATA_KEY)
    }

    func serialize(timePeriods: [TimePeriodModel]) -> String {
        let json: JSON = [
            "timePeriods": TimePeriodModel.serialize(timePeriods),
            "date": Date.today().serialize()
        ]
        return json.rawString() ?? ""
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