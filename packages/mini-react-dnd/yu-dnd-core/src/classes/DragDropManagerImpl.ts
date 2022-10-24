import type {Backend, DragDropActions, DragDropManager, DragDropMonitor, HandlerRegistry} from '../interfaces'
import type {Action, ActionCreator, Store} from "redux";
import type {State} from "../reducers";
import {createDragDropActions} from "../actions/drag_drop";
import DragDropMonitorImpl from "./DragDropMonitorImpl";

interface IDragDropManager<T> {
    setActive(activeProps: HTMLDivElement): void,
    subscribe(callback: () => void): number,
    unsubscribe(id: number): void
}

export default class DragDropManagerImpl implements DragDropManager {
    private store: Store<State>
    private monitor: DragDropMonitor
    private backend: Backend | undefined
    private isSetUp = false
    //
    private active: HTMLDivElement | null
    private subscriptions: Array<any>
    private id: number

    public constructor(store: Store<State>, monitor: DragDropMonitor) {
        this.store = store
        this.monitor = monitor
        store.subscribe(this.handleRefCountChange)
        //
        this.active = null
        this.subscriptions = []
        this.id = -1
    }

    public receiveBackend(backend: Backend): void {
        this.backend = backend
    }

    public getMonitor(): DragDropMonitor {
        return this.monitor
    }

    public getBackend(): Backend {
        return this.backend as Backend
    }

    public getRegistry(): HandlerRegistry {
        return (this.monitor as DragDropMonitorImpl).registry
    }

    public dispatch(action: Action): void {
        this.store.dispatch(action)
    }

    public getActions(): DragDropActions {
        const manager = this

        const bindActionCreator = (actionCreator: ActionCreator<any>) => {
            return (...args: any[]) => {
                const action = actionCreator.apply(manager, args)
                if (action !== undefined) {
                    this.dispatch(action)
                }
            }
        }
        const actions = createDragDropActions(this)
        return Object.keys(actions).reduce((
            boundActions: DragDropActions, key: string
        ) => {
            const action: ActionCreator<any> = (actions as any)[key] as ActionCreator<any>;
            (boundActions as any)[key] = bindActionCreator(action)
            return boundActions
        }, {} as DragDropActions)
    }

    private handleRefCountChange = (): void => {
        const shouldSetUp = this.store.getState().refCount > 0
        if (this.backend) {
            if (shouldSetUp && !this.isSetUp) {
                this.backend.setup()
                this.isSetUp = true
            } else if (!shouldSetUp && this.isSetUp) {
                this.backend.teardown()
                this.isSetUp = false
            }
        }
    }

    public setActive(activeProps: HTMLDivElement) {
        this.active = activeProps
        this.subscriptions.forEach((subscription) => subscription.callback())
    }

    public subscribe(callback: () => void): number {
        this.id += 1
        this.subscriptions.push({
            callback,
            id: this.id,
        })

        return this.id
    }

    public unsubscribe(id: number) {
        this.subscriptions = this.subscriptions.filter((sub) => sub.id !== id)
    }

}
