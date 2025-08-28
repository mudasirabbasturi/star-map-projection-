import { useState, useEffect, useRef } from "react";
import { MdEdit } from "react-icons/md";

const Map = ({ showDrawer }) => {
  const [positions, setPositions] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);
  const [starScale, setStarScale] = useState(1); // ⭐ control star size scale
  const canvasRef = useRef(null);
  const width = 420;
  const height = 420;

  // Convert RA/Dec to 2D coordinates
  const projectStar = (ra, dec) => {
    const raDeg = (ra / 24) * 360; // RA: 0–24h → 0–360°
    const x = (raDeg / 360) * width;
    const y = height / 2 - (dec / 90) * (height / 2);
    return { x, y };
  };

  // Function to draw stars
  const drawStars = (stars, ctx) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    stars.forEach((star) => {
      const size = Math.max(0.5, (2 - star.mag * 0.3) * starScale);
      ctx.beginPath();
      ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    fetch("https://ofrohn.github.io/data/stars.6.json")
      .then((res) => res.json())
      .then((data) => {
        const stars = data.features.map((f) => {
          const [ra, dec] = f.geometry.coordinates;
          return { ...projectStar(ra, dec), mag: f.properties.mag };
        });

        drawStars(stars, ctx);

        // Redraw stars when starScale changes
        const redraw = () => drawStars(stars, ctx);
        redraw();

        return () => {};
      });
  }, [starScale]); // redraw when starScale changes

  // Dragging logic
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

    const handleMouseUp = () => setDragStart(null);

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
    <>
      <div
        className="map glb"
        onMouseDown={handleMouseDown}
        style={{
          position: "absolute",
          left: positions.x,
          top: positions.y,
          cursor: dragStart ? "grabbing" : "grab",
          width,
          height,
          border: "1px solid #ccc",
          borderRadius: "50%", // ⭐ Makes it circular
          overflow: "hidden", // ensures canvas respects the border radius
        }}
      >
        <div className="editIconWrapper" onClick={() => showDrawer("map")}>
          <MdEdit className="editIcon" />
        </div>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{ display: "block", borderRadius: "50%" }} // circle for canvas itself
        ></canvas>
      </div>

      {/* Slider to control star size */}
      <div style={{ marginTop: 10 }}>
        <label>Star Size: </label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={starScale}
          onChange={(e) => setStarScale(parseFloat(e.target.value))}
        />
      </div>
    </>
  );
};

export default Map;
