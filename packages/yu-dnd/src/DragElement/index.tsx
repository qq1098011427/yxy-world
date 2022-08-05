import React, {useRef} from "react";
import useDrag from "../hooks/useDrag";

const DragElement = (props: any) => {
    const input = useRef(null)
    const hanleDrag = useDrag({
        ref: input,
        collection: {
            info: 'drag给drop传递的信息'
        }, // 这里可以填写任意你想传递给drop元素的消息，后面会通过参数的形式传递给drop元素
    })
    return (
        <div ref={input}>
            <h1 role="button" onClick={hanleDrag}>
                drag元素
            </h1>
        </div>
    )
}
export default DragElement