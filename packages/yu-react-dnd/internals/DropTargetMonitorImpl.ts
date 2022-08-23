import { invariant } from 'yu-dnd-core'
import type {
	DragDropManager,
	DragDropMonitor,
	Identifier,
	Listener,
	Unsubscribe,
	XYCoord,
} from 'yu-dnd-core'

import type { DropTargetMonitor } from '../types/index.js'

let isCallingCanDrop = false

export class DropTargetMonitorImpl implements DropTargetMonitor {
	private internalMonitor: DragDropMonitor
	private targetId: Identifier | null = null

	public constructor(manager: DragDropManager) {
		this.internalMonitor = manager.getMonitor()
	}

	public receiveHandlerId(targetId: Identifier | null): void {
		this.targetId = targetId
	}

	public getHandlerId(): Identifier | null {
		return this.targetId
	}

	public subscribeToStateChange(
		listener: Listener,
		options?: { handlerIds?: Identifier[] },
	): Unsubscribe {
		return this.internalMonitor.subscribeToStateChange(listener, options)
	}

	public canDrop(): boolean {
        //如果目标id没有被设置，那么尽早退出。这应该可以防止错误
		if (!this.targetId) {
			return false
		}
		invariant(
			!isCallingCanDrop,
			'你不能在你的canDrop()实现中调用monitor.canDrop()。'
		)

		try {
			isCallingCanDrop = true
			return this.internalMonitor.canDropOnTarget(this.targetId)
		} finally {
			isCallingCanDrop = false
		}
	}

	public isOver(options?: { shallow?: boolean }): boolean {
		if (!this.targetId) {
			return false
		}
		return this.internalMonitor.isOverTarget(this.targetId, options)
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
