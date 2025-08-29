import { useState } from "react";
import { MdOutlineEditNote, MdEdit } from "react-icons/md";
import { Spin } from "antd";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false); // new state

  const Cartesian = () => {
    if (!dragging) return null; // only show when dragging
    return (
      <>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: "100%",
            height: "1px",
            background: "#7d5cff52",
            transform: "translateY(-0.5px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            width: "1px",
            height: "100%",
            background: "#7d5cff52",
            transform: "translateX(-0.5px)",
            pointerEvents: "none",
          }}
        />
      </>
    );
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true); // start dragging → show lines

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
      setDragging(false); // stop dragging → hide lines
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
            {/* Show Cartesian lines only while dragging */}
            <Cartesian />

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
