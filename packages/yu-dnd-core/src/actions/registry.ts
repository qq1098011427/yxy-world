import type { Action, SourceIdPayload, TargetIdPayload } from '../interfaces.js'

export const ADD_SOURCE = 'ADD_SOURCE'
export const ADD_TARGET = 'ADD_TARGET'
export const REMOVE_SOURCE = 'REMOVE_SOURCE'
export const REMOVE_TARGET = 'REMOVE_TARGET'

export const addSource = (sourceId: string): Action<SourceIdPayload> => {
    return {
        type: ADD_SOURCE,
        payload: {
            sourceId
        }
    }
}

export const addTarget = (targetId: string): Action<TargetIdPayload> => {
    return {
        type: ADD_TARGET,
        payload: {
            targetId
        }
    }
}

export const removeSource = (sourceId: string): Action<SourceIdPayload> => {
    return {
        type: REMOVE_SOURCE,
        payload: {
            sourceId
        }
    }
}

export const removeTarget = (targetId: string): Action<TargetIdPayload> => {
    return {
        type: REMOVE_TARGET,
        payload: {
            targetId
        }
    }
}
