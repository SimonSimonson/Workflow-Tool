import React from 'react';
import ReactColorPicker from '@super-effective/react-color-picker';

const Popup = ({ onSettingsChange, onColorChange, onClose, piece }) => {
  return (
    <div className='popup-container'>
      <div className='popup'>
        <div className='popup-header'>
          <h2>Einstellungen</h2>
          <button className='popup-close' onClick={onClose}>X</button>
        </div>
        <div className='popup-body'>
          <label htmlFor='name'>Name:</label>
          <input type='text' name='name' value={piece.name} onChange={onSettingsChange} />
          <label htmlFor='duration'>Duration:</label>
          <input type='text' name='duration' value={piece.time} onChange={onSettingsChange} />
          <label htmlFor='color'>Color:</label>
          <ReactColorPicker onChange={onColorChange} />
          <label htmlFor='additionalText'>Additional Text:</label>
          <textarea name='additionalText' value={piece.additionalText} onChange={onSettingsChange} />
          <label htmlFor='additionalDuration'>Additional Duration:</label>
          <input type='text' name='additionalDuration' value={piece.additionalDuration} onChange={onSettingsChange} />
        </div>
      </div>
    </div>
  );
};

export default Popup;
