import UIKit

class ShowCell : UITableViewCell {
    @IBOutlet var nameLabel: UILabel!
//    @IBOutlet

    func setProps(name: String) {
        nameLabel.text = name
    }
}