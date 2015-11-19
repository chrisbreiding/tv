import UIKit

class ShowCell : UITableViewCell {
    @IBOutlet var nameLabel: UILabel!

    func setProps(name: String) {
        nameLabel.text = name
    }
}
