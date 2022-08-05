// 类型断言提示
export function invariant(condition: any, format: string, ...args: any[]) {
    console.log(condition, 'condition', format, 'format', args, 'args');
    if (isProduction()) {
		if (format === undefined) {
			throw new Error('invariant requires an error message argument')
		}
	}

	if (!condition) {
		let error
		if (format === undefined) {
			error = new Error(
				'Minified exception occurred; use the non-minified dev environment ' +
					'for the full error message and additional helpful warnings.',
			)
		} else {
			let argIndex = 0
			error = new Error(
				format.replace(/%s/g, function () {
					return args[argIndex++]
				}),
			)
			error.name = 'Invariant Violation'
		}

		;(error as any).framesToPop = 1 // we don't care about invariant's own frame
		throw error
	}
}

function isProduction() {
	return (
        // @ts-ignore
		typeof process !== 'undefined' && process.env['NODE_ENV'] === 'production'
	)
}
