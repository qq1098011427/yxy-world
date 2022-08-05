import type { Store } from 'redux'
import { createStore } from 'redux'

import DragDropManagerImpl from './classes/DragDropManagerImpl'
import type {DragDropManager, BackendFactory} from "./interfaces";
import type {State} from "./reducers";
import {reduce} from "./reducers";

export const createDragDropManager = (
    backendFactory: BackendFactory,
    globalContext: unknown = undefined,
    backendOptions: unknown = {},
    debugMode: boolean = false,
): DragDropManager => {
    const store = makeStoreInstance(debugMode)
    const monitor = {}
    const manager = new DragDropManagerImpl(store, monitor)
    const backend = backendFactory(manager, globalContext, backendOptions)
    manager.receiveBackend(backend)
    return manager
}

const makeStoreInstance = (debugMode: boolean): Store<State> => {
    const reduxDevTools = typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION__
    return createStore(reduce, debugMode && reduxDevTools({name: 'dnd-core', instanceId: 'dnd-core'}))
}