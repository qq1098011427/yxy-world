export type Identifier = string | symbol
export type SourceType = Identifier
export type TargetType = Identifier | Identifier[]
export type Unsubscribe = () => void
export type Listener = () => void
export interface XYCoord {
    x: number
    y: number
}

export interface Action<Payload> {
    type: Identifier
    payload: Payload
}
export enum HandlerRole {
    SOURCE = 'SOURCE',
    TARGET = 'TARGET',
}
export interface SentinelAction {
    type: Identifier
}
export interface BeginDragPayload {
    itemType: Identifier
    item: any
    sourceId: Identifier
    clientOffset: XYCoord | null
    sourceClientOffset: XYCoord | null
    isSourcePublic: boolean
}
export interface HoverPayload {
    targetIds: Identifier[]
    clientOffset: XYCoord | null
}
export interface HoverOptions {
    clientOffset?: XYCoord
}
export interface DropPayload {
    dropResult: any
}
export interface DragDropActions {
    beginDrag(
        sourceIds?: Identifier[],
        options?: any,
    ): Action<BeginDragPayload> | undefined
    publishDragSource(): SentinelAction | undefined
    hover(targetIds: Identifier[], options?: any): Action<HoverPayload>
    drop(options?: any): void
    endDrag(): SentinelAction
}
export interface TargetIdPayload {
    targetId: Identifier
}
export interface SourceIdPayload {
    sourceId: Identifier
}
export interface DragDropManager {
    getMonitor(): DragDropMonitor
    getBackend(): Backend
    getRegistry(): HandlerRegistry
    getActions(): DragDropActions
    dispatch(action: any): void
}

export interface DragDropMonitor {
    subscribeToStateChange(
        listener: Listener,
        options?: {
            handlerIds?: Identifier[]
        },
    ): Unsubscribe
    subscribeToOffsetChange(listener: Listener): Unsubscribe
    canDragSource(sourceId: Identifier | undefined): boolean
    canDropOnTarget(targetId: Identifier | undefined): boolean
    isDragging(): boolean
    isDraggingSource(sourceId: Identifier | undefined): boolean
    isOverTarget(
        targetId: Identifier | undefined,
        options?: {
            shallow?: boolean
        },
    ): boolean
    getItemType(): Identifier | null
    getItem(): any
    getSourceId(): Identifier | null
    getTargetIds(): Identifier[]
    getDropResult(): any
    didDrop(): boolean
    isSourcePublic(): boolean | null
    getInitialClientOffset(): XYCoord | null
    getInitialSourceClientOffset(): XYCoord | null
    // 返回正在进行拖动操作的指针的最后一次记录的{x, y}
    getClientOffset(): XYCoord | null
    // 当前拖动操作已经启动时，与移动的差值
    getSourceClientOffset(): XYCoord | null
    // 返回指针最后一次记录的客户端偏移量和当前客户端偏移量之间的差值{x, y}
    getDifferenceFromInitialOffset(): XYCoord | null
}
export interface Backend {
    setup(): void
    teardown(): void
    connectDragSource(sourceId: any, node?: any, options?: any): Unsubscribe
    connectDragPreview(sourceId: any, node?: any, options?: any): Unsubscribe
    connectDropTarget(targetId: any, node?: any, options?: any): Unsubscribe
    profile(): Record<string, number>
}
export type BackendFactory = (
    manager: DragDropManager,
    globalContext?: any,
    configuration?: any,
) => Backend
export interface BeginDragOptions {
    publishSource?: boolean
    clientOffset?: XYCoord
    getSourceClientOffset?: (sourceId: Identifier | undefined) => XYCoord
}

export interface DragSource {
    beginDrag(monitor: DragDropMonitor, targetId: Identifier): void
    endDrag(monitor: DragDropMonitor, targetId: Identifier): void
    canDrag(monitor: DragDropMonitor, targetId: Identifier): boolean
    isDragging(monitor: DragDropMonitor, targetId: Identifier): boolean
}

export interface DropTarget {
    canDrop(monitor: DragDropMonitor, targetId: Identifier): boolean
    hover(monitor: DragDropMonitor, targetId: Identifier): void
    drop(monitor: DragDropMonitor, targetId: Identifier): any
}

export interface HandlerRegistry {
    addSource(type: SourceType, source: DragSource): Identifier
    addTarget(type: TargetType, target: DropTarget): Identifier
    containsHandler(handler: DragSource | DropTarget): boolean
    getSource(sourceId: Identifier, includePinned?: boolean): DragSource
    getSourceType(sourceId: Identifier): SourceType
    getTargetType(targetId: Identifier): TargetType
    getTarget(targetId: Identifier): DropTarget
    isSourceId(handlerId: Identifier): boolean
    isTargetId(handlerId: Identifier): boolean
    removeSource(sourceId: Identifier): void
    removeTarget(targetId: Identifier): void
    pinSource(sourceId: Identifier): void
    unpinSource(): void
}