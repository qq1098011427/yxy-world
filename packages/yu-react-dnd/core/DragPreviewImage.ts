import type { FC } from 'react'
import { memo, useEffect } from 'react'

import type { ConnectDragPreview } from '../types/index.js'

export interface DragPreviewImageProps {
	connect: ConnectDragPreview
	src: string
}
/**
 * 一个用于呈现拖动预览图像的实用程序
 */
export const DragPreviewImage: FC<DragPreviewImageProps> = memo(
	function DragPreviewImage({ connect, src }) {
		useEffect(() => {
			if (typeof Image === 'undefined') return

			let connected = false
			const img = new Image()
			img.src = src
			img.onload = () => {
				connect(img)
				connected = true
			}
			return () => {
				if (connected) {
					connect(null)
				}
			}
		})

		return null
	},
)
