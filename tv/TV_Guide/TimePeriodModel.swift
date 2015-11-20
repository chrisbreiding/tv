import SwiftyJSON

class TimePeriodModel {
    let name: String
    var shows: [ShowModel]

    init(name: String, shows: [ShowModel]) {
        self.name = name
        self.shows = shows
    }

    class func periods(shows: [ShowModel]) -> [TimePeriodModel] {
        return [
            TimePeriodModel(name: "Aired Yesterday", shows: ShowModel.shows(shows, forDate: Date.yesterday())),
            TimePeriodModel(name: "Airing Tonight", shows: ShowModel.shows(shows, forDate: Date.today())),
            TimePeriodModel(name: "Airing Tomorrow", shows: ShowModel.shows(shows, forDate: Date.tomorrow()))
        ]
    }

    class func deserialize(timePeriods: [JSON]) -> [TimePeriodModel] {
        return timePeriods.map { timePeriod in
            TimePeriodModel(
                name: timePeriod["name"].stringValue,
                shows: ShowModel.deserialize(timePeriod["shows"].arrayValue)
            )
        }
    }

    class func serialize(timePeriods: [TimePeriodModel]) -> [AnyObject] {
        return timePeriods.map { timePeriod in
            [
                "name": timePeriod.name,
                "shows": ShowModel.serialize(timePeriod.shows)
            ]
        }
    }
}