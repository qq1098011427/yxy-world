import type { Identifier, Unsubscribe } from 'yu-dnd-core'

export interface XYCoord {
    x: number
    y: number
}

export interface HandlerManager {
	receiveHandlerId: (handlerId: Identifier | null) => void
	getHandlerId: () => Identifier | null
}

export interface DragSourceMonitor<DragObject = unknown, DropResult = unknown>
	extends HandlerManager,
		MonitorEventEmitter {
	/**
	 * 如果没有正在进行拖动操作，则返回true，并且所有者的canDrag()返回true或未定义.
	 */
	canDrag(): boolean

	/**
	 *  如果拖动操作正在进行，并且是所有者发起了拖动，或者定义了isdrag()并返回true。
	 */
	isDragging(): boolean

	/**
	 * 返回标识当前拖动项类型的字符串或符号。如果没有项目被拖动，则返回null。
	 */
	getItemType(): Identifier | null

	/**
	 * 返回表示当前拖动项的普通对象。每个拖动源必须通过从它的beginDrag()方法返回一个对象来指定它。 如果没有项目被拖动，则返回null
	 */
	getItem<T = DragObject>(): T

	/**
     * 返回一个普通对象，表示最后记录的删除结果
	 * 当从下向上为嵌套目标分派drop()链时，显式地从drop()返回自己的结果的任何父级
     * 重写子进程先前设置的子进程删除结果。如果在endDrag()之外调用，返回null。
	 */
	getDropResult<T = DropResult>(): T | null

	/**
     * 如果某个拖放目标已经处理了拖放事件，则返回true，否则返回false。即使目标没有返回删除结果，didDrop()也会返回true。
     * 在endDrag()中使用它来测试是否有任何拖放目标处理了拖放。如果在endDrag()之外调用，返回false。
	 */
	didDrop(): boolean

	/**
     * 返回指针在当前拖动操作开始时的{x, y}客户端偏移量。如果没有项目被拖动，则返回null。
	 */
	getInitialClientOffset(): XYCoord | null

	/**
     * 返回当前拖动操作开始时，拖动源组件的根DOM节点的{x, y}客户端偏移量。 如果没有项目被拖动，则返回null。
	 */
	getInitialSourceClientOffset(): XYCoord | null

	/**
     * 返回正在进行拖动操作时指针最后记录的{x, y}客户端偏移量。如果没有项目被拖动，则返回null。
	 */
	getClientOffset(): XYCoord | null

	/**
     * 返回指针最后记录的客户端偏移量与当前拖动操作开始时客户端偏移量之间的差值{x, y}。 如果没有项目被拖动，则返回null。
	 */
	getDifferenceFromInitialOffset(): XYCoord | null

	/**
     * 返回拖动源组件根DOM节点投影的{x, y}客户端偏移量，基于当前拖动操作发生时根DOM节点的位置 开始的时候，和动作的区别。如果没有项目被拖动，则返回null
	 */
	getSourceClientOffset(): XYCoord | null

	/**
     * 返回潜在删除目标的id。
	 */
	getTargetIds(): Identifier[]
}

export interface MonitorEventEmitter {
	subscribeToStateChange(
		fn: () => void,
		options?: { handlerIds?: Identifier[] },
	): Unsubscribe
}

export interface DropTargetMonitor<DragObject = unknown, DropResult = unknown>
	extends HandlerManager,
		MonitorEventEmitter {
	canDrop(): boolean

	/**
     * 如果正在进行拖动操作，并且指针当前悬停在所有者上方，则返回true。你可以选择传递{shallow: true}来严格检查是否只有所有者被悬停指向一个嵌套目标。
	 */
	isOver(options?: { shallow?: boolean }): boolean

	getItemType(): Identifier | null

	getItem<T = DragObject>(): T

	getDropResult<T = DropResult>(): T | null

	didDrop(): boolean

	getInitialClientOffset(): XYCoord | null

	getInitialSourceClientOffset(): XYCoord | null

	getClientOffset(): XYCoord | null

	getDifferenceFromInitialOffset(): XYCoord | null

	getSourceClientOffset(): XYCoord | null
}

export interface DragLayerMonitor<DragObject = unknown> {

	isDragging(): boolean

	getItemType(): Identifier | null

	getItem<T = DragObject>(): T

	getInitialClientOffset(): XYCoord | null

	getInitialSourceClientOffset(): XYCoord | null

	getClientOffset(): XYCoord | null

	getDifferenceFromInitialOffset(): XYCoord | null

	getSourceClientOffset(): XYCoord | null

}
