import type { XYCoord } from '../interfaces.js'
import type { State } from '../reducers/dragOffset.js'

export function add(a: XYCoord, b: XYCoord): XYCoord {
	return {
		x: a.x + b.x,
		y: a.y + b.y,
	}
}

export function subtract(a: XYCoord, b: XYCoord): XYCoord {
	return {
		x: a.x - b.x,
		y: a.y - b.y,
	}
}

// 计算拖动源的偏移
export function getSourceClientOffset(state: State): XYCoord | null {
	const { clientOffset, initialClientOffset, initialSourceClientOffset } = state
	if (!clientOffset || !initialClientOffset || !initialSourceClientOffset) {
		return null
	}
	return subtract(
		add(clientOffset, initialSourceClientOffset),
		initialClientOffset,
	)
}

// 计算客户端偏移量的差值
export function getDifferenceFromInitialOffset(state: State): XYCoord | null {
	const { clientOffset, initialClientOffset } = state
	if (!clientOffset || !initialClientOffset) {
		return null
	}
	return subtract(clientOffset, initialClientOffset)
}
