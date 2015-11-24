import Foundation
import TVServices

class ServiceProvider: NSObject, TVTopShelfProvider {
    let topShelfStyle: TVTopShelfContentStyle = .Sectioned

    var topShelfItems: [TVContentItem] {
        var items: [TVContentItem] = []
        let semaphore = dispatch_semaphore_create(0)

        Data().load { timePeriods in
            items = timePeriods
                        .filter { timePeriod in timePeriod.shows.count > 0 }
                        .map(self.timePeriod)
            dispatch_semaphore_signal(semaphore)
        }

        dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER)

        return items
    }

    override init() {
        super.init()
    }

    func timePeriod(timePeriod: TimePeriodModel) -> TVContentItem {
        guard let contentIdentifier = TVContentIdentifier(identifier: timePeriod.name, container: nil) else { fatalError("Error creating content identifier for section.") }
        guard let section = TVContentItem(contentIdentifier: contentIdentifier) else { fatalError("Error creating section.") }

        section.title = timePeriod.name
        section.topShelfItems = timePeriod.shows.map(self.show)
        return section
    }

    func show(show: ShowModel) -> TVContentItem {
        guard let contentIdentifier = TVContentIdentifier(identifier: show.name, container: nil) else { fatalError("Error creating content identifier for show.") }
        guard let item = TVContentItem(contentIdentifier: contentIdentifier) else { fatalError("Error creating show item.") }

        item.title = show.name
        item.imageURL = NSURL(string: show.poster)
        item.imageShape = .Poster
        return item
    }
}