import type { BackendFactory, DragDropManager } from 'yu-dnd-core'
import { createDragDropManager } from 'yu-dnd-core'
import type { FC, ReactNode } from 'react'
import React, { memo, useEffect } from 'react'

import { DndContext } from './DndContext.js'

export type DndProviderProps<BackendContext, BackendOptions> =
	| {
			children?: ReactNode
			manager: DragDropManager
	  }
	| {
			backend: BackendFactory
			children?: ReactNode
			context?: BackendContext
			options?: BackendOptions
			debugMode?: boolean
	  }

let refCount = 0
// @ts-ignore
const INSTANCE_SYM = Symbol.for('__REACT_DND_CONTEXT_INSTANCE__')

/**
 * 提供React- dnd上下文的React组件
 */
export const DndProvider: FC<DndProviderProps<unknown, unknown>> = memo(
	function DndProvider({ children, ...props }) {
		const [manager, isGlobalInstance] = getDndContextValue(props) // memoized from props
		return <DndContext.Provider value={manager}>{children}</DndContext.Provider>
	},
)
// /**
//  * 如果全局上下文被用于存储DND上下文 如果没有更多的参考，我们应该清理它，以避免内存泄漏
//  */
//
// console.log(useEffect, '----useEffect----')
// useEffect && useEffect(() => {
//     if (isGlobalInstance) {
//         const context = getGlobalContext()
//         ++refCount
//
//         return () => {
//             if (--refCount === 0) {
//                 context[INSTANCE_SYM] = null
//             }
//         }
//     }
//     return
// }, [])
function getDndContextValue(props: DndProviderProps<unknown, unknown>) {
	if ('manager' in props) {
		const manager = { dragDropManager: props.manager }
		return [manager, false]
	}

	const manager = createSingletonDndContext(
		props.backend,
		props.context,
		props.options,
		props.debugMode,
	)
	const isGlobalInstance = !props.context

	return [manager, isGlobalInstance]
}

function createSingletonDndContext<BackendContext, BackendOptions>(
	backend: BackendFactory,
	context: BackendContext = getGlobalContext(),
	options: BackendOptions,
	debugMode?: boolean,
) {
	const ctx = context as any
	if (!ctx[INSTANCE_SYM]) {
        console.log(backend, '---backend--')
		ctx[INSTANCE_SYM] = {
			dragDropManager: createDragDropManager(
				backend,
				context,
				options,
				debugMode,
			),
		}
	}
	return ctx[INSTANCE_SYM]
}

declare const global: any
function getGlobalContext() {
	return typeof global !== 'undefined' ? global : (window as any)
}
