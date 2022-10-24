import { DndProvider } from 'yu-react-dnd'
import { HTML5Backend } from 'yu-dnd-html5-backend'
import Container from './Container'
import React from 'react'
import ReactDOM from 'react-dom/client'
//
console.log(HTML5Backend, '--HTML5Backend--');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <div className="App">
            <DndProvider backend={HTML5Backend}>
                <Container />
            </DndProvider>
        </div>
    </React.StrictMode>
)
