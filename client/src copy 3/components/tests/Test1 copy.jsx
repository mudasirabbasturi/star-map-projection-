import { useState, useEffect, useRef } from "react";

const Test1 = () => {
  const [positions, setPositions] = useState({
    txtOne: { y: 60 },
    txtTwo: { y: 65 },
    txtThree: { y: 70 },
    txtFour: { y: 75 },
  });

  const [dragging, setDragging] = useState(false);
  const [svgDimensions, setSvgDimensions] = useState({
    width: 300,
    height: 600,
  });
  const svgRef = useRef(null);

  // Update SVG dimensions based on container
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect();
        setSvgDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleMouseDown = (e, element) => {
    e.preventDefault();
    setDragging(true);

    const startY = e.clientY;
    const svgHeight = svgDimensions.height;
    const initialPercent = positions[element].y;

    const handleMouseMove = (e) => {
      const deltaY = e.clientY - startY;
      const deltaPercent = (deltaY / svgHeight) * 100;

      setPositions((prev) => ({
        ...prev,
        [element]: {
          y: Math.max(0, Math.min(100, initialPercent + deltaPercent)),
        },
      }));
    };

    const handleMouseUp = () => {
      setDragging(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Convert percentage to SVG Y coordinate
  const percentToY = (percent) => (percent / 100) * svgDimensions.height;

  return (
    <div className="d-flex justify-content-center align-items-center border h-100">
      <div className="position-relative d-flex justify-content-end align-items-center flex-column border h-75 w-25 pb-3">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
          preserveAspectRatio="xMidYMid meet"
          className="position-absolute"
          style={{
            top: 0,
            left: 0,
            pointerEvents: dragging ? "none" : "all",
          }}
        >
          {/* Text One */}
          <text
            x={svgDimensions.width / 2}
            y={percentToY(positions.txtOne.y)}
            textAnchor="middle"
            className="svg-text txtOne"
            onMouseDown={(e) => handleMouseDown(e, "txtOne")}
            style={{ cursor: "move" }}
          >
            Text One
          </text>

          {/* Text Two */}
          <text
            x={svgDimensions.width / 2}
            y={percentToY(positions.txtTwo.y)}
            textAnchor="middle"
            className="svg-text txtTwo"
            onMouseDown={(e) => handleMouseDown(e, "txtTwo")}
            style={{ cursor: "move" }}
          >
            Text Two
          </text>

          {/* Text Three */}
          <text
            x={svgDimensions.width / 2}
            y={percentToY(positions.txtThree.y)}
            textAnchor="middle"
            className="svg-text txtThree"
            onMouseDown={(e) => handleMouseDown(e, "txtThree")}
            style={{ cursor: "move" }}
          >
            Text Three
          </text>

          {/* Text Four */}
          <text
            x={svgDimensions.width / 2}
            y={percentToY(positions.txtFour.y)}
            textAnchor="middle"
            className="svg-text txtFour"
            onMouseDown={(e) => handleMouseDown(e, "txtFour")}
            style={{ cursor: "move" }}
          >
            Text Four
          </text>
        </svg>
      </div>
    </div>
  );
};

export default Test1;
