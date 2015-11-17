import UIKit
import Alamofire
import SwiftyJSON

class MainViewController: UIViewController {
    @IBOutlet var textView: UITextView!

    override func viewDidLoad() {
        super.viewDidLoad()


        var apiKey: String = ""
        if let path = NSBundle.mainBundle().pathForResource("secrets", ofType: "txt") {
            do {
                apiKey = try String(contentsOfFile: path, encoding: NSUTF8StringEncoding)
            } catch {}
        }

        let headers = [
            "api_key": apiKey
        ]

        Alamofire
            .request(.GET, "http://tvapi.crbapps.com/shows", headers: headers)
            .responseData { response in
                if let data = response.result.value {
                    let json = JSON(data: data)
                    let shows = json["shows"].arrayValue
                    self.textView.text = shows.map({ show in show["display_name"].stringValue }).joinWithSeparator("\n")
            }
        }
    }
}
