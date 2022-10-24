import { useEffect, useLayoutEffect } from 'react'

// 在服务器端取消useLayoutEffect警告。
export const useIsomorphicLayoutEffect =
	typeof window !== 'undefined' ? useLayoutEffect : useEffect
