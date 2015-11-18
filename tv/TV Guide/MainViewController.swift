import UIKit

class MainViewController: UIViewController, UICollectionViewDataSource, UICollectionViewDelegate, UITableViewDataSource {
    @IBOutlet var timePeriodsView: UICollectionView!
    @IBOutlet var loadingIndicator: UIActivityIndicatorView!

    let timePeriods = [
        TimePeriodModel(name: "Aired Yesterday", shows: []),
        TimePeriodModel(name: "Airing Tonight", shows: []),
        TimePeriodModel(name: "Airing Tomorrow", shows: [])
    ]

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
        timePeriodCell.setShowsViewDataSource(self, forRow: indexPath.row)
    }

    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return timePeriods[tableView.tag].shows.count
    }

    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("ShowCell", forIndexPath: indexPath) as! ShowCell
        cell.setProps(timePeriods[tableView.tag].shows[indexPath.row].name)
        return cell
    }
}
