import { useEffect, useRef } from "react";
import { MdEdit } from "react-icons/md";
import Heart from "@components/map/projections/Heart";

const Map = ({ showDrawer, styles }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasStyle = styles.canvas || {
      bgColor: "transparent",
      width: 100,
      height: 100,
    };
    canvas.width = canvasStyle.width;
    canvas.height = canvasStyle.height;
    const ctx = canvas.getContext("2d");

    Heart(ctx, canvas);
  }, [styles]);

  return (
    <div
      className="map glb"
      style={{ position: "relative", background: styles.poster.bgColor }}
    >
      <canvas ref={canvasRef} />
      <div className="editIconWrapper" onClick={() => showDrawer("map")}>
        <MdEdit className="editIcon" />
      </div>
    </div>
  );
};

export default Map;
