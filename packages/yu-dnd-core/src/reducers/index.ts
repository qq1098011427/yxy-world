import {Action} from "../interfaces";
import type { State as StateIdState } from './stateId'
import { reduce as reduceStateId } from "./stateId";
import type { State as RefCountState } from './refCount'
import { reduce as reduceRefCount } from "./refCount";
import type { State as DirtyHandlerIdsState } from './dirtyHandlerIds'
import { reduce as reduceDirtyHandlerIds } from "./dirtyHandlerIds";
import type { State as DragOffsetState } from './dragOffset'
import { reduce as reduceDragOffset } from './dragOffset'
import type { State as DragOperationState } from './dragOperation'
import { reduce as reduceDragOperation } from './dragOperation'
import {get} from "../utils/js_utils";

export interface State {
    stateId: StateIdState
    refCount: RefCountState
    dirtyHandlerIds: DirtyHandlerIdsState
    dragOffset: DragOffsetState
    dragOperation: DragOperationState
}

export const reduce = (state: State = {} as State, action: Action<any>): State => {
    return {
        refCount: reduceRefCount(state.refCount, action),
        stateId: reduceStateId(state.stateId),
        dirtyHandlerIds: reduceDirtyHandlerIds(state.dirtyHandlerIds, {
            type: action.type,
            payload: {
                ...action.payload,
                prevTargetIds: get<string[]>(state, 'dragOperation.targetIds', []),
            }
        }),
        dragOffset: reduceDragOffset(state.dragOffset, action),
        dragOperation: reduceDragOperation(state.dragOperation, action)
    }
}
