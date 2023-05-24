import React, { useState } from "react";
//import WorkflowPuzzle from "./components/WorkFlowPuzzle";
import initialData from './components/initialData';
import Workflow from './components/Workflow';
import Sidebar from "./components/Sidebar";
import "./style/style.css"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import FileSaver from 'file-saver';

const App = () => {
  const state = initialData;

  const [pieces, setPieces] = useState(state.pieces);
  const [workflows, setWorkflows] = useState(state.workflows);
  const [pixelfaktor, setPixelFaktor] = useState(0.4);
  const [starttime, setStartTime] = useState(new Date(0).setHours(11));

  const getTimeString = (duration) => {
    const finaltimeInMilliseconds = starttime + (duration * 1000);
    const hours = Math.floor(finaltimeInMilliseconds / (60 * 60 * 1000));
    const minutes = Math.floor((finaltimeInMilliseconds % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((finaltimeInMilliseconds % (60 * 1000)) / 1000);

    const finalTimeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return finalTimeString
  }

  const handleDragEnd = (result) => {
    const { destination, source, draggableID } = result;
    if (!destination && source.droppableId === "sidebar_droppable" || source.droppableId === "sidebar_droppable" && destination.droppableId === "sidebar_droppable")
      return;
    if (!destination || destination.droppableId === "sidebar_droppable") {
      const source_workflow = workflows[source.droppableId];
      const source_newPieces = Array.from(source_workflow.pieceIDs);
      source_newPieces.splice(source.index, 1);
      const newWorkflow = { ...source_workflow, pieceIDs: source_newPieces };

      //prevent animation
      setWorkflows({ ...workflows, [source.droppableId]: newWorkflow });
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index)
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

  //WORKFLOW MANAGEMENT

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
    console.log("delete " + workflowId)
    const updatedWorkflows = { ...workflows };
    delete updatedWorkflows[workflowId];
    setWorkflows(updatedWorkflows);
  };

  const duplicateBtnClick = (workflowId) => {
    const newworkflowId = `workflow-${Date.now()}`;
    const workflow = { ...workflows[workflowId], id: newworkflowId };
    const updatedWorkflows = { ...workflows, [newworkflowId]: workflow };
    setWorkflows(updatedWorkflows);
  };

/*   const workflowRename = (workflowId, newName) => {
    if (workflowId === newName)
      return true;
    if (workflows[newName] || !newName)
      return false;
    const workflow = workflows[workflowId];
    const newWorkflow = { ...workflow, id: newName }
    const updatedWorkflows = { ...workflows };
    delete updatedWorkflows[workflowId];
    const newWorkflows = { ...updatedWorkflows, [newName]: newWorkflow };
    setWorkflows(newWorkflows);
    return true;
  } */

  const workflowRename = (workflowId, newName) => {
    if (workflowId === newName) {
      return true;
    }
    
    if (workflows[newName] || !newName) {
      return false;
    }
    
    const workflow = workflows[workflowId];
    const newWorkflow = { ...workflow, id: newName };
  
    const workflowIds = Object.keys(workflows);
    const oldWorkflowIndex = workflowIds.findIndex(id => id === workflowId);
  
    const first_half = workflowIds.slice(0, oldWorkflowIndex);
    const second_half = workflowIds.slice(oldWorkflowIndex + 1);
  
    const newWorkflows = {
      [newName]: newWorkflow
    };
  
    const updatedWorkflows = {
      ...first_half.reduce((obj, id) => {
        obj[id] = workflows[id];
        return obj;
      }, {}),
      ...newWorkflows,
      ...second_half.reduce((obj, id) => {
        obj[id] = workflows[id];
        return obj;
      }, {})
    };
  
    setWorkflows(updatedWorkflows);
    return true;
  };
  

  //FUNKTIONALITÄT

  const saveBtnClick = () => {

    //KONSOLIDIEREN VON ZUSAMMENHÄNGENDEN PAUSENZEITEN -> piece.visible = false
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

  //PIECES KONFIGURATION

  const updatePieces = (id, settings) => {
    const updatedPieces = { ...pieces, [id]: settings };
    setPieces(updatedPieces);
  }

  const addPiece = () => {
    const newPieceId = `p-${Date.now()}`;
    const newPiece = {
      id: newPieceId,
      name: newPieceId,
      image: "1.svg",
      time: "300",
      color: '#ffffff',
      pause: false,
      visible: true,
      additionalText: '',
      additionalDuration: '',
      messages: {},
    };
    const currentPieces = { ...pieces };
    const updatedPieces = { ...currentPieces, [newPieceId]: newPiece };
    setPieces(updatedPieces);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Sidebar pieces={pieces} buttonclicked={addBtnClick} savebuttonclicked={saveBtnClick} upload={upload} updatepieces={updatePieces} addpiece={addPiece} setpixelfaktor={setPixelFaktor} gettimestring={getTimeString} setstarttime={setStartTime} />

          <div className="main-container">
            {Object.keys(workflows).map((columnId, index) => {
              const workflow = workflows[columnId];
              if (!workflow) {
                return (
                  <div className="Empty">Keine Elemente</div>
                ); // or any other fallback component/element
              }
              const workflow_pieces = workflow.pieceIDs.map(pieceID => pieces[pieceID]);
              return (
                <Workflow key={workflow.id} workflow={workflow} pieces={workflow_pieces} buttonclicked={deleteBtnClick} duplicateclicked={duplicateBtnClick} rename={workflowRename} pixelfaktor={pixelfaktor} gettimestring={getTimeString} workflowindex={index}/>
              );
            })}
          </div>
        

    </DragDropContext>
  );
};

export default App;