import DragAndDrop from './DragAndDrop'
import DropElement from "./DropElement";
import DragElement from "./DragElement";

function App() {
  return (
      <DragAndDrop>
          <DropElement></DropElement>
          <DragElement></DragElement>
          <DropElement></DropElement>
      </DragAndDrop>
  )
}

export default App
