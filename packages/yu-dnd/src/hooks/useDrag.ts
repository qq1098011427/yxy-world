import {useContext, useEffect} from "react";
import {DragAndDropContext} from '../context'


const useDrag = (props) => {
    const {DragAndDropManager} = useContext(DragAndDropContext)

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        DragAndDropManager.setActive(props.collection)
        console.log(e.dataTransfer, '----e.dataTransfer---');
        if (e.dataTransfer !== undefined) {
            e.dataTransfer.effectAllowed = "move"
            e.dataTransfer.dropEffect = "move"
            e.dataTransfer.setData("text/plain", "drag") // firefox fix
        }
        if (props.onDragStart) {
            props.onDragStart(DragAndDropManager.active)
        }
    }

    useEffect(() => {
        if (!props.ref) return () => {}
        const { ref: {current} } = props
        if (current) {
            current.setAttribute("draggable", true)
            current.addEventListener("dragstart", handleDragStart)
        }
        return () => {
            current.removeEventListener("dragstart", handleDragStart)
        }
    }, [props.ref.current])

    return handleDragStart
}

export default useDrag