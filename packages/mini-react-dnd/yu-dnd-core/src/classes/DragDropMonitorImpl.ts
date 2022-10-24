import {DragDropMonitor, HandlerRegistry, Identifier, Listener, Unsubscribe, XYCoord} from '../interfaces'
import {Store} from "redux";
import {State} from "../reducers";
import {invariant} from "../utils/invariant";
import { areDirty } from '../utils/dirtiness';
import {matchesType} from "../utils/matchesType";
import {getDifferenceFromInitialOffset, getSourceClientOffset } from '../utils/coords';

export default class DragDropMonitorImpl implements DragDropMonitor {
    private store: Store<State>
    public readonly registry: HandlerRegistry

    public constructor(store: Store<State>, registry: HandlerRegistry) {
        this.store = store
        this.registry = registry
    }

    // reduce 订阅监听state变化的方法
    public subscribeToStateChange(
        listener: Listener,
        options: { handlerIds?: string[] } = {}
        ): Unsubscribe {
        const {handlerIds} = options
        invariant(typeof listener === 'function', 'listener must be a function.')
        invariant(typeof handlerIds === 'undefined' || Array.isArray(handlerIds), 'handlerIds 必须是字符串数组')
        let prevStateId = this.store.getState().stateId
        const handleChange = () => {
            const state = this.store.getState()
            const currentStateId = state.stateId
            try {
                const canSkipListener = (currentStateId === prevStateId) ||
                    (currentStateId === prevStateId + 1) &&
                    !areDirty(state.dirtyHandlerIds, handlerIds)

                !canSkipListener && listener()
            } finally {
                prevStateId = currentStateId
            }
        }
        return this.store.subscribe(handleChange)
    }

    // reduce 订阅监听offset变化的方法
    public subscribeToOffsetChange(listener: Listener): Unsubscribe {
        invariant(typeof listener === 'function', 'listener must be a function.')
        let previousState = this.store.getState().dragOffset
        const handleChange = () => {
            const nextState = this.store.getState().dragOffset
            if (nextState === previousState) {
                return
            }
            previousState = nextState
            listener()
        }
        return this.store.subscribe(handleChange)
    }

    // 资源能否被拖拽
    public canDragSource(sourceId: string | undefined): boolean {
        if (!sourceId) return false
        const source = this.registry.getSource(sourceId)
        invariant(source, `Expected to find a valid source. sourceId=${sourceId}`)
        if (this.isDragging()) return false
        return source.canDrag(this, sourceId)
    }
    // 目标能否被放置
    public canDropOnTarget(targetId: string | undefined): boolean {
        if (!targetId) return false
        const target = this.registry.getTarget(targetId)
        invariant(target, `Expected to find a valid target. targetId=${targetId}`)
        if (!this.isDragging() || this.didDrop()) return false
        // 放置目标的类型 与 当前类型比对
        const targetType = this.registry.getTargetType(targetId)
        const draggedItemType = this.getItemType()
        return (matchesType(targetType, draggedItemType) && target.canDrop(this, targetId))
    }
    // 是否是可被拖拽的资源
    public isDraggingSource(sourceId: string | undefined): boolean {
        if (!sourceId) return false
        const source = this.registry.getSource(sourceId, true)
        invariant(source, `Expected to find a valid source. sourceId=${sourceId}`)
        if (!this.isDragging() || !this.isSourcePublic()) {return false}
        const sourceType = this.registry.getSourceType(sourceId)
        const draggedItemType = this.getItemType()
        if (sourceType !== draggedItemType) return false
        return source.isDragging(this, sourceId)
    }
    // 是否在目标上
    public isOverTarget(
        targetId: string | undefined,
        options = { shallow: false }, // 深浅比对
    ): boolean {
        if (!targetId) return false
        const { shallow } = options
        if (!this.isDragging()) return false
        const targetType = this.registry.getTargetType(targetId)
        const draggedItemType = this.getItemType()
        if (draggedItemType && !matchesType(targetType, draggedItemType)) return false
        const targetIds = this.getTargetIds()
        if (!targetIds.length) return false
        // end 判空
        const index = targetIds.indexOf(targetId)
        return shallow ? index === targetIds.length - 1 : index > -1
    }

    public isDragging(): boolean {
        return Boolean(this.getItemType())
    }

    public getItemType(): Identifier {
        return this.store.getState().dragOperation.itemType as Identifier
    }

    public getItem(): any {
        return this.store.getState().dragOperation.item
    }

    public getSourceId(): string | null {
        return this.store.getState().dragOperation.sourceId
    }

    public getTargetIds(): string[] {
        return this.store.getState().dragOperation.targetIds
    }

    public getDropResult(): any {
        return this.store.getState().dragOperation.dropResult
    }

    public didDrop(): boolean {
        return this.store.getState().dragOperation.didDrop
    }

    public isSourcePublic(): boolean {
        return Boolean(this.store.getState().dragOperation.isSourcePublic)
    }

    public getInitialClientOffset(): XYCoord | null {
        return this.store.getState().dragOffset.initialClientOffset
    }

    public getInitialSourceClientOffset(): XYCoord | null {
        return this.store.getState().dragOffset.initialSourceClientOffset
    }

    public getClientOffset(): XYCoord | null {
        return this.store.getState().dragOffset.clientOffset
    }

    public getSourceClientOffset(): XYCoord | null {
        return getSourceClientOffset(this.store.getState().dragOffset)
    }

    public getDifferenceFromInitialOffset(): XYCoord | null {
        return getDifferenceFromInitialOffset(this.store.getState().dragOffset)
    }
}