import DragAndDrop from './DragAndDrop'
import DropElement from "./DropElement";
import DragElement from "./DragElement";
import React from 'react'

function App() {
  return (
      <DragAndDrop>
          <DropElement></DropElement>
          <DragElement></DragElement>
          <DropElement></DropElement>
          <div>1</div>
      </DragAndDrop>
  )
}

export default App
