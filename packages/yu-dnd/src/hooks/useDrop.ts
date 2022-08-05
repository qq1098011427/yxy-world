import {useContext, useEffect} from "react";
import {DragAndDropContext} from '../context'


const useDrop = (props) => {
    console.log(props, '--useDrop props');
    // 获取最外层store里的数据
    const {DragAndDropManager} = useContext(DragAndDropContext)
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const overElementHeight = e.currentTarget.getBoundingClientRect().height / 2
        const overElementTopOffset = e.currentTarget.getBoundingClientRect().top
        const mousePositionY = e.clientY
        // mousePositionY - overElementTopOffset就是鼠标在元素内部到元素border-top的距离
        const showAfter = mousePositionY - overElementTopOffset > overElementHeight
        if (props.onDragOver) {
            props.onDragOver(e, DragAndDropManager.active, showAfter)
        }
    }
    // drop事件
    const handledDop = (e: React.DragEvent) => {
        e.preventDefault()

        if (props.onDrop) {
            props.onDrop(DragAndDropManager.active)
        }
    }
    // dragLeave事件
    const handledragLeave = (e: React.DragEvent) => {
        e.preventDefault()

        if (props.onDragLeave) {
            props.onDragLeave(DragAndDropManager.active)
        }
    }
    // 注册事件，注意销毁组件时要注销事件，避免内存泄露
    useEffect(() => {
        if (!props.ref) return () => {
        }
        const {
            ref: {current},
        } = props
        if (current) {
            current.addEventListener("dragover", handleDragOver)
            current.addEventListener("drop", handledDop)
            current.addEventListener("dragleave", handledragLeave)
        }
        return () => {
            current.removeEventListener("dragover", handleDragOver)
            current.removeEventListener("drop", handledDop)
            current.removeEventListener("dragleave", handledragLeave)
        }
    }, [props.ref.current])
}

export default useDrop