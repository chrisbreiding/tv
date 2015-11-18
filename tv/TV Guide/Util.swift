import Foundation

extension Array {

    func indexBy<PropType>(getProp: (Element) -> PropType) -> [PropType: Element] {
        return self.reduce([PropType: Element]()) { (var coll, element) in
            let key = getProp(element)
            coll[key] = element
            return coll
        }
    }

}

extension String {
    func substring(start: Int, end: Int) -> String {
        let range = Range<String.Index>(start: self.startIndex.advancedBy(start), end: self.startIndex.advancedBy(end + 1))
        return self.substringWithRange(range)

    }
}