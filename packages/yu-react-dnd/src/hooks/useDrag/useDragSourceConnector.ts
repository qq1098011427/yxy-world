import {useLayoutEffect, useMemo} from 'react'

import { SourceConnector } from '../../internals/index'
import type {
	DragPreviewOptions,
	DragSourceOptions,
} from '../../types/index'
import { useDragDropManager } from '../useDragDropManager'
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect'

export function useDragSourceConnector(
	dragSourceOptions: DragSourceOptions | undefined,
	dragPreviewOptions: DragPreviewOptions | undefined,
): SourceConnector {
	const manager = useDragDropManager()
	const connector = useMemo(
		() => new SourceConnector(manager.getBackend()),
		[manager],
	)
    useLayoutEffect(() => {
		connector.dragSourceOptions = dragSourceOptions || null
		connector.reconnect()
		return () => connector.disconnectDragSource()
	}, [connector, dragSourceOptions])
    useLayoutEffect(() => {
		connector.dragPreviewOptions = dragPreviewOptions || null
		connector.reconnect()
		return () => connector.disconnectDragPreview()
	}, [connector, dragPreviewOptions])
	return connector
}
