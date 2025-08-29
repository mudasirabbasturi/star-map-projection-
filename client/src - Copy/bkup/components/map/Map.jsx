import { useState, useEffect, useRef } from "react";
import { MdEdit } from "react-icons/md";

const Map = ({ showDrawer }) => {
  const [positions, setPositions] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [stars, setStars] = useState([]);

  // Fetch stars once
  useEffect(() => {
    fetch("https://ofrohn.github.io/data/stars.6.json")
      .then((res) => res.json())
      .then((data) =>
        setStars(
          Array.isArray(data.features) ? data.features : data.stars || []
        )
      )
      .catch(console.error);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const heartPath = (ctx, cx, cy, scale) => {
      ctx.beginPath();
      for (let t = 0; t < Math.PI * 2; t += 0.01) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)
        );
        ctx.lineTo(cx + x * scale, cy + y * scale);
      }
      ctx.closePath();
    };

    const drawHeartWithStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate heart bounding box
      let xMin = Infinity,
        xMax = -Infinity,
        yMin = Infinity,
        yMax = -Infinity;
      for (let t = 0; t < Math.PI * 2; t += 0.01) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)
        );
        if (x < xMin) xMin = x;
        if (x > xMax) xMax = x;
        if (y < yMin) yMin = y;
        if (y > yMax) yMax = y;
      }

      const heartWidth = xMax - xMin;
      const heartHeight = yMax - yMin;

      // Scale and center
      const scaleX = canvas.width / heartWidth;
      const scaleY = canvas.height / heartHeight;
      const scale = Math.min(scaleX, scaleY) * 0.95;

      const offsetX = (xMin + xMax) / 2;
      const offsetY = (yMin + yMax) / 2;

      const cx = canvas.width / 2 - offsetX * scale;
      const cy = canvas.height / 2 - offsetY * scale;

      // Draw heart outline
      heartPath(ctx, cx, cy, scale);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "white";
      ctx.stroke();

      // Draw stars inside heart
      stars.forEach((star) => {
        const ra = star.geometry.coordinates[0]; // longitude-like
        const dec = star.geometry.coordinates[1]; // latitude-like
        const mag = star.properties.mag; // brightness

        // Map RA/DEC roughly to heart coordinates
        const x = cx + ((ra - xMin) / heartWidth - 0.5) * heartWidth * scale;
        const y = cy + ((dec - yMin) / heartHeight - 0.5) * heartHeight * scale;

        // Redefine heart path for isPointInPath
        heartPath(ctx, cx, cy, scale);
        if (ctx.isPointInPath(x, y)) {
          const radius = Math.max(0.5, 4 - mag * 0.3);
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = "white";
          ctx.fill();
        }
      });
    };

    const resize = () => {
      if (!containerRef.current) return;
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
      drawHeartWithStars();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [stars]);

  // Dragging
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
        setPositions({
          x: dragStart.elemX + e.clientX - dragStart.mouseX,
          y: dragStart.elemY + e.clientY - dragStart.mouseY,
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
    <div
      ref={containerRef}
      className="map glb"
      onMouseDown={handleMouseDown}
      style={{
        left: positions.x,
        top: positions.y,
        cursor: dragStart ? "grabbing" : "grab",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
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
