import UIKit

class MainViewController: UIViewController {
    @IBOutlet var textView: UITextView!

    override func viewDidAppear(animated: Bool) {
        super.viewDidAppear(animated)

        Data.loadShows({ shows in
            self.textView.text = shows.map({ show in show["display_name"].stringValue }).joinWithSeparator("\n")
        }, onFail: { (errorTitle, errorMessage) in
            self.showErrorAlert(errorTitle, message: errorMessage)
        })
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
