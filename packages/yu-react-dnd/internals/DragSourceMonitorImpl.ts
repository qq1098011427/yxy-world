import { invariant } from 'yu-dnd-core'
import type {
	DragDropManager,
	DragDropMonitor,
	Identifier,
	Listener,
	Unsubscribe,
	XYCoord,
} from 'yu-dnd-core'

import type { DragSourceMonitor } from '../types/index'

let isCallingCanDrag = false
let isCallingIsDragging = false

export class DragSourceMonitorImpl implements DragSourceMonitor {
	private internalMonitor: DragDropMonitor
	private sourceId: Identifier | null = null

	public constructor(manager: DragDropManager) {
		this.internalMonitor = manager.getMonitor()
	}

	public receiveHandlerId(sourceId: Identifier | null): void {
		this.sourceId = sourceId
	}

	public getHandlerId(): Identifier | null {
		return this.sourceId
	}

	public canDrag(): boolean {
		invariant(
			!isCallingCanDrag,
			'你不能在你的canDrag()实现中调用monitor.canDrag()。'
		)

		try {
			isCallingCanDrag = true
			return this.internalMonitor.canDragSource(this.sourceId as Identifier)
		} finally {
			isCallingCanDrag = false
		}
	}

	public isDragging(): boolean {
		if (!this.sourceId) {
			return false
		}
		invariant(
			!isCallingIsDragging,
			'你不能在isdrag()实现中调用monitor. isdrag()。'
		)

		try {
			isCallingIsDragging = true
			return this.internalMonitor.isDraggingSource(this.sourceId)
		} finally {
			isCallingIsDragging = false
		}
	}

	public subscribeToStateChange(
		listener: Listener,
		options?: { handlerIds?: Identifier[] },
	): Unsubscribe {
		return this.internalMonitor.subscribeToStateChange(listener, options)
	}

	public isDraggingSource(sourceId: Identifier): boolean {
		return this.internalMonitor.isDraggingSource(sourceId)
	}

	public isOverTarget(
		targetId: Identifier,
		options?: { shallow: boolean },
	): boolean {
		return this.internalMonitor.isOverTarget(targetId, options)
	}

	public getTargetIds(): Identifier[] {
		return this.internalMonitor.getTargetIds()
	}

	public isSourcePublic(): boolean | null {
		return this.internalMonitor.isSourcePublic()
	}

	public getSourceId(): Identifier | null {
		return this.internalMonitor.getSourceId()
	}

	public subscribeToOffsetChange(listener: Listener): Unsubscribe {
		return this.internalMonitor.subscribeToOffsetChange(listener)
	}

	public canDragSource(sourceId: Identifier): boolean {
		return this.internalMonitor.canDragSource(sourceId)
	}

	public canDropOnTarget(targetId: Identifier): boolean {
		return this.internalMonitor.canDropOnTarget(targetId)
	}

	public getItemType(): Identifier | null {
		return this.internalMonitor.getItemType()
	}

	public getItem(): any {
		return this.internalMonitor.getItem()
	}

	public getDropResult(): any {
		return this.internalMonitor.getDropResult()
	}

	public didDrop(): boolean {
		return this.internalMonitor.didDrop()
	}

	public getInitialClientOffset(): XYCoord | null {
		return this.internalMonitor.getInitialClientOffset()
	}

	public getInitialSourceClientOffset(): XYCoord | null {
		return this.internalMonitor.getInitialSourceClientOffset()
	}

	public getSourceClientOffset(): XYCoord | null {
		return this.internalMonitor.getSourceClientOffset()
	}

	public getClientOffset(): XYCoord | null {
		return this.internalMonitor.getClientOffset()
	}

	public getDifferenceFromInitialOffset(): XYCoord | null {
		return this.internalMonitor.getDifferenceFromInitialOffset()
	}
}
