import { useEffect, useRef } from "react";
import { MdEdit } from "react-icons/md";
import Heart from "./projections/Heart";

const Map = ({ handleMouseDown, positions }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 300; // width in px
    canvas.height = 300; // height in px
    const ctx = canvas.getContext("2d");

    // Use Heart projection
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
      <div className="editIconWrapper">
        <MdEdit className="editIcon" />
      </div>
    </div>
  );
};

export default Map;
