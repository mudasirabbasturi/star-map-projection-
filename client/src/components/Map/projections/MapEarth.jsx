import { useEffect, useRef } from "react";
import { MdEdit } from "react-icons/md";
import * as d3 from "d3";
import customGeo from "@components/map/projections/custom.geo.json";

const Map = ({ showDrawer }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Create projection to fit the canvas size
    const projection = d3
      .geoMercator()
      .fitSize([canvas.width, canvas.height], customGeo);

    // Create a path generator for canvas
    const path = d3.geoPath(projection, ctx);

    // Clear canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each feature
    ctx.beginPath();
    customGeo.features.forEach((feature) => {
      path(feature);
    });
    ctx.fillStyle = "#ccc";
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }, []);

  return (
    <div className="map glb" style={{ position: "relative" }}>
      <canvas ref={canvasRef} />
      <div className="editIconWrapper" onClick={() => showDrawer("map")}>
        <MdEdit className="editIcon" />
      </div>
    </div>
  );
};

export default Map;
