import Foundation

class Date {
    let year: Int
    let month: Int
    let day: Int

    static let dayInSeconds = 86400.0

    init(year: Int, month: Int, day: Int) {
        self.year = year
        self.month = month
        self.day = day
    }

    convenience init() {
        self.init(year: 1970, month: 1, day: 1)
    }

    convenience init(dateString: String) {
        let year = Int(dateString.substring(0, end: 3)) ?? 1970
        let month = Int(dateString.substring(5, end: 6)) ?? 1
        let day = Int(dateString.substring(8, end: 9)) ?? 1

        self.init(year: year, month: month, day: day)
    }

    func description() -> String {
        return "\(year)-\(month)-\(day)"
    }

    class func yesterday() -> Date {
        return dateFromNSDate(NSDate().dateByAddingTimeInterval(-dayInSeconds))
    }

    class func today() -> Date {
        return dateFromNSDate(NSDate())
    }

    class func tomorrow() -> Date {
        return dateFromNSDate(NSDate().dateByAddingTimeInterval(dayInSeconds))
    }

    class func dateFromNSDate(date: NSDate) -> Date {
        let day = NSCalendar
            .currentCalendar()
            .components([NSCalendarUnit.Year, NSCalendarUnit.Month, NSCalendarUnit.Day], fromDate: date)
        return Date(year: day.year, month: day.month, day: day.day)
    }
}

func ==(lhs: Date, rhs: Date) -> Bool {
    return lhs.year == rhs.year && lhs.month == rhs.month && lhs.day == rhs.day
}