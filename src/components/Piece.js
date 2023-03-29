import React, { useState } from 'react';
import { Draggable } from "react-beautiful-dnd";
import Popup from './Popup';

const Piece = ({ newID, piece, index, isSidebar, updatePieces, pixelfaktor }) => {
  const [showPopup, setShowPopup] = useState(false);
  const pixelWidth = parseInt(piece.time) * pixelfaktor;

  const handleSettingsChange = (event) => {
    const { name, value } = event.target;
    console.log(name + "  " + value);
    updatePieces(piece.id, { ...piece, [name]: value });
  };

  const handleColorChange = (color) => {
    updatePieces(piece.id, { ...piece, color: color });
  };

  const handlePopup = (event) => {
    if (event.target.className === "puzzle sidebar-puzzle") {
      setShowPopup(!showPopup);
    }
  };

  const addMessage = (index) => {
    const updatedMessages = [...piece.messages];
    updatedMessages[index] = { time: '', message: '', sound: '' };
    updatePieces(piece.id, { ...piece, messages: updatedMessages })  
  };

  const delMessage = (index) => {
    const updatedMessages = [...piece.messages];
    delete updatedMessages[index];
    updatePieces(piece.id, { ...piece, messages: updatedMessages })  
  };

  const updateMessage = (index, field, value) => {
    const updatedMessages = [...piece.messages];
    updatedMessages[index][field] = value;
    updatePieces(piece.id, { ...piece, messages: updatedMessages })
  };

  return (
    <>
      <Draggable draggableId={newID} index={index} isDragDisabled={showPopup}>
        {(provided) => (
          <>
            <div
              className='puzzle-container'
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              onClick={handlePopup}
              onBlur={handlePopup}
              id={newID}
            >
              <div className={isSidebar ? 'puzzle sidebar-puzzle' : 'puzzle'} style={{ backgroundColor: piece.color, width: isSidebar ? 'auto' : pixelWidth+"px"}}>
                {isSidebar && piece.time}
                {isSidebar && showPopup && (
                  <Popup onSettingsChange={handleSettingsChange} onColorChange={handleColorChange} onClose={handlePopup} piece={piece} updateMessage={updateMessage} delMessage={delMessage} addMessage={addMessage}></Popup>
                )}
              </div>
            </div>
          </>
        )}
      </Draggable>

    </>
  );
};

export default Piece;
