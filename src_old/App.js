import React, { useState } from "react";
//import WorkflowPuzzle from "./components/WorkFlowPuzzle";
import initialData from './components/initialData';
import Workflow from './components/Workflow';
import Sidebar from "./components/Sidebar";
import "./style/style.css"
import { DragDropContext } from "react-beautiful-dnd";
import FileSaver from 'file-saver';

const App = () => {
  const state = initialData;

  const [pieces, setPieces] = useState(state.pieces);

  //ein workflow speicher für jeden workflow
  const [workflows, setWorkflows] = useState(state.workflows);

  const handleDragEnd = (result) => {
    const { destination, source, draggableID } = result;
    console.log("DRAG")
    if (!destination && source.droppableId === "sidebar_droppable")
      return;
    if (!destination){
      const source_workflow = workflows[source.droppableId];
      const source_newPieces = Array.from(source_workflow.pieceIDs);
      source_newPieces.splice(source.index, 1);
      const newWorkflow = { ...source_workflow, pieceIDs: source_newPieces };
    
      setWorkflows({ ...workflows, [source.droppableId]: newWorkflow });
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index)
      return;
    if (destination.droppableId === "sidebar_droppable")
      return;

    //hänge draggable an die richtige Stelle in destination
    const dest_workflow = workflows[destination.droppableId];
    const dest_newPieces = Array.from(dest_workflow.pieceIDs);
    if (destination.droppableId === source.droppableId) {
      dest_newPieces.splice(source.index, 1);
    }
    dest_newPieces.splice(destination.index, 0, result.draggableId.split("_")[0]);
    const newDestWorkflow = { ...dest_workflow, pieceIDs: dest_newPieces };
    var updatedWorkflows = { ...workflows, [destination.droppableId]: newDestWorkflow };

    //wenn Source -> Sidebar nichts löschen, sonst aus altem Workflow entfernen
    if (source.droppableId !== "sidebar_droppable" && destination.droppableId !== source.droppableId) {
      //aus source Workflow löschen
      const source_workflow = workflows[source.droppableId];
      const source_newPieces = Array.from(source_workflow.pieceIDs);
      source_newPieces.splice(source.index, 1);

      const newSourceWorkflow = { ...source_workflow, pieceIDs: source_newPieces };
      updatedWorkflows = { ...updatedWorkflows, [source.droppableId]: newSourceWorkflow };
    }
    
    setWorkflows(updatedWorkflows);
  };

  const addBtnClick = () => {
    const workflowId = `workflow-${Date.now()}`;
    const pieceIds = [];
    const newWorkflow = {
      id: workflowId,
      pieceIDs: pieceIds,
      timestamp: Date.now() // add a timestamp
    };
    const oldWorkflow = { ...workflows };
    const updatedWorkflows = { ...oldWorkflow, [workflowId]: newWorkflow };
    setWorkflows(updatedWorkflows);
    //console.log(workflows);
  }

  const deleteBtnClick = (workflowId) => {
    const updatedWorkflows = { ...workflows };
    delete updatedWorkflows[workflowId];
    setWorkflows(updatedWorkflows);
  };

  const saveBtnClick = () => {
    const newData = {
      pieces: state.pieces,
      workflows: workflows,
      workflowOrder: Object.keys(workflows),
    };

    const blob = new Blob([JSON.stringify(newData)], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(blob, "export.txt");
  }

  const upload = async event => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = event => {
      const fileContent = event.target.result;
      try {
        const jsonContent = JSON.parse(fileContent);
        setWorkflows(jsonContent.workflows);
      } catch (error) {
        console.error(error);
      }
    };
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Sidebar pieces={pieces} buttonclicked={addBtnClick} savebuttonclicked={saveBtnClick} upload={upload}/>

      {Object.keys(workflows).map(columnId => {
        const workflow = workflows[columnId];
        if (!workflow) {
          return (
            <div className="Empty">Keine Elemente</div>
          ); // or any other fallback component/element
        }
        const workflow_pieces = workflow.pieceIDs.map(pieceID => pieces[pieceID]);
        return (
          <Workflow key={workflow.id} workflow={workflow} pieces={workflow_pieces} buttonclicked={deleteBtnClick} />
        );
      })}
    </DragDropContext>
  );
};

export default App;
