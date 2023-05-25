import React, { useState } from "react";
import Piece from "./Piece";
import { Droppable, Draggable } from "react-beautiful-dnd";

const Workflow = ({ workflow, pieces, buttonclicked, duplicateclicked, rename, pixelfaktor, gettimestring, workflowindex, move }) => {

    const handleTitleChange = (e) => {
        if (!rename(workflow.id, e.target.textContent)) {
            e.target.classList.add("error");
        } else {
            e.target.classList.remove("error");
        }
    };

    const handleDeleteBtnClick = () => {
        buttonclicked(workflow.id);
    };
    const handleDuplicateBtnClick = () => {
        duplicateclicked(workflow.id);
    };
    
    const handleMoveUp = () => {
        console.log(workflow.id)
        move(workflow.id, 1);
    };
    const handleMoveDown = () => {
        console.log(workflow.id)
        move(workflow.id, -1);
    };


    let sum = 0;
    pieces.forEach((element) => {
        sum += parseInt(element.time.split("min")[0]);
    });

    const finalTimeString = gettimestring(sum);

    return (
        //<Draggable id={workflow.id} index={workflowindex}>
        //    {(provided) => (
        <div id={workflow.id} className="workflow-container"
        //{...provided.draggableProps}
        //ref={provided.innerRef}
        >
            <div className="workflow-header">
                <div
                    className="workflow-title"
                    contentEditable={true}
                    onBlur={handleTitleChange}
                    dangerouslySetInnerHTML={{ __html: workflow.id }}
                ></div>
                <button onClick={handleDeleteBtnClick}>-</button>
                <button onClick={handleDuplicateBtnClick}>*</button>
                <div className="summary">{sum / 60} Minuten</div>
                <div className="summary">{finalTimeString} Uhr</div>
                <div className="handle" //{...provided.dragHandleProps}
                >
                    <button onClick={handleMoveDown}>↑</button>
                    <button onClick={handleMoveUp}>↓</button>
                </div>
            </div>
            <Droppable droppableId={workflow.id} direction="horizontal" type="piece">
                {(provided) => (
                    <div
                        className="puzzle-pieces"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {pieces.map((piece, index) => (
                            <Piece
                                key={workflow.id + index}
                                newID={piece.id + "_" + workflow.id + "_" + index}
                                index={index}
                                piece={piece}
                                isSidebar={false}
                                pixelfaktor={pixelfaktor}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}
//</Draggable>

export default Workflow;
