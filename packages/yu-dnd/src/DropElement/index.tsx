import React, {MutableRefObject, useRef} from "react";
import useDrop from "../hooks/useDrop";

const DropElement = (props: any) => {
    const input: MutableRefObject<null>|any = useRef(null)
    useDrop({
        ref: input,
        // showAfter是表示，是否鼠标拖拽元素时，鼠标经过drop元素的上方（上方就是上半边，下方就是下半边）
        onDragOver: (e: React.DragEvent<HTMLDivElement>, collection, showAfter) => {
            // console.log(collection, '--collection--');
            // 如果经过上半边，drop元素的上边框就是红色
            if (!showAfter) {
                input.current.style = "border-bottom: none;border-top: 1px solid red"
            } else {
                // 如果经过下半边，drop元素的上边框就是红色
                input.current.style = "border-top: none;border-bottom: 1px solid red"
            }
        },
        // 如果在drop元素上放开鼠标，则样式清空
        onDrop: () => {
            input.current.style = ""
        },
        // 如果在离开drop元素，则样式清空
        onDragLeave: () => {
            input.current.style = ""
        },
    })
    return (
        <div>
            <h1 ref={input}>drop元素</h1>
        </div>
    )
}
export default DropElement