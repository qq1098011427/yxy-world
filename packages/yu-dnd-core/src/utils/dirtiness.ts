import { intersection } from './js_utils'

export const NONE: string[] = []
export const ALL: string[] = []
;(NONE as any).__IS_NONE__ = true
;(ALL as any).__IS_ALL__ = true

/**
 * 确定给定的处理程序id是否脏。
 * @param dirtyIds dirtyIds脏处理器id的集合
 * @param handlerIds 要检查的处理程序id的集合
 */
export function areDirty(
	dirtyIds: string[],
	handlerIds: string[] | undefined,
): boolean {
	if (dirtyIds === NONE) {
		return false
	}

	if (dirtyIds === ALL || typeof handlerIds === 'undefined') {
		return true
	}

	const commonIds = intersection(handlerIds, dirtyIds)
	return commonIds.length > 0
}
