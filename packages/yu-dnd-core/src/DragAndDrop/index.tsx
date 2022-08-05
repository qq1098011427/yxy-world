import React from "react";
import DragDropManagerImpl from '../classes/DragDropManagerImpl'
import {DragAndDropContext} from '../context'

const DragAndDrop = ({ children }: any) => (
    <DragAndDropContext.Provider value={{ DragAndDropManager: new DragDropManagerImpl({} as any,{} as any) }}>
        {children}
    </DragAndDropContext.Provider>
)

export default DragAndDrop