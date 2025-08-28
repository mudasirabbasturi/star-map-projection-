import { useState, useEffect } from "react";
import { MdOutlineEditNote, MdEdit } from "react-icons/md";
import { Spin } from "antd";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState({ x: 0, y: 0 });
  const handleMouseDown = (e) => {
    e.preventDefault();
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startX = positions.x;
    const startY = positions.y;
    const handleMouseMove = (e) => {
      const dx = e.clientX - startMouseX;
      const dy = e.clientY - startMouseY;
      setPositions({
        x: startX + dx,
        y: startY + dy,
      });
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="app-container">
      <div className="main-body">
        <Spin spinning={loading} tip="Generating poster..." size="large">
          <div
            className={`poster glb ${loading ? "download-mode" : ""}`}
            style={{ position: "relative" }}
          >
            <div className="editIconWrapper">
              <MdOutlineEditNote className="editIcon" />
            </div>
            <div className="momentContent">
              <div
                className="textNode glb"
                onMouseDown={handleMouseDown}
                style={{
                  position: "relative",
                  left: positions.x,
                  top: positions.y,
                  cursor: "grabbing",
                }}
              >
                <div className="editIconWrapper">
                  <MdEdit className="editIcon" />
                </div>
                London, United Kingdom
              </div>
              <div>X: {positions.x}</div>
              <div>Y: {positions.y}</div>
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default App;
