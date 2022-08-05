import type { XYCoord } from '../interfaces.js'

export type EqualityCheck<T> = (a: T, b: T) => boolean
export const strictEquality = <T>(a: T, b: T): boolean => a === b

// 确定两个笛卡尔坐标的偏移是否相等
export function areCoordsEqual(
	offsetA: XYCoord | null | undefined,
	offsetB: XYCoord | null | undefined,
): boolean {
	if (!offsetA && !offsetB) {
		return true
	} else if (!offsetA || !offsetB) {
		return false
	} else {
		return offsetA.x === offsetB.x && offsetA.y === offsetB.y
	}
}

// 确定两个项数组是否相等
export function areArraysEqual<T>(
	a: T[],
	b: T[],
	isEqual: EqualityCheck<T> = strictEquality,
): boolean {
	if (a.length !== b.length) {
		return false
	}
	for (let i = 0; i < a.length; ++i) {
		if (!isEqual(a[i] as T, b[i] as T)) {
			return false
		}
	}
	return true
}
