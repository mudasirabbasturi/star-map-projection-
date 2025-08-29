import { useState, useEffect, useRef } from "react";
import { MdEdit } from "react-icons/md";

const Map = ({ showDrawer }) => {
  const [positions, setPositions] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);
  const containerRef = useRef(null); // parent div
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const parent = containerRef.current;
      if (!parent) return;

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;

      drawHeart();
    };

    const heartPath = (ctx, cx, cy, scale) => {
      ctx.beginPath();
      for (let t = 0; t < Math.PI * 2; t += 0.02) {
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = -(
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)
        );
        x = cx + x * scale;
        y = cy + y * scale;
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    // const drawHeart = () => {
    //   ctx.clearRect(0, 0, canvas.width, canvas.height);
    //   const scale = Math.min(canvas.width, canvas.height) / 50;
    //   const cx = canvas.width / 2;
    //   const cy = canvas.height / 2 + scale * 2;
    //   heartPath(ctx, cx, cy, scale);
    //   ctx.lineWidth = 3;
    //   ctx.strokeStyle = "white";
    //   ctx.stroke();
    // };
    const drawHeart = () => {
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

      // Compute scale with a small padding factor (e.g., 0.95)
      const scaleX = canvas.width / heartWidth;
      const scaleY = canvas.height / heartHeight;
      const scale = Math.min(scaleX, scaleY) * 0.95; // 5% padding

      // Compute center offsets so heart is perfectly centered
      const offsetX = (xMin + xMax) / 2;
      const offsetY = (yMin + yMax) / 2;

      const cx = canvas.width / 2 - offsetX * scale;
      const cy = canvas.height / 2 - offsetY * scale;

      // Draw heart
      heartPath(ctx, cx, cy, scale);

      ctx.lineWidth = 3;
      ctx.strokeStyle = "white";
      ctx.stroke();
    };

    resize();
    window.addEventListener("resize", resize); // optional if parent size changes on window resize
    return () => window.removeEventListener("resize", resize);
  }, []);

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
