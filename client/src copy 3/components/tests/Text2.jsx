import { useState, useEffect, useRef } from "react";

const SVGBackground = ({ styles, paperSize, orientation, children }) => {
  // Paper dimensions in mm (standard sizes)
  const paperDimensions = {
    A0: { width: 841, height: 1189 },
    A1: { width: 594, height: 841 },
    A2: { width: 420, height: 594 },
    A3: { width: 297, height: 420 },
    A4: { width: 210, height: 297 },
    A5: { width: 148, height: 210 },
    A6: { width: 105, height: 148 },
    Letter: { width: 216, height: 279 },
    Legal: { width: 216, height: 356 },
  };

  const dimensions = paperDimensions[paperSize] || paperDimensions.A4;
  const width =
    orientation === "landscape" ? dimensions.height : dimensions.width;
  const height =
    orientation === "landscape" ? dimensions.width : dimensions.height;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      style={{
        border: `${styles.borderWidth}px ${styles.borderStyle} ${styles.borderColor}`,
        borderRadius: `${styles.borderRadius}%`,
      }}
    >
      {/* Background */}
      <rect
        width="100%"
        height="100%"
        fill={
          styles.bgType === "solid"
            ? styles.bgColor
            : "url(#gradientBackground)"
        }
      />

      {/* Gradient definition if needed */}
      {styles.bgType !== "solid" && (
        <defs>
          {styles.bgGradientType === "linear" && (
            <linearGradient
              id="gradientBackground"
              gradientTransform={`rotate(${styles.bgGradientAngle})`}
            >
              {styles.bgGradientColor.map((color, index) => (
                <stop
                  key={index}
                  offset={`${
                    (index * 100) / (styles.bgGradientColor.length - 1)
                  }%`}
                  stopColor={color}
                />
              ))}
            </linearGradient>
          )}
          {styles.bgGradientType === "radial" && (
            <radialGradient id="gradientBackground">
              {styles.bgGradientColor.map((color, index) => (
                <stop
                  key={index}
                  offset={`${
                    (index * 100) / (styles.bgGradientColor.length - 1)
                  }%`}
                  stopColor={color}
                />
              ))}
            </radialGradient>
          )}
        </defs>
      )}

      {children}
    </svg>
  );
};

const SVGPosterWrapper = ({ styles, children, onEdit }) => {
  return (
    <g
      transform={`translate(${(100 - styles.posterWrapper.width) / 2}, ${
        (100 - styles.posterWrapper.height) / 2
      })`}
    >
      <rect
        width={`${styles.posterWrapper.width}%`}
        height={`${styles.posterWrapper.height}%`}
        fill={styles.posterWrapper.bgColor}
        stroke={styles.posterWrapper.borderColor}
        strokeWidth={styles.posterWrapper.borderWidth}
        rx={styles.posterWrapper.borderRadius}
        ry={styles.posterWrapper.borderRadius}
      />
      {children}
    </g>
  );
};

const SVGMap = ({ styles, position, onMouseDown, onEdit, children }) => {
  return (
    <g transform={`translate(0, ${position})`} onMouseDown={onMouseDown}>
      <rect
        width={`${styles.map.width}%`}
        height={`${styles.map.height}%`}
        fill="transparent"
        stroke="transparent"
      />
      {children}
    </g>
  );
};

const SVGText = ({
  content,
  styles,
  position,
  onMouseDown,
  type = "content",
}) => {
  const textStyles = type === "title" ? styles.content.title : styles.content;

  return (
    <text
      x="50%"
      y={position}
      textAnchor="middle"
      fill={textStyles.textColor}
      fontSize={textStyles.fontSize}
      fontFamily={textStyles.fontFamily}
      fontStyle={textStyles.fontStyle}
      fontWeight={textStyles.fontWeight}
      textDecoration={textStyles.textDecoration}
      onMouseDown={onMouseDown}
      style={{ cursor: "move" }}
    >
      {content}
    </text>
  );
};

const SVGContentBox = ({
  content,
  styles,
  position,
  onMouseDown,
  onEdit,
  show,
}) => {
  return (
    <g transform={`translate(0, ${position})`}>
      <rect
        width={`${styles.content.width}%`}
        height={`${styles.content.height}%`}
        fill={styles.content.bgColor}
        stroke={styles.content.borderColor}
        strokeWidth={styles.content.borderWidth}
        rx={styles.content.borderRadius}
        ry={styles.content.borderRadius}
        onMouseDown={onMouseDown}
      />

      {/* Content text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={styles.content.textColor}
        fontSize={styles.content.fontSize}
        fontFamily={styles.content.fontFamily}
      >
        {show.address && (
          <tspan x="50%" dy="-1.2em">
            {content.address}
          </tspan>
        )}
        {show.date && (
          <tspan x="50%" dy="1.2em">
            {content.date}
            {show.time && `, ${content.time}`}
          </tspan>
        )}
        {show.message && (
          <tspan x="50%" dy="1.2em">
            {content.message}
          </tspan>
        )}
        {show.coordinate && (
          <tspan x="50%" dy="1.2em">
            {content.coordinate}
          </tspan>
        )}
      </text>
    </g>
  );
};

// Main component
const SVGPoster = ({
  styles,
  positions,
  content,
  show,
  onElementMouseDown,
  paperSize = "A4",
  orientation = "portrait",
}) => {
  return (
    <div className="svg-poster-container">
      <SVGBackground
        styles={styles}
        paperSize={paperSize}
        orientation={orientation}
      >
        <SVGPosterWrapper styles={styles}>
          {/* Map */}
          <SVGMap
            styles={styles}
            position={positions.map.y}
            onMouseDown={(e) => onElementMouseDown(e, "map")}
          >
            {/* Your map SVG content would go here */}
            <rect
              width="100%"
              height="100%"
              // fill={styles.map.fill}
              clipPath={
                styles.map.maskShape === "circle" ? "url(#circleClip)" : null
              }
            />

            {/* Clip path for circular map */}
            <defs>
              <clipPath id="circleClip">
                <circle cx="50%" cy="50%" r="50%" />
              </clipPath>
            </defs>
          </SVGMap>

          {/* Title */}
          {show.title && (
            <SVGText
              content={content.title}
              styles={styles}
              position={positions.title.y}
              onMouseDown={(e) => onElementMouseDown(e, "title")}
              type="title"
            />
          )}

          {/* Content Box */}
          <SVGContentBox
            content={content}
            styles={styles}
            position={positions.content.y}
            onMouseDown={(e) => onElementMouseDown(e, "content")}
            show={show}
          />
        </SVGPosterWrapper>
      </SVGBackground>
    </div>
  );
};

// Usage in your main App component
const App = () => {
  // Your existing state and functions
  const [positions, setPositions] = useState({
    map: { y: 12 },
    title: { y: 4 },
    content: { y: 80 },
  });

  const [styles, setStyles] = useState({
    // Your existing style definitions
  });

  const [content, setContent] = useState({
    // Your existing content
  });

  const [show, setShow] = useState({
    // Your existing show settings
  });

  const [paperSize, setPaperSize] = useState("A4");
  const [orientation, setOrientation] = useState("portrait");

  const handleElementMouseDown = (e, element) => {
    // Your existing mouse down logic adapted for SVG
    e.preventDefault();
    // ... your implementation
  };

  return (
    <div className="app">
      {/* Your controls and sidebar */}
      <div className="controls">
        <select
          value={paperSize}
          onChange={(e) => setPaperSize(e.target.value)}
        >
          <option value="A0">A0</option>
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="A3">A3</option>
          <option value="A4">A4</option>
          <option value="A5">A5</option>
          <option value="A6">A6</option>
          <option value="Letter">Letter</option>
          <option value="Legal">Legal</option>
        </select>

        <button
          onClick={() =>
            setOrientation(
              orientation === "portrait" ? "landscape" : "portrait"
            )
          }
        >
          {orientation === "portrait"
            ? "Switch to Landscape"
            : "Switch to Portrait"}
        </button>
      </div>

      {/* SVG Poster */}
      <SVGPoster
        styles={styles}
        positions={positions}
        content={content}
        show={show}
        onElementMouseDown={handleElementMouseDown}
        paperSize={paperSize}
        orientation={orientation}
      />
    </div>
  );
};

export default App;
