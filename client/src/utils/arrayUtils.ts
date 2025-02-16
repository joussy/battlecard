export function groupBy<T>(list: T[], keyGetter: (x: T) => unknown): Map<string, T[]> {
    const map = new Map()
    list.forEach((item: T) => {
        const key = keyGetter(item)
        const collection = map.get(key)
        if (!collection) {
            map.set(key, [item])
        } else {
            collection.push(item)
        }
    })
    return map
}
