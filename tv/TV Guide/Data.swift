import Alamofire
import SwiftyJSON

class Data {
    class func loadShows(onLoad: ([JSON] -> ()), onFail: ((String, String) -> ())) {
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
                    onLoad(JSON(data: data)["shows"].arrayValue)
                }
        }
    }

    class func loadApiKey(onFail: ((String, String) -> ())) -> String? {
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