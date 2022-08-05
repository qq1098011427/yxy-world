import React from "react";
import DragDropManagerImpl from '../classes/DragDropManagerImpl'
import {DragAndDropContext} from '../context'

const DragAndDrop = ({ children }) => (
    <DragAndDropContext.Provider value={{ DragAndDropManager: new DragDropManagerImpl() }}>
        {children}
    </DragAndDropContext.Provider>
)

export default DragAndDrop