import React, { useState } from "react";
import Piece from "./Piece";
import { Droppable } from "react-beautiful-dnd";

const Sidebar = ({ pieces, buttonclicked, savebuttonclicked, upload, updatepieces, addpiece, setpixelfaktor, gettimestring, setstarttime }) => {
    const [sliderValue, setSliderValue] = useState(1); // initial value of the slider is 1
    const handleSliderChange = (event) => {
        setSliderValue(parseFloat(event.target.value));
        setpixelfaktor(parseFloat(event.target.value));
    };

    const handleStarttimeChange = (event) => {
        console.log(gettimestring(0));

        const selectedTime = event.target.value;
        const timeArray = selectedTime.split(":");
        console.log(timeArray)
        const newStarttime = new Date().setHours(timeArray[0], timeArray[1]);
        
        console.log(newStarttime)
        setstarttime(newStarttime);
      };

    return (
        <div className={'sidebar-portal'}>
            <Droppable droppableId={"sidebar_droppable"} direction='horizontal' type='piece'>
                {provided => (
                    <div className="puzzle-pieces sidebar-piece" ref={provided.innerRef} {...provided.droppableProps}>
                        {Object.keys(pieces).map((key, index) =>
                            <Piece key={"sb" + index} newID={pieces[key].id + "_sb"} index={index} piece={pieces[key]} isSidebar={true} updatePieces={updatepieces} />
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <button onClick={addpiece} className="add-piece sidebar-button">+</button>
            <input className="sidebar-button" type="range" min="0.05" max="2" step="0.05" value={sliderValue} onChange={handleSliderChange} />
            <div>{sliderValue}</div>
            <div className="leftbutton">Startzeit: </div>
            <input
                type="time"
                id="starttime"
                name="starttime"
                value={gettimestring(0)}
                onChange={handleStarttimeChange}
                className="sidebar-button"
            />            <button onClick={buttonclicked} className="sidebar-button">+</button>
            <button onClick={savebuttonclicked} className="sidebar-button">Download</button>
            <input type="file" accept=".txt" className="sidebar-button" onChange={upload} />

        </div>
    );
};

export default Sidebar;