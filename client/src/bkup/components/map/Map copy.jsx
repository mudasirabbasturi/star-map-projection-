import { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";

const Map = ({ showDrawer }) => {
  const [positions, setPositions] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      elemX: positions.x,
      elemY: positions.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragStart) {
        const dx = e.clientX - dragStart.mouseX;
        const dy = e.clientY - dragStart.mouseY;
        setPositions({
          x: dragStart.elemX + dx,
          y: dragStart.elemY + dy,
        });
      }
    };

    const handleMouseUp = () => {
      setDragStart(null);
    };

    if (dragStart) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragStart]);

  return (
    <div
      className="map glb"
      onMouseDown={handleMouseDown}
      style={{
        left: positions.x,
        top: positions.y,
        cursor: dragStart ? "grabbing" : "grab",
      }}
    >
      <div className="editIconWrapper" onClick={() => showDrawer("map")}>
        <MdEdit className="editIcon" />
      </div>
    </div>
  );
};

export default Map;
