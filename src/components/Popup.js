import React, { useState } from 'react';
import ReactColorPicker from '@super-effective/react-color-picker';

const Popup = ({ onSettingsChange, onColorChange,updateMessage, delMessage, addMessage, piece }) => {
  console.log(piece.messages);
  return (
    <div className='popup-container'>
      <div className='popup'>
        <div className='popup-header'>
          <h2>Einstellungen</h2>
        </div>
        <div className='popup-body'>
          <label htmlFor='name'>Name:</label>
          <input type='text' name='name' value={piece.name} onChange={onSettingsChange} />
          <label htmlFor='duration'>Duration:</label>
          <input type='text' name='duration' value={piece.time} onChange={onSettingsChange} />
          <label htmlFor='color'>Color:</label>
          <ReactColorPicker className={"color-picker"} onChange={onColorChange} />
          <label htmlFor='pause'>Pause:</label>
          <div className='popup-radio'>
            <label htmlFor='pause-yes'>
              <input type='radio' id='pause-yes' name='pause' value='true' checked={piece.pause === true} onChange={onSettingsChange} />
              Yes
            </label>
            <label htmlFor='pause-no'>
              <input type='radio' id='pause-no' name='pause' value='false' checked={piece.pause === false} onChange={onSettingsChange} />
              No
            </label>
          </div>
          <label htmlFor='additionalText'>Additional Text:</label>
          <textarea name='additionalText' value={piece.additionalText} onChange={onSettingsChange} />
          <h3>Messages:</h3>
          {Object.values(piece.messages).map((message, index) => (
            <div key={index} className="message bordered" onDoubleClick={() => delMessage(index)}>
              <label htmlFor={`message-time-${index}`}>Time:</label>
              <input
                id={`message-time-${index}`}
                type='text'
                value={message.time}
                onChange={(e) => updateMessage(index, 'time', e.target.value)}
              />
              <label htmlFor={`message-message-${index}`}>Message:</label>
              <input
                id={`message-message-${index}`}
                type='text'
                value={message.message}
                onChange={(e) => updateMessage(index, 'message', e.target.value)}
              />
              <label htmlFor={`message-sound-${index}`}>Sound:</label>
              <input
                id={`message-sound-${index}`}
                type='text'
                value={message.sound}
                onChange={(e) => updateMessage(index, 'sound', e.target.value)}
              />
            </div>
          ))}
          <button onClick={addMessage}>Add Message</button>
          
        </div>
      </div>
    </div>
  );
};

export default Popup;
