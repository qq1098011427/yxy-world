//
//  HACK:复制自dnd-core。在这里复制来修复一个CI问题
//
import type { Identifier, SourceType, TargetType } from 'yu-dnd-core'

export function matchesType(
	targetType: TargetType | null,
	draggedItemType: SourceType | null,
): boolean {
	if (draggedItemType === null) {
		return targetType === null
	}
	return Array.isArray(targetType)
		? (targetType as Identifier[]).some((t) => t === draggedItemType)
		: targetType === draggedItemType
}
