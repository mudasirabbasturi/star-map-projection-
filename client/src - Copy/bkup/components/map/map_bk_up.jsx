import { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";

const Map = ({ showDrawer }) => {
  const [positions, setPositions] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 200, height: 150 });
  const [dragStart, setDragStart] = useState(null);
  const [resizeStart, setResizeStart] = useState(null);

  // Start drag
  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      elemX: positions.x,
      elemY: positions.y,
    });
  };

  // Start resize
  const handleResizeMouseDown = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    setResizeStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      direction,
      startWidth: size.width,
      startHeight: size.height,
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
      if (resizeStart) {
        const dx = e.clientX - resizeStart.mouseX;
        const dy = e.clientY - resizeStart.mouseY;
        let newWidth = resizeStart.startWidth;
        let newHeight = resizeStart.startHeight;

        if (resizeStart.direction.includes("right")) newWidth += dx;
        if (resizeStart.direction.includes("bottom")) newHeight += dy;
        if (resizeStart.direction.includes("left")) {
          newWidth -= dx;
          setPositions((prev) => ({ ...prev, x: prev.x + dx }));
        }
        if (resizeStart.direction.includes("top")) {
          newHeight -= dy;
          setPositions((prev) => ({ ...prev, y: prev.y + dy }));
        }

        // Minimum size limit
        newWidth = Math.max(50, newWidth);
        newHeight = Math.max(50, newHeight);

        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setDragStart(null);
      setResizeStart(null);
    };

    if (dragStart || resizeStart) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragStart, resizeStart]);

  // Small resize circles for corners
  const handles = [
    {
      direction: "top-left",
      style: { top: -5, left: -5, cursor: "nwse-resize" },
    },
    {
      direction: "top-right",
      style: { top: -5, right: -5, cursor: "nesw-resize" },
    },
    {
      direction: "bottom-left",
      style: { bottom: -5, left: -5, cursor: "nesw-resize" },
    },
    {
      direction: "bottom-right",
      style: { bottom: -5, right: -5, cursor: "nwse-resize" },
    },
  ];

  return (
    <div
      className="map glb"
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: positions.x,
        top: positions.y,
        width: size.width,
        height: size.height,
        border: "1px solid #ccc",
        cursor: dragStart ? "grabbing" : "grab",
      }}
    >
      <div className="editIconWrapper" onClick={() => showDrawer("map")}>
        <MdEdit className="editIcon" />
      </div>

      {handles.map((h, i) => (
        <div
          key={i}
          onMouseDown={(e) => handleResizeMouseDown(e, h.direction)}
          style={{
            position: "absolute",
            width: 10,
            height: 10,
            background: "white",
            border: "1px solid black",
            borderRadius: "50%",
            ...h.style,
          }}
        ></div>
      ))}
    </div>
  );
};

export default Map;
