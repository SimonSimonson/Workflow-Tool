import React, { useState } from "react";
import Piece from "./Piece";
import { Droppable } from "react-beautiful-dnd";


const Workflow = ({ workflow, pieces, buttonclicked }) => {
    const handleDeleteBtnClick = () => {
        buttonclicked(workflow.id);
      };
    let sum = 0; 
    pieces.forEach(element => {
        sum += parseInt(element.time.split("min")[0]);
    });
    return (
        <div className="workflow-container">
            <div className="workflow-header">
                <h2>{workflow.id}</h2>
                <button onClick={handleDeleteBtnClick}>-</button>
                <div className="summary">{sum} Minuten</div>
            </div>
            <Droppable droppableId={workflow.id} direction='horizontal'>
                {provided => (
                    <div className="puzzle-pieces" ref={provided.innerRef} {...provided.droppableProps}>
                        {pieces.map((piece, index) =>
                            <Piece key={workflow.id+index} newID={piece.id+"_"+workflow.id+"_"+index} index={index} piece={piece} isSidebar={false}/>)}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default Workflow;