import UIKit

class ShowsViewController : UIViewController, UITableViewDataSource, UITableViewDelegate {
    var timePeriods: [TimePeriodModel]?

    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return timePeriods![tableView.tag].shows.count
    }

    func tableView(tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let cell = tableView.dequeueReusableCellWithIdentifier("ShowCell") as! ShowCell
        cell.setProps(timePeriods![tableView.tag].shows[section].name)
        return cell
    }

    func tableView(tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 60.0
    }

    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return timePeriods![tableView.tag].shows[section].episodes.count
    }

    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("EpisodeCell", forIndexPath: indexPath) as! EpisodeCell
        cell.setProps(timePeriods![tableView.tag].shows[indexPath.section].episodes[indexPath.row])
        return cell
    }
}
