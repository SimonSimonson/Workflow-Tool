import React, { useState } from 'react';
import { Draggable } from "react-beautiful-dnd";
import Popup from './Popup';

const Piece = ({ newID, piece, index, isSidebar, updatePieces }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleSettingsChange = (event) => {
    const { name, value } = event.target;
    updatePieces(piece.id, { ...piece, [name]: value });
  };

  const handleColorChange = (color) => {
    updatePieces(piece.id, { ...piece, color: color });
  };

  const handlePopupOpen = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  return (
    <>
      <Draggable draggableId={newID} index={index}>
        {(provided) => (
          <div
            className='workflow-container puzzle'
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={handlePopupOpen}
            style={{ backgroundColor: piece.color }}          >
            {piece.time}
            
          </div>
        )}
      </Draggable>

    </>
  );
};

export default Piece;
