export type State = number

export const reduce = (state: State = 0): State => {
	return state + 1
}
