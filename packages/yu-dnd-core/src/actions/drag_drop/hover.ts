import { invariant } from '../../utils/invariant'

import type {
	Action,
	DragDropManager,
	DragDropMonitor,
	HandlerRegistry,
	HoverOptions,
	HoverPayload,
	Identifier,
} from '../../interfaces.js'
import { matchesType } from '../../utils/matchesType.js'
import { HOVER } from './types.js'

export function createHover(manager: DragDropManager) {
	return function hover(
		targetIdsArg: string[],
		{ clientOffset }: HoverOptions = {},
	): Action<HoverPayload> {
		verifyTargetIdsIsArray(targetIdsArg)
		const targetIds = targetIdsArg.slice(0)
		const monitor = manager.getMonitor()
		const registry = manager.getRegistry()
		const draggedItemType = monitor.getItemType()
        // 断言
		removeNonMatchingTargetIds(targetIds, registry, draggedItemType)
		checkInvariants(targetIds, monitor, registry)
		hoverAllTargets(targetIds, monitor, registry)

		return {
			type: HOVER,
			payload: {
				targetIds,
				clientOffset: clientOffset || null,
			},
		}
	}
}

function verifyTargetIdsIsArray(targetIdsArg: string[]) {
	invariant(Array.isArray(targetIdsArg), 'Expected targetIds to be an array.')
}

function checkInvariants(
	targetIds: string[],
	monitor: DragDropMonitor,
	registry: HandlerRegistry,
) {
	invariant(monitor.isDragging(), '不拖动时不能调用悬停。')
	invariant(!monitor.didDrop(), '掉落后不能调用悬停')
	for (let i = 0; i < targetIds.length; i++) {
		const targetId = targetIds[i] as string
		invariant(
			targetIds.lastIndexOf(targetId) === i,
			'期望targetid在传递的数组中是唯一的',
		)

		const target = registry.getTarget(targetId)
		invariant(target, '预期targetid将被注册')
	}
}

function removeNonMatchingTargetIds(
	targetIds: string[],
	registry: HandlerRegistry,
	draggedItemType: Identifier | null,
) {
	for (let i = targetIds.length - 1; i >= 0; i--) {
		const targetId = targetIds[i] as string
		const targetType = registry.getTargetType(targetId)
		if (!matchesType(targetType, draggedItemType)) {
			targetIds.splice(i, 1)
		}
	}
}

function hoverAllTargets(
	targetIds: string[],
	monitor: DragDropMonitor,
	registry: HandlerRegistry,
) {
    // 最后在所有匹配目标上调用hover函数
	targetIds.forEach(function (targetId) {
		const target = registry.getTarget(targetId)
		target.hover(monitor, targetId)
	})
}
