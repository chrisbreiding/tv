import UIKit

class MainViewController: UIViewController, UICollectionViewDataSource, UICollectionViewDelegate {
    @IBOutlet var timePeriodsView: UICollectionView!
    @IBOutlet var loadingIndicator: UIActivityIndicatorView!

    var showsViewController: ShowsViewController = ShowsViewController()

    let timePeriods = [
        TimePeriodModel(name: "Aired Yesterday", shows: []),
        TimePeriodModel(name: "Airing Tonight", shows: []),
        TimePeriodModel(name: "Airing Tomorrow", shows: [])
    ]

    override func viewDidLoad() {
        super.viewDidLoad()

        showsViewController.timePeriods = timePeriods
    }

    override func viewDidAppear(animated: Bool) {
        super.viewDidAppear(animated)

        Data().loadShows({ shows in
            self.loadingIndicator.stopAnimating()
            self.timePeriods[0].shows = Data.shows(shows, forDate: Date.yesterday())
            self.timePeriods[1].shows = Data.shows(shows, forDate: Date.today())
            self.timePeriods[2].shows = Data.shows(shows, forDate: Date.tomorrow())
            self.timePeriodsView.hidden = false
            self.timePeriodsView.reloadData()
//            self.con
//            self.airedYesterdayView.text = shows.map { show in
//                let episodes = show.episodes.map { episode in episode.title }.joinWithSeparator("\n")
//                return "\(show.name)\n\(episodes)"
//            }.joinWithSeparator("\n\n")
        }, onFail: { (errorTitle, errorMessage) in
            self.loadingIndicator.stopAnimating()
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

    func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return timePeriods.count
    }

    func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCellWithReuseIdentifier("TimePeriodCell", forIndexPath: indexPath) as! TimePeriodCell
        cell.setProps(timePeriods[indexPath.row].name)
        return cell
    }

    func collectionView(collectionView: UICollectionView, willDisplayCell cell: UICollectionViewCell, forItemAtIndexPath indexPath: NSIndexPath) {
        guard let timePeriodCell = cell as? TimePeriodCell else { return }
        timePeriodCell.setShowsViewDataSource(showsViewController, delegate: showsViewController, forRow: indexPath.row)
    }
}
