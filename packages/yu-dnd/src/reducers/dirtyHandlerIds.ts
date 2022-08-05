import {
	BEGIN_DRAG,
	DROP,
	END_DRAG,
	HOVER,
	PUBLISH_DRAG_SOURCE,
} from '../actions/drag_drop'
import {
	ADD_SOURCE,
	ADD_TARGET,
	REMOVE_SOURCE,
	REMOVE_TARGET,
} from '../actions/registry.js'
import type { Action } from '../interfaces.js'
import { ALL, NONE } from '../utils/dirtiness.js'
import { areArraysEqual } from '../utils/equality.js'
import { xor } from '../utils/js_utils.js'

export type State = string[]

export interface DirtyHandlerIdPayload {
	targetIds: string[]
	prevTargetIds: string[]
}

export function reduce(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_state: State = NONE,
	action: Action<DirtyHandlerIdPayload>,
): State {
	switch (action.type) {
		case HOVER:
			break
		case ADD_SOURCE:
		case ADD_TARGET:
		case REMOVE_TARGET:
		case REMOVE_SOURCE:
			return NONE
		case BEGIN_DRAG:
		case PUBLISH_DRAG_SOURCE:
		case END_DRAG:
		case DROP:
		default:
			return ALL
	}

	const { targetIds = [], prevTargetIds = [] } = action.payload
	const result = xor(targetIds, prevTargetIds)
    // 是否改变
	const didChange = result.length > 0 || !areArraysEqual(targetIds, prevTargetIds)

	if (!didChange) {
		return NONE
	}

    // 在最里面的位置检查目标id。如果它们是有效的，添加它们。
	const prevInnermostTargetId = prevTargetIds[prevTargetIds.length - 1]
	const innermostTargetId = targetIds[targetIds.length - 1]
	if (prevInnermostTargetId !== innermostTargetId) {
		if (prevInnermostTargetId) {
			result.push(prevInnermostTargetId)
		}
		if (innermostTargetId) {
			result.push(innermostTargetId)
		}
	}

	return result
}
