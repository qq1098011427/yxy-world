import { invariant } from '../../utils/invariant'

import type {
	DragDropManager,
	DragDropMonitor,
	SentinelAction,
} from '../../interfaces.js'
import { END_DRAG } from './types.js'

export function createEndDrag(manager: DragDropManager) {
	return function endDrag(): SentinelAction {
		const monitor = manager.getMonitor()
		const registry = manager.getRegistry()
		verifyIsDragging(monitor)

		const sourceId = monitor.getSourceId()
		if (sourceId != null) {
			const source = registry.getSource(sourceId, true)
			source.endDrag(monitor, sourceId)
			registry.unpinSource()
		}
		return { type: END_DRAG }
	}
}

function verifyIsDragging(monitor: DragDropMonitor) {
	invariant(monitor.isDragging(), '不能在没有拖动时调用endDrag。')
}
