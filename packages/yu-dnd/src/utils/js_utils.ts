// 取交集
export function intersection<T>(itemsA: T[], itemsB: T[]): T[] {
	return itemsA.filter((t) => itemsB.indexOf(t) > -1)
}
// xor([2, 1], [2, 3]) => [1, 3]
export function xor<T extends string | number>(itemsA: T[], itemsB: T[]): T[] {
    const map = new Map<T, number>()
    const insertItem = (item: T) => {
        map.set(item, map.has(item) ? (map.get(item) as number) + 1 : 1)
    }
    itemsA.forEach(insertItem)
    itemsB.forEach(insertItem)
    const result: T[] = []
    map.forEach((count, key) => {
        if (count === 1) {
            result.push(key)
        }
    })
    return result
}
// 简易版的_.get
export function get<T>(obj: any, path: string, defaultValue: T): T {
    return path
        .split('.')
        .reduce((a, c) => (a && a[c] ? a[c] : defaultValue || null), obj) as T
}
// 删除一项
export function without<T>(items: T[], item: T): T[] {
    return items.filter((i) => i !== item)
}