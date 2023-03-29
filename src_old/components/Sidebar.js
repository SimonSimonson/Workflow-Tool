import React, { useState } from "react";
import Piece from "./Piece";
import { Droppable } from "react-beautiful-dnd";

const Sidebar = ({ pieces, buttonclicked, savebuttonclicked, upload, addpiece }) => {
    const updatePieces = (id, settings) => {
        const updatedPieces = {...pieces, [id]: settings };
        console.log(updatedPieces);
        //changepieces(updatedPieces);
    }
    return (
        <div className={'sidebar-portal'}>
            <Droppable droppableId={"sidebar_droppable"} direction='horizontal'>
                {provided => (
                    <div className="puzzle-pieces sidebar-piece" ref={provided.innerRef} {...provided.droppableProps}>
                        {Object.keys(pieces).map((key, index) =>
                            <Piece key={"sb" + index} newID={pieces[key].id + "_sb"} index={index} piece={pieces[key]} isSidebar={true} updatePieces={updatePieces}/>
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <button onClick={addpiece} className="add-piece">+</button>

            <button onClick={buttonclicked} className="leftbutton">+</button>
            <button onClick={savebuttonclicked} className="sidebar-button">↓</button>
            <input type="file" accept=".txt" onChange={upload} />

        </div>
    );
};

export default Sidebar;