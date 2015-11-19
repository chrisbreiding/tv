class TimePeriodModel {
    let name: String
    var shows: [ShowModel]

    init(name: String, shows: [ShowModel]) {
        self.name = name
        self.shows = shows
    }
}