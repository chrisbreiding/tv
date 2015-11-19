import UIKit

class EpisodesViewController : UIViewController, UITableViewDataSource {
    var episodes: [EpisodeModel]?

    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return episodes!.count
    }

    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("EpisodeCell", forIndexPath: indexPath) as! EpisodeCell
        cell.setProps(episodes![indexPath.row])
        return cell
    }
}
