import UIKit

class EpisodeCell : UITableViewCell {
    @IBOutlet var episodeNumberBackground: UIView!
    @IBOutlet var episodeNumberLabel: UILabel!
    @IBOutlet var titleLabel: UILabel!

    func setProps(episode: EpisodeModel) {
        episodeNumberBackground.layer.cornerRadius = 5.0

        episodeNumberLabel.text = episode.fullEpisodeNumber
        titleLabel.text = episode.title
    }
}
