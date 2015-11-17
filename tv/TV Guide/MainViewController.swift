import UIKit
import Alamofire
import SwiftyJSON

class MainViewController: UIViewController {
    @IBOutlet var textView: UITextView!

    override func viewDidAppear(animated: Bool) {
        super.viewDidAppear(animated)

        loadShows { shows in
            self.textView.text = shows.map({ show in show["display_name"].stringValue }).joinWithSeparator("\n")
        }

    }

    func loadShows(onLoad: ([JSON] -> ())) {
        guard let apiKey = loadApiKey() else { return }

        Alamofire
            .request(.GET, "http://tvapi.crbapps.com/shows", headers: [ "api_key": apiKey ])
            .response { request, response, data, error in
                let statusCode = Int((response?.statusCode)!)
                if statusCode != 200 && statusCode != 304 {
                    self.showErrorAlert("Error retrieving data", message: "Failed loading shows. Status code was \(statusCode).")
                }
            }
            .responseData { response in
                if let data = response.result.value {
                    onLoad(JSON(data: data)["shows"].arrayValue)
                }
        }
    }

    func loadApiKey() -> String? {
        var apiKey: String?
        if let path = NSBundle.mainBundle().pathForResource("secrets", ofType: "txt") {
            do {
                apiKey = try String(contentsOfFile: path, encoding: NSUTF8StringEncoding)
            } catch {
                showErrorAlert("Error retrieving API Key", message: "Could not load contents of secrets file")
            }
        } else {
            showErrorAlert("Error retrieving API Key", message: "Could not load secrets file")
        }

        return apiKey
    }

    func showErrorAlert(title: String, message: String) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .Alert)
        let action = UIAlertAction(title: "OK", style: .Default, handler: { _ in
            alert.removeFromParentViewController()
        })
        alert.addAction(action)
        self.presentViewController(alert, animated: true, completion: nil)
    }
}
