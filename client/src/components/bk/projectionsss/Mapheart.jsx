import { useEffect, useRef, lazy, Suspense } from "react";
import { MdEdit } from "react-icons/md";
import Heart from "@components/map/projections/Heart";

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
      style={{
        position: "relative",
      }}
    >
      <canvas ref={canvasRef} style={{}} />
      <div className="editIconWrapper" onClick={() => showDrawer("map")}>
        <MdEdit className="editIcon" />
      </div>
    </div>
  );
};

export default Map;
