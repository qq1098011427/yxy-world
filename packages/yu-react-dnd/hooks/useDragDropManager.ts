import { invariant } from 'yu-dnd-core'
import type { DragDropManager } from 'yu-dnd-core'
import { useContext } from 'react'

import { DndContext } from '../core/index'

/**
 *  从上下文检索DragDropManager的钩子
 */
export function useDragDropManager(): DragDropManager {
	const { dragDropManager } = useContext(DndContext)
	invariant(dragDropManager != null, '预期的拖放上下文')
	return dragDropManager as DragDropManager
}
