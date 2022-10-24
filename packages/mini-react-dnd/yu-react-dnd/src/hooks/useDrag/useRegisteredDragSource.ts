import type { SourceConnector } from '../../internals/index'
import { registerSource } from '../../internals/index'
import type { DragSourceMonitor } from '../../types/index'
import type { DragSourceHookSpec } from '../types'
import { useDragDropManager } from '../useDragDropManager'
import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect'
import { useDragSource } from './useDragSource'
import { useDragType } from './useDragType'
import {useLayoutEffect} from "react";

export function useRegisteredDragSource<O, R, P>(
	spec: DragSourceHookSpec<O, R, P>,
	monitor: DragSourceMonitor<O, R>,
	connector: SourceConnector,
): void {
	const manager = useDragDropManager()
	const handler = useDragSource(spec, monitor, connector)
	const itemType = useDragType(spec)

    useLayoutEffect(
		function registerDragSource() {
			if (itemType != null) {
				const [handlerId, unregister] = registerSource(
					itemType,
					handler,
					manager,
				)
				monitor.receiveHandlerId(handlerId)
				connector.receiveHandlerId(handlerId)
				return unregister
			}
			return
		},
		[manager, monitor, connector, handler, itemType],
	)
}
