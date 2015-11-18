import UIKit

class TimePeriodCell : UICollectionViewCell {
    @IBOutlet var nameLabel: UILabel!
    @IBOutlet var showsView: UITableView!

    func setProps(name: String) {
        nameLabel.text = name
    }

    func setShowsViewDataSource(dataSource: UITableViewDataSource, forRow row: Int) {
        showsView.dataSource = dataSource
        showsView.tag = row
        showsView.reloadData()
    }
}