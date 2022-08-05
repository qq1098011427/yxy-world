import { invariant } from '../../utils/invariant'

import type {
	Action,
	DragDropManager,
	DragDropMonitor,
	DropPayload,
	HandlerRegistry,
	Identifier,
} from '../../interfaces.js'
import { DROP } from './types.js'

export function createDrop(manager: DragDropManager) {
	return function drop(options = {}): void {
		const monitor = manager.getMonitor()
		const registry = manager.getRegistry()
		verifyInvariants(monitor)
		const targetIds = getDroppableTargets(monitor)

        // 这里调度了多个动作，这就是为什么它不返回一个动作
		targetIds.forEach((targetId, index) => {
			const dropResult = determineDropResult(targetId, index, registry, monitor)
			const action: Action<DropPayload> = {
				type: DROP,
				payload: {
					dropResult: {
						...options,
						...dropResult,
					},
				},
			}
			manager.dispatch(action)
		})
	}
}

function verifyInvariants(monitor: DragDropMonitor) {
	invariant(monitor.isDragging(), '没有拖动时不能调用删除')
	invariant(
		!monitor.didDrop(),
		'在一次拖动操作中不能调用两次删除',
	)
}

function determineDropResult(
	targetId: Identifier,
	index: number,
	registry: HandlerRegistry,
	monitor: DragDropMonitor,
) {
	const target = registry.getTarget(targetId)
	let dropResult = target ? target.drop(monitor, targetId) : undefined
	verifyDropResultType(dropResult)
	if (typeof dropResult === 'undefined') {
		dropResult = index === 0 ? {} : monitor.getDropResult()
	}
	return dropResult
}

function verifyDropResultType(dropResult: any) {
	invariant(
		typeof dropResult === 'undefined' ||  (typeof dropResult === 'object'),
		'Drop result must either be an object or undefined.',
	)
}

// 获取所有可放置的目标，并倒序
function getDroppableTargets(monitor: DragDropMonitor) {
	const targetIds = monitor
		.getTargetIds()
		.filter(monitor.canDropOnTarget, monitor)
	targetIds.reverse()
	return targetIds
}
