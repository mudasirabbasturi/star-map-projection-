import { useEffect, useRef } from "react";
import { MdEdit } from "react-icons/md";
import Heart from "./projections/Heart";

const Map = ({ handleMouseDown, positions, showDrawer, styles }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");

    Heart(ctx, canvas);
  }, []);

  return (
    <div
      className="map glb"
      onMouseDown={(e) => handleMouseDown(e, "map")}
      style={{
        position: "relative",
        left: positions.map.x,
        top: positions.map.y,
        cursor: "grabbing",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "90%",
          aspectRatio: "1/1",
          display: "block",
          background: "black",
        }}
      />
      <div className="editIconWrapper" onClick={() => showDrawer("map")}>
        <MdEdit className="editIcon" />
      </div>
    </div>
  );
};

export default Map;
