import { invariant } from '../../utils/invariant'
import type { AnyAction } from 'redux'
import type {
	Action,
	BeginDragOptions,
	BeginDragPayload,
	DragDropManager,
	DragDropMonitor,
	HandlerRegistry,
	Identifier,
	XYCoord,
} from '../../interfaces.js'
import { BEGIN_DRAG, INIT_COORDS } from './types.js'

export function setClientOffset(
    clientOffset: XYCoord | null | undefined,
    sourceClientOffset?: XYCoord | null | undefined,
): AnyAction {
    return {
        type: INIT_COORDS,
        payload: {
            sourceClientOffset: sourceClientOffset || null,
            clientOffset: clientOffset || null,
        },
    }
}

const ResetCoordinatesAction = {
	type: INIT_COORDS,
	payload: {
		clientOffset: null,
		sourceClientOffset: null,
	},
}

export function createBeginDrag(manager: DragDropManager) {
	return function beginDrag(
		sourceIds: Identifier[] = [],
		options: BeginDragOptions = {
			publishSource: true,
		},
	): Action<BeginDragPayload> | undefined {
		const {
			publishSource = true,
			clientOffset,
			getSourceClientOffset,
		}: BeginDragOptions = options
		const monitor = manager.getMonitor()
		const registry = manager.getRegistry()

		// 初始化偏移
		manager.dispatch(setClientOffset(clientOffset))
        // 断言，不是期望的类型，直接报异常
		verifyInvariants(sourceIds, monitor, registry)
		// 获取拖拽的资源
		const sourceId = getDraggableSource(sourceIds, monitor)
		if (sourceId == null) {
			manager.dispatch(ResetCoordinatesAction)
			return
		}
        // 获取偏移
		let sourceClientOffset: XYCoord | null = null
		if (clientOffset) {
			if (!getSourceClientOffset) {
				throw new Error('getSourceClientOffset must be defined')
			}
			verifyGetSourceClientOffsetIsFunction(getSourceClientOffset)
			sourceClientOffset = getSourceClientOffset(sourceId)
		}

		// 初始化完整的偏移
		manager.dispatch(setClientOffset(clientOffset, sourceClientOffset))

		const source = registry.getSource(sourceId)
		const item = source.beginDrag(monitor, sourceId)
		if (item == null) {
			return undefined
		}
		verifyItemIsObject(item)
		registry.pinSource(sourceId)

		const itemType = registry.getSourceType(sourceId)
		return {
			type: BEGIN_DRAG,
			payload: {
				itemType,
				item,
				sourceId,
				clientOffset: clientOffset || null,
				sourceClientOffset: sourceClientOffset || null,
				isSourcePublic: !!publishSource,
			},
		}
	}
}

function verifyInvariants(
	sourceIds: Identifier[],
	monitor: DragDropMonitor,
	registry: HandlerRegistry,
) {
	invariant(!monitor.isDragging(), 'Cannot call beginDrag while dragging.')
	sourceIds.forEach(function (sourceId) {
		invariant(
			registry.getSource(sourceId),
			'Expected sourceIds to be registered.',
		)
	})
}

function verifyGetSourceClientOffsetIsFunction(getSourceClientOffset: any) {
	invariant(
		typeof getSourceClientOffset === 'function',
		'When clientOffset is provided, getSourceClientOffset must be a function.',
	)
}

function verifyItemIsObject(item: any) {
	invariant(typeof item === 'object', 'Item must be an object.')
}

function getDraggableSource(sourceIds: Identifier[], monitor: DragDropMonitor) {
	let sourceId = null
	for (let i = sourceIds.length - 1; i >= 0; i--) {
		if (monitor.canDragSource(sourceIds[i])) {
			sourceId = sourceIds[i]
			break
		}
	}
	return sourceId
}
