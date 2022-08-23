import { invariant } from 'yu-dnd-core'
import type { ReactElement } from 'react'
import { cloneElement, isValidElement } from 'react'

function throwIfCompositeComponentElement(element: ReactElement<any>) {
	if (typeof element.type === 'string') {
		return
	}

	const displayName =
		(element.type as any).displayName || (element.type as any).name || 'the component'

	throw new Error(
		`现在只有本地元素节点可以被传递给 DnD 连接器, 您可以将${displayName} 包装成 <div>, 或者把它变成拖动源或拖放目标本身`
	)
}

function wrapHookToRecognizeElement(hook: (node: any, options: any) => void) {
	return (elementOrNode = null, options = null) => {
        // 当传入一个节点时，直接调用该钩子。
		if (!isValidElement(elementOrNode)) {
			const node = elementOrNode
			hook(node, options)
			// 返回节点，这样它就可以被链接(例如，当在回调引用中
			// <div ref={node => connectDragSource(connectDropTarget(node))}/>
			return node
		}

		// 如果传入一个ReactElement，克隆它并将此函数作为引用附加。
        // 这有助于我们实现一个整洁的API，用户甚至不知道引用正在被使用
		const element: ReactElement | null = elementOrNode
		throwIfCompositeComponentElement(element as any)

		// When no options are passed, use the hook directly
		const ref = options ? (node: Element) => hook(node, options) : hook
		return cloneWithRef(element, ref)
	}
}

export function wrapConnectorHooks(hooks: any) {
	const wrappedHooks: any = {}

	Object.keys(hooks).forEach((key: any) => {
		const hook = hooks[key]

        // ref对象应该直接传递而不需要换行
		if (key.endsWith('Ref')) {
			wrappedHooks[key] = hooks[key]
		} else {
			const wrappedHook = wrapHookToRecognizeElement(hook)
			wrappedHooks[key] = () => wrappedHook
		}
	})

	return wrappedHooks
}

function setRef(ref: any, node: any) {
	if (typeof ref === 'function') {
		ref(node)
	} else {
		ref.current = node
	}
}

function cloneWithRef(element: any, newRef: any): ReactElement<any> {
	const previousRef = element.ref
	invariant(
		typeof previousRef !== 'string',
		'无法将DnD连接到具有现有字符串引用的元素请将其转换为使用回调引用，或将其包装为 <span> or <div>. '
	)

	if (!previousRef) {
		// 当元素上没有引用时，直接使用新的引用
		return cloneElement(element, {
			ref: newRef,
		})
	} else {
		return cloneElement(element, {
			ref: (node: any) => {
				setRef(previousRef, node)
				setRef(newRef, node)
			},
		})
	}
}
